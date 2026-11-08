import { useMemo, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Contradiction, InputError, InputField, Preset } from "../../domain/recommendation/types";
import { checkContradictions } from "../../domain/recommendation/validate";
import { ALLERGENS, CUISINES, EQUIPMENT, MANDATORY_ALLERGENS, type Allergen, type Cuisine, type Equipment } from "../../shared/content";
import { DEFAULT_LOCALE, isLocale } from "../../shared/locales";
import { FoodPicker } from "../components/FoodPicker";
import { NumberField } from "../components/NumberField";
import { ViewHeading } from "../components/ViewHeading";
import { formatNumber, formatNutrientRange } from "../format/format";
import { useNavigation } from "../navigation/context";
import { useAppState, useLoadedContent } from "../state/context";
import { search } from "../state/recommendation";
import { deleteSavedConditions, saveDraft } from "../state/savedConditions";
import { effortKey, PRESETS } from "../i18n/engineCodes";
import { defaultDraft, draftToRequest, stepped, withNumber, withPreset, type EquipmentMode, type NumberField as Field, type TargetsDraft } from "./targets/draft";
import { contradictionMessage, errorTarget, fieldId, inputErrorMessage, type FormTarget } from "./targets/errors";
import { foodOptions } from "./targets/foodSearch";
import { applySuggestion, touchesAdvanced } from "./targets/freeText";
import { FreeTextConditions } from "./targets/FreeTextConditions";
import { SaveConditions } from "./targets/SaveConditions";
import { useTextContext } from "./useTextContext";
import { Icon, Illustration } from "../components/icons/Icon";
import type { IconName } from "../components/icons/iconData";

/** The engine field whose name the stepper labels use; the others use their own label. */
const SPOKEN_NAME: Readonly<Partial<Record<Field, InputField>>> = {
  kcalMin: "kcal.min",
  kcalMax: "kcal.max",
  proteinMin: "proteinMin",
  fatMax: "fatMax",
  carbohydrateMin: "carbohydrate.min",
  carbohydrateMax: "carbohydrate.max",
};

const EQUIPMENT_MODES: readonly EquipmentMode[] = ["no_limit", "microwave_only", "choose"];
const RECOMMENDED = ALLERGENS.filter((allergen) => !(MANDATORY_ALLERGENS as readonly Allergen[]).includes(allergen));
const ADVANCED_TARGETS: ReadonlySet<FormTarget> = new Set(["kcalMin", "kcalMax", "proteinMin", "fatMax", "carbohydrateMin", "carbohydrateMax", "servings", "required", "excluded"]);

function toggled<T>(list: readonly T[], item: T): T[] {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
}

function Fieldset({ legend, hint, panel = false, children }: { readonly legend: string; readonly hint?: string; readonly panel?: boolean; readonly children: ReactNode }) {
  return (
    <fieldset className={panel ? "panel flex flex-col gap-2 p-4" : "flex flex-col gap-2 rounded-2xl border-2 border-surface-muted p-3"}>
      <legend className={panel ? "float-left mb-1 w-full font-bold" : "px-1 font-bold"}>{legend}</legend>
      {hint !== undefined && <p className="m-0 text-sm text-muted">{hint}</p>}
      {children}
    </fieldset>
  );
}

function Choice({
  type,
  name,
  checked,
  onChange,
  card = false,
  children,
}: {
  readonly type: "radio" | "checkbox";
  readonly name: string;
  readonly checked: boolean;
  readonly onChange: () => void;
  /** A larger choice with a tinted background when selected (presets). */
  readonly card?: boolean;
  readonly children: ReactNode;
}) {
  return (
    <label className={card ? "flex min-h-10 cursor-pointer items-center gap-3 rounded-2xl border-2 border-transparent bg-surface-muted px-3 py-2 has-checked:border-primary has-checked:bg-mint" : "flex min-h-10 items-center gap-2"}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="size-5 shrink-0 accent-primary" />
      <span>{children}</span>
    </label>
  );
}

/** A group of conditions under its own heading (ADR-037 D6). */
function Group({ icon, title, children }: { readonly icon: IconName; readonly title: string; readonly children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold">
        <Icon name={icon} size={26} />
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Whether the form differs from its preset defaults inside "More conditions". */
function touchesAdvancedDraft(draft: TargetsDraft): boolean {
  const base = defaultDraft(draft.preset);
  const numbers = (Object.keys(base.numbers) as Field[]).filter((field) => field !== "maxMinutes");
  return (
    draft.edited ||
    numbers.some((field) => draft.numbers[field].trim() !== base.numbers[field]) ||
    draft.effort !== undefined ||
    draft.cuisines.length > 0 ||
    draft.equipmentMode !== base.equipmentMode ||
    draft.required.length > 0 ||
    draft.excluded.length > 0 ||
    draft.allergens.length > 0
  );
}

/** Targets and conditions (docs/en/UI_DESIGN.md §3.1, ADR-030 D4, D6, D7). */
export function TargetsView({ reloaded }: { readonly reloaded: boolean }) {
  const { t, i18n } = useTranslation();
  const locale = isLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE;
  const { navigated, navigate } = useNavigation();
  const { calc, text, data } = useLoadedContent();
  const { state, dispatch } = useAppState();
  const draft = state.draft ?? defaultDraft();
  const [errors, setErrors] = useState<readonly InputError[]>([]);
  const [blocked, setBlocked] = useState<readonly Contradiction[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const blockedRef = useRef<HTMLDivElement>(null);

  // Restored values inside "More conditions" are shown, not hidden (ADR-037 D6).
  const restored = state.saved.notice === "restored" && state.draft !== undefined && touchesAdvancedDraft(state.draft);
  const [openedForRestore, setOpenedForRestore] = useState(false);
  if (restored && !openedForRestore) {
    setOpenedForRestore(true);
    setAdvancedOpen(true);
  }

  const update = (next: TargetsDraft) => {
    dispatch({ type: "draftChanged", draft: next });
  };

  const options = useMemo(() => foodOptions(calc, text, (group) => t("conditions.foodGroup", { group: t(`proteinGroup.${group}`) })), [calc, text, t]);
  const { choiceLabel: labelOf } = useTextContext();

  // Contradictions are checked live with the engine, once the targets are numbers.
  const request = draftToRequest(draft);
  const targetNumbers = [request.targets.kcal.min, request.targets.kcal.max, request.targets.proteinMin, request.targets.carbohydrate?.min];
  const contradictions = targetNumbers.every((value) => value === undefined || Number.isFinite(value)) ? checkContradictions(request.targets) : [];

  const errorText = (error: InputError) => inputErrorMessage(error, t, locale);
  const errorsFor = (target: FormTarget) => errors.filter((error) => errorTarget(error) === target).map(errorText);

  const contradictionText = (contradiction: Contradiction) => contradictionMessage(contradiction, t, locale);

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Saved as typed, before validation, so a reload shows the same form (ADR-036 D4, D5).
    if (state.saved.on && !saveDraft(draft, state.saved.allergens)) {
      dispatch({ type: "savedChanged", on: true, allergens: state.saved.allergens, notice: "writeFailed" });
    }
    const result = search(request, data);
    if (!result.ok) {
      setErrors(result.errors);
      setBlocked([]);
      if (result.errors.some((error) => ADVANCED_TARGETS.has(errorTarget(error)))) setAdvancedOpen(true);
      // Wait for the summary to render before moving focus to it.
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setErrors([]);
    if (result.value.pool.blocked) {
      setBlocked(result.value.pool.contradictions.filter((contradiction) => contradiction.severity === "blocking"));
      requestAnimationFrame(() => blockedRef.current?.focus());
      return;
    }
    dispatch({ type: "draftChanged", draft });
    dispatch({ type: "searched", pool: result.value.pool, selection: result.value.selection });
    navigate({ name: "candidates" });
  };

  const numberField = (field: Field, label: string, unit: string, hint?: string) => (
    <NumberField
      id={fieldId(field)}
      label={label}
      spokenName={SPOKEN_NAME[field] === undefined ? label : t(`inputField.${SPOKEN_NAME[field]}`)}
      value={draft.numbers[field]}
      unit={unit}
      errors={errorsFor(field)}
      onChange={(value) => {
        update(withNumber(draft, field, value));
      }}
      onStep={(direction) => {
        update(withNumber(draft, field, stepped(draft.numbers[field], field, direction)));
      }}
      {...(hint === undefined ? {} : { hint })}
    />
  );

  const presetLabel = (preset: Preset) => {
    const targets = defaultDraft(preset).numbers;
    return (
      <>
        <span className="font-medium">{t(`preset.${preset}`)}</span>{" "}
        <span className="text-sm text-muted">
          {t("targets.presetSummary", {
            kcal: formatNutrientRange(locale, "ENERC_KCAL", Number(targets.kcalMin), Number(targets.kcalMax)),
            protein: formatNumber(locale, Number(targets.proteinMin)),
            fat: formatNumber(locale, Number(targets.fatMax)),
          })}
        </span>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <ViewHeading title={t("nav.views.targets")} focusOnMount={navigated} />
          <p className="m-0 text-muted">{t("app.tagline")}</p>
        </div>
        <Illustration name="hero" className="hidden w-44 shrink-0 sm:block md:w-56" />
      </div>
      {reloaded && (
        <p role="status" className="m-0 rounded border border-border bg-surface-muted p-3">
          {t(state.saved.on ? "nav.reloadNoticeSaved" : "nav.reloadNotice")}
        </p>
      )}
      {state.saved.notice === "restored" && (
        <div role="status" className="flex flex-col items-start gap-2 rounded border border-border bg-surface-muted p-3">
          <p className="m-0">{t("saved.restored")}</p>
          {state.saved.dropped > 0 && <p className="m-0">{t("saved.dropped", { count: state.saved.dropped })}</p>}
          <button
            type="button"
            onClick={() => {
              deleteSavedConditions();
              dispatch({ type: "savedChanged", on: false, allergens: false, notice: "deleted" });
            }}
            className="btn-secondary"
          >
            {t("saved.delete")}
          </button>
        </div>
      )}
      <p className="m-0 notice-warning">{t("disclaimer.medicalGuidance")}</p>

      {errors.length > 0 && (
        <div ref={summary} tabIndex={-1} role="alert" className="rounded border-2 border-not-met p-3">
          <p className="m-0 font-medium">{t("targets.errorSummary", { count: errors.length })}</p>
          <ul className="m-0 list-disc pl-6">
            {errors.map((error) => (
              <li key={`${error.code}-${JSON.stringify(error)}`}>
                <a
                  href={`#${fieldId(errorTarget(error))}`}
                  onClick={(event) => {
                    // Safari does not move focus to a form field when following a fragment link.
                    const field = document.getElementById(fieldId(errorTarget(error)));
                    if (field === null) return;
                    event.preventDefault();
                    field.focus();
                  }}
                  className="text-primary underline"
                >
                  {errorText(error)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <Fieldset panel legend={t("targets.presetLegend")} hint={t("disclaimer.presetsAreExamples")}>
          {PRESETS.map((preset) => (
            <Choice
              key={preset}
              type="radio"
              name="preset"
              card
              checked={draft.preset === preset && !draft.edited}
              onChange={() => {
                update(withPreset(draft, preset));
              }}
            >
              {presetLabel(preset)}
            </Choice>
          ))}
          {draft.edited && <p className="m-0 text-sm">{t("targets.presetEdited", { preset: t(`preset.${draft.preset}`) })}</p>}
        </Fieldset>

        {numberField("maxMinutes", t("targets.maxMinutes"), t("unit.minuteShort"), t("targets.noLimitHint"))}

        <FreeTextConditions
          locale={locale}
          onApply={(suggestion) => {
            update(applySuggestion(draft, suggestion, calc));
            if (touchesAdvanced(suggestion)) setAdvancedOpen(true);
          }}
          onShowAllergens={() => {
            setAdvancedOpen(true);
            // Wait for the section to open before moving focus into it.
            requestAnimationFrame(() => document.querySelector<HTMLInputElement>('input[name="allergen"]')?.focus());
          }}
        />

        <details
          id="targets-advanced"
          open={advancedOpen}
          onToggle={(event) => {
            setAdvancedOpen(event.currentTarget.open);
          }}
          className="panel"
        >
          <summary className="cursor-pointer rounded-3xl p-4 font-bold">{t("targets.advanced")}</summary>
          <div className="flex flex-col gap-6 p-3 pt-1">
            <Group icon="servings" title={t("targets.groups.targets")}>
              <Fieldset legend={t("targets.nutritionLegend")} hint={t("targets.optionalHint")}>
                <Fieldset legend={t("targets.kcalLegend")}>
                  <div className="flex flex-wrap gap-4">
                    {numberField("kcalMin", t("targets.min"), "kcal")}
                    {numberField("kcalMax", t("targets.max"), "kcal")}
                  </div>
                </Fieldset>
                {numberField("proteinMin", t("targets.proteinMin"), "g")}
                {numberField("fatMax", t("targets.fatMax"), "g")}
                <Fieldset legend={t("targets.carbohydrateLegend")}>
                  <div className="flex flex-wrap gap-4">
                    {numberField("carbohydrateMin", t("targets.min"), "g")}
                    {numberField("carbohydrateMax", t("targets.max"), "g")}
                  </div>
                </Fieldset>
              </Fieldset>
              {contradictions.length > 0 && blocked.length === 0 && (
                <div aria-live="polite" className="notice-warning">
                  {contradictions.map((contradiction) => (
                    <p key={contradiction.severity} className="m-0">
                      <Icon name={contradiction.severity === "blocking" ? "status_not_met" : "warning"} size={18} className="mr-1 inline align-[-3px]" />
                      {contradictionText(contradiction)}
                    </p>
                  ))}
                  <p className="m-0 text-sm text-muted">{t("contradiction.minimum_energy_exceeds_kcal_max.basis")}</p>
                </div>
              )}
              {numberField("servings", t("targets.servings"), "")}
            </Group>

            <Group icon="frying_pan" title={t("targets.groups.cooking")}>
              <div className="grid gap-4 md:grid-cols-3">
                <Fieldset legend={t("conditions.effortLegend")} hint={t("conditions.preferenceHint")}>
                  {([undefined, 1, 2, 3] as const).map((effort) => (
                    <Choice
                      key={effort ?? "any"}
                      type="radio"
                      name="effort"
                      checked={draft.effort === effort}
                      onChange={() => {
                        update({ ...draft, effort });
                      }}
                    >
                      {effort === undefined ? t("conditions.effortAny") : t(`effort.${effortKey(effort)}`)}
                    </Choice>
                  ))}
                </Fieldset>
                <Fieldset legend={t("conditions.cuisineLegend")}>
                  <div className="grid grid-cols-2 gap-x-4">
                    {CUISINES.map((cuisine: Cuisine) => (
                      <Choice
                        key={cuisine}
                        type="checkbox"
                        name="cuisine"
                        checked={draft.cuisines.includes(cuisine)}
                        onChange={() => {
                          update({ ...draft, cuisines: toggled(draft.cuisines, cuisine) });
                        }}
                      >
                        {t(`cuisine.${cuisine}`)}
                      </Choice>
                    ))}
                  </div>
                </Fieldset>
                <Fieldset legend={t("conditions.equipmentLegend")}>
                  {EQUIPMENT_MODES.map((mode) => (
                    <Choice
                      key={mode}
                      type="radio"
                      name="equipment-mode"
                      checked={draft.equipmentMode === mode}
                      onChange={() => {
                        update({ ...draft, equipmentMode: mode });
                      }}
                    >
                      {t(`conditions.equipmentMode.${mode}`)}
                    </Choice>
                  ))}
                  {draft.equipmentMode === "choose" && (
                    <div className="ml-7 flex flex-col">
                      <p className="m-0 text-sm text-muted">{t("conditions.equipmentChooseHint")}</p>
                      {EQUIPMENT.map((item: Equipment) => (
                        <Choice
                          key={item}
                          type="checkbox"
                          name="equipment"
                          checked={draft.equipment.includes(item)}
                          onChange={() => {
                            update({ ...draft, equipment: toggled(draft.equipment, item) });
                          }}
                        >
                          {t(`equipment.${item}`)}
                        </Choice>
                      ))}
                    </div>
                  )}
                </Fieldset>
              </div>
            </Group>

            <Group icon="shopping" title={t("targets.groups.foods")}>
              <div className="grid gap-4 md:grid-cols-2">
              <FoodPicker
                id={fieldId("required")}
                label={t("conditions.required.label")}
                hint={t("conditions.required.hint")}
                locale={locale}
                options={options}
                chosen={draft.required}
                errors={errorsFor("required")}
                labelOf={labelOf}
                onAdd={(option) => {
                  update({ ...draft, required: [...draft.required, { key: option.key, foods: option.foods }] });
                }}
                onRemove={(key) => {
                  update({ ...draft, required: draft.required.filter((choice) => choice.key !== key) });
                }}
              />
              <FoodPicker
                id={fieldId("excluded")}
                label={t("conditions.excluded.label")}
                hint={t("conditions.excluded.hint")}
                locale={locale}
                options={options}
                chosen={draft.excluded}
                errors={errorsFor("excluded")}
                labelOf={labelOf}
                onAdd={(option) => {
                  update({ ...draft, excluded: [...draft.excluded, { key: option.key, foods: option.foods }] });
                }}
                onRemove={(key) => {
                  update({ ...draft, excluded: draft.excluded.filter((choice) => choice.key !== key) });
                }}
              />
              </div>
            </Group>

            <Group icon="warning" title={t("targets.groups.allergens")}>
              <Fieldset legend={t("conditions.allergenLegend")}>
                <p className="m-0 notice-warning">
                  <Icon name="warning" size={18} className="mr-1 inline align-[-3px]" />
                  {t("disclaimer.allergens")}
                </p>
                {(
                  [
                    ["mandatoryGroup", MANDATORY_ALLERGENS],
                    ["recommendedGroup", RECOMMENDED],
                  ] as const
                ).map(([group, allergens]) => (
                  <Fieldset key={group} legend={t(`conditions.${group}`)}>
                    <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3">
                      {allergens.map((allergen: Allergen) => (
                        <Choice
                          key={allergen}
                          type="checkbox"
                          name="allergen"
                          checked={draft.allergens.includes(allergen)}
                          onChange={() => {
                            update({ ...draft, allergens: toggled(draft.allergens, allergen) });
                          }}
                        >
                          {t(`allergen.names.${allergen}`)}
                        </Choice>
                      ))}
                    </div>
                  </Fieldset>
                ))}
              </Fieldset>
            </Group>
          </div>
        </details>

        {blocked.length > 0 && (
          <div ref={blockedRef} tabIndex={-1} role="alert" className="rounded border-2 border-not-met p-3">
            <p className="m-0 font-medium">{t("targets.blocked")}</p>
            {blocked.map((contradiction) => (
              <p key={contradiction.severity} className="m-0">
                {contradictionText(contradiction)}
              </p>
            ))}
            <p className="m-0 text-sm text-muted">{t("contradiction.minimum_energy_exceeds_kcal_max.basis")}</p>
          </div>
        )}

        <SaveConditions draft={draft} />

        {/* On phones the search button stays at the bottom of the screen (ADR-037 D6). */}
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-surface-muted glass px-4 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:backdrop-filter-none md:p-0">
          <button type="submit" className="btn-primary btn-lg w-full md:w-auto">
            <Icon name="search" size={22} />
            {t("targets.search")}
          </button>
        </div>
      </form>
    </div>
  );
}
