import { useId } from "react";
import { useTranslation } from "react-i18next";

export interface NumberFieldProps {
  readonly id?: string;
  readonly label: string;
  /** The field name used in the stepper labels ("increase the protein minimum"). */
  readonly spokenName?: string;
  readonly value: string;
  readonly unit: string;
  readonly hint?: string;
  readonly errors: readonly string[];
  readonly onChange: (text: string) => void;
  readonly onStep: (direction: 1 | -1) => void;
}

/**
 * A number typed as text (decimal comma and full-width digits are accepted) with labelled
 * steppers; errors and hints are tied to the input with `aria-describedby`.
 */
export function NumberField({ id, label, spokenName, value, unit, hint, errors, onChange, onStep }: NumberFieldProps) {
  const { t } = useTranslation();
  const generated = useId();
  const inputId = id ?? generated;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [hint === undefined ? undefined : hintId, errors.length > 0 ? errorId : undefined].filter((part) => part !== undefined).join(" ");
  const name = spokenName ?? label;
  const button = "flex size-10 items-center justify-center rounded border border-border bg-surface-muted text-lg leading-none";

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="font-medium">
        {unit === "" ? label : t("targets.fieldWithUnit", { label, unit })}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          aria-invalid={errors.length > 0 || undefined}
          aria-describedby={describedBy === "" ? undefined : describedBy}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          className={`w-24 rounded border bg-surface px-2 py-2 text-right ${errors.length > 0 ? "border-not-met border-2" : "border-border"}`}
        />
        <button
          type="button"
          className={button}
          aria-label={t("targets.decrease", { field: name })}
          onClick={() => {
            onStep(-1);
          }}
        >
          −
        </button>
        <button
          type="button"
          className={button}
          aria-label={t("targets.increase", { field: name })}
          onClick={() => {
            onStep(1);
          }}
        >
          +
        </button>
      </div>
      {hint !== undefined && (
        <p id={hintId} className="m-0 text-sm text-muted">
          {hint}
        </p>
      )}
      {errors.length > 0 && (
        <div id={errorId} className="text-sm text-not-met">
          {errors.map((error) => (
            <p key={error} className="m-0">
              <span aria-hidden="true">✕ </span>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
