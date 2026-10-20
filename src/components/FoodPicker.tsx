import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../../shared/locales";
import type { FoodChoice } from "../views/targets/draft";
import { searchFoods, type FoodOption } from "../views/targets/foodSearch";

export interface FoodPickerProps {
  readonly id?: string;
  readonly label: string;
  readonly hint: string;
  readonly locale: Locale;
  readonly options: readonly FoodOption[];
  readonly chosen: readonly FoodChoice[];
  readonly errors: readonly string[];
  readonly labelOf: (choice: FoodChoice) => string;
  readonly onAdd: (option: FoodOption) => void;
  readonly onRemove: (key: string) => void;
}

/**
 * Ingredient input with the ARIA 1.2 combobox pattern (ADR-030 D6): only dictionary foods
 * and protein groups can be chosen; no match shows "not supported".
 */
export function FoodPicker({ id: givenId, label, hint, locale, options, chosen, errors, labelOf, onAdd, onRemove }: FoodPickerProps) {
  const { t } = useTranslation();
  const generated = useId();
  const id = givenId ?? generated;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const chosenKeys = useMemo(() => new Set(chosen.map((choice) => choice.key)), [chosen]);
  const results = useMemo(() => searchFoods(options, locale, query, chosenKeys), [options, locale, query, chosenKeys]);
  const listId = `${id}-list`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const expanded = open && query.trim() !== "";
  const activeOption = expanded ? results[active] : undefined;

  const add = (option: FoodOption) => {
    onAdd(option);
    setQuery("");
    setActive(0);
    setOpen(false);
    setAnnouncement(t("conditions.foodSearch.added", { food: labelOf(option) }));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setOpen(true);
        setActive((index) => (results.length === 0 ? 0 : (index + 1) % results.length));
        break;
      case "ArrowUp":
        event.preventDefault();
        setOpen(true);
        setActive((index) => (results.length === 0 ? 0 : (index - 1 + results.length) % results.length));
        break;
      case "Enter":
        if (activeOption !== undefined) {
          event.preventDefault();
          add(activeOption);
        }
        break;
      case "Escape":
        if (expanded) {
          event.preventDefault();
          setOpen(false);
        } else {
          setQuery("");
        }
        break;
    }
  };

  const describedBy = [hintId, errors.length > 0 ? errorId : undefined].filter((part) => part !== undefined).join(" ");

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <p id={hintId} className="m-0 text-sm text-muted">
        {hint}
      </p>
      {chosen.length > 0 && (
        <ul aria-label={t("conditions.foodSearch.chosen")} className="flex flex-wrap gap-2">
          {chosen.map((choice) => (
            <li key={choice.key} className="flex items-center gap-1 rounded-full border border-border bg-surface-muted py-1 pr-1 pl-3">
              <span>{labelOf(choice)}</span>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full"
                aria-label={t("conditions.foodSearch.remove", { food: labelOf(choice) })}
                onClick={() => {
                  onRemove(choice.key);
                  setAnnouncement(t("conditions.foodSearch.removed", { food: labelOf(choice) }));
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={activeOption === undefined ? undefined : `${listId}-${activeOption.key}`}
          aria-describedby={describedBy}
          aria-invalid={errors.length > 0 || undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => {
            setOpen(false);
          }}
          className={`w-full rounded border bg-surface px-2 py-2 ${errors.length > 0 ? "border-not-met border-2" : "border-border"}`}
        />
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          hidden={!expanded || results.length === 0}
          className="absolute z-10 mt-1 w-full rounded border border-border bg-surface shadow"
        >
          {results.map((option, index) => (
            <li
              key={option.key}
              id={`${listId}-${option.key}`}
              role="option"
              aria-selected={index === active}
              className={`cursor-pointer px-3 py-2 ${index === active ? "bg-surface-muted outline-2 outline-focus" : ""}`}
              // Keep the focus in the input while choosing with a pointer.
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => {
                add(option);
              }}
            >
              {labelOf(option)}
            </li>
          ))}
        </ul>
      </div>
      {expanded && results.length === 0 && (
        <p className="m-0 text-sm" role="status">
          {t("conditions.foodSearch.noMatch", { query: query.trim() })}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {expanded && results.length > 0 ? t("conditions.foodSearch.results", { count: results.length }) : announcement}
      </p>
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
