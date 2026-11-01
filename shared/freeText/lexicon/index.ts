/**
 * Every locale's word list, for Node tools and tests. The app loads only the active
 * locale's list with its UI catalog (ADR-039 D1), so app code must not import this index.
 */
import type { Locale } from "../../locales.ts";
import type { Lexicon } from "../lexicon.ts";
import { en } from "./en.ts";
import { es } from "./es.ts";
import { fr } from "./fr.ts";
import { ja } from "./ja.ts";

export const LEXICONS: Readonly<Record<Locale, Lexicon>> = { ja, en, es, fr };
