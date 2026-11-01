import { useTranslation } from "react-i18next";
import { Icon } from "../../components/icons/Icon";
import { useAppState } from "../../state/context";
import { deleteSavedConditions, saveDraft } from "../../state/savedConditions";
import type { TargetsDraft } from "./draft";

/**
 * The opt-in switch for saving the form on this device, the separate allergen choice, the
 * delete action, and the shared-browser note (ADR-036 D1, D3; docs/en/UI_DESIGN.md §3.1).
 */
export function SaveConditions({ draft }: { readonly draft: TargetsDraft }) {
  const { t } = useTranslation();
  const { state, dispatch } = useAppState();
  const { on, allergens, notice } = state.saved;

  const remove = () => {
    deleteSavedConditions();
    dispatch({ type: "savedChanged", on: false, allergens: false, notice: "deleted" });
  };

  return (
    <fieldset className="flex flex-col gap-2 rounded-3xl border border-transparent bg-butter p-4">
      <legend className="float-left mb-1 flex w-full items-center gap-2 font-bold">
        <Icon name="save" size={22} />
        {t("saved.legend")}
      </legend>
      <label className="flex min-h-10 items-center gap-2">
        <input
          type="checkbox"
          checked={on}
          onChange={(event) => {
            if (!event.currentTarget.checked) {
              remove();
              return;
            }
            const ok = saveDraft(draft, false);
            dispatch({ type: "savedChanged", on: ok, allergens: false, notice: ok ? undefined : "writeFailed" });
          }}
          className="size-5 shrink-0 accent-primary"
        />
        <span>{t("saved.save")}</span>
      </label>
      {on && (
        <label className="ml-7 flex min-h-10 items-center gap-2">
          <input
            type="checkbox"
            checked={allergens}
            onChange={(event) => {
              const next = event.currentTarget.checked;
              const ok = saveDraft(draft, next);
              dispatch({ type: "savedChanged", on: true, allergens: ok ? next : allergens, notice: ok ? undefined : "writeFailed" });
            }}
            className="size-5 shrink-0 accent-primary"
          />
          <span>{t("saved.allergens")}</span>
        </label>
      )}
      <p className="m-0 text-sm text-muted">{t("saved.note")}</p>
      {on && (
        <button type="button" onClick={remove} className="self-start btn-secondary">
          {t("saved.delete")}
        </button>
      )}
      <div role="status">
        {notice === "deleted" && <p className="m-0">{t("saved.deleted")}</p>}
        {notice === "writeFailed" && <p className="m-0 notice-warning">{t("saved.writeFailed")}</p>}
      </div>
    </fieldset>
  );
}
