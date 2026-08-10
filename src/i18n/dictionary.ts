import { core } from "@/i18n/dict/core";
import { home } from "@/i18n/dict/home";
import { platform } from "@/i18n/dict/platform";
import { solutions } from "@/i18n/dict/solutions";
import { resources } from "@/i18n/dict/resources";

/** Swedish source string -> English translation. */
export const en: Record<string, string> = {
  ...core,
  ...home,
  ...platform,
  ...solutions,
  ...resources,
};
