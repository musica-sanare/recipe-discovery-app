import { useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { parseConditions, parserFoods } from "../../../shared/freeText/parse";
import type { Locale } from "../../../shared/locales";
import { isEmptySuggestion, providerOutputSchema, SUGGEST_LIMITS, validateValue, type OutOfScopeTopic, type Suggestion } from "../../../shared/suggestion";
import { formatNumber } from "../../format/format";
import { useLoadedContent } from "../../state/context";
import { useTextContext } from "../useTextContext";
import { choiceOf } from "./freeText";

type Result =
  | { readonly kind: "suggestion"; readonly suggestion: Suggestion }
  | { readonly kind: "out_of_scope"; readonly topic: OutOfScopeTopic }
  | { readonly kind: "message"; readonly key: "blank" | "tooLong" | "empty" | "invalid" | "applied" | "discarded" };

const NO_EXPRESSIONS = { ja: [], en: [], es: [], fr: [] };

export interface FreeTextConditionsProps {
  readonly locale: Locale;
  readonly onApply: (suggestion: Suggestion) => void;
  readonly onShowAllergens: () => void;
}

/**
 * Conditions read from the user's own words (ADR-034 D1, D6, revised again): parsed in
 * the browser with deterministic rules, shown for confirmation, applied only by the user.
 * The text is sent nowhere and not stored.
 */
export function FreeTextConditions({ locale, onApply, onShowAllergens }: FreeTextConditionsProps) {
  const { t } = useTranslation();
  const id = useId();
  const { calc, text: textBundle } = useLoadedContent();
  const { choiceLabel, foodName } = useTextContext();
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | undefined>(undefined);
  const foods = useMemo(() => parserFoods(calc, textBundle), [calc, textBundle]);
  const context = useMemo(() => ({ foodIds: new Set(calc.foods.map((food) => food.id)), forbiddenExpressions: NO_EXPRESSIONS }), [calc]);
  const hintId = `${id}-hint`;
  const separator = t("common.listSeparator");

  const readResult = (): Result => {
    const trimmed = text.trim();
    if (trimmed === "") return { kind: "message", key: "blank" };
    if (Array.from(trimmed).length > SUGGEST_LIMITS.textLength) return { kind: "message", key: "tooLong" };
    const validated = validateValue(parseConditions(trimmed, locale, foods), context, providerOutputSchema);
    if (!validated.ok) return { kind: "message", key: "invalid" };
    const output = validated.value;
    if (output.kind === "out_of_scope") return { kind: "out_of_scope", topic: output.topic };
    return isEmptySuggestion(output.conditions) ? { kind: "message", key: "empty" } : { kind: "suggestion", suggestion: output.conditions };
  };

  const rows = (suggestion: Suggestion): [string, string][] => {
    const minutes = suggestion.maxMinutes;
    const list: [string, string | undefined][] = [
      [t("conditions.required.label"), suggestion.requiredFoods.length === 0 ? undefined : suggestion.requiredFoods.map((item) => choiceLabel(choiceOf(item, calc))).join(separator)],
      [t("conditions.excluded.label"), suggestion.excludedFoods.length === 0 ? undefined : suggestion.excludedFoods.map(foodName).join(separator)],
      [t("targets.maxMinutes"), minutes === undefined ? undefined : t("candidates.withinMinutes", { minutes: t("unit.minute", { count: minutes, value: formatNumber(locale, minutes) }) })],
      [t("conditions.equipmentLegend"), suggestion.equipment?.map((item) => t(`equipment.${item}`)).join(separator)],
      [t("conditions.cuisineLegend"), suggestion.cuisines.length === 0 ? undefined : suggestion.cuisines.map((cuisine) => t(`cuisine.${cuisine}`)).join(separator)],
    ];
    return list.flatMap(([label, value]) => (value === undefined ? [] : [[label, value]]));
  };

  return (
    <details className="rounded border border-border">
      <summary className="cursor-pointer p-3 font-medium">{t("freeText.summary")}</summary>
      <div className="flex flex-col gap-2 p-3">
        <label htmlFor={id} className="font-medium">
          {t("freeText.label")}
        </label>
        <p id={hintId} className="m-0 text-sm text-muted">
          {t("freeText.hint")}
        </p>
        <textarea
          id={id}
          value={text}
          rows={2}
          maxLength={SUGGEST_LIMITS.textLength * 2}
          aria-describedby={hintId}
          onChange={(event) => {
            setText(event.target.value);
          }}
          className="rounded border border-border bg-surface p-2"
        />
        <button
          type="button"
          onClick={() => {
            setResult(readResult());
          }}
          className="self-start btn-outline">
          {t("freeText.read")}
        </button>

        <div aria-live="polite" className="flex flex-col gap-2">
          {result?.kind === "message" && <p className="m-0">{t(`freeText.${result.key}`, { max: SUGGEST_LIMITS.textLength })}</p>}
          {result?.kind === "out_of_scope" && (
            <div className="flex flex-col gap-2 notice-warning">
              <p className="m-0">{t(`freeText.outOfScope.${result.topic}`)}</p>
              {result.topic === "allergens" && (
                <button type="button" onClick={onShowAllergens} className="self-start text-primary underline">
                  {t("freeText.goToAllergens")}
                </button>
              )}
            </div>
          )}
          {result?.kind === "suggestion" && (
            <div className="flex flex-col gap-2 rounded border border-border p-3">
              <p className="m-0 font-medium">{t("freeText.resultHeading")}</p>
              <dl className="m-0 grid gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
                {rows(result.suggestion).map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-muted">{label}</dt>
                    <dd className="m-0">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 text-sm text-muted">{t("freeText.resultNote")}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onApply(result.suggestion);
                    setResult({ kind: "message", key: "applied" });
                  }}
                  className="btn-primary"
                >
                  {t("freeText.apply")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResult({ kind: "message", key: "discarded" });
                  }}
                  className="btn-secondary"
                >
                  {t("freeText.discard")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </details>
  );
}
