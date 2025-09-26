import { WidgetTheme } from "../types";

export const DEFAULT_THEME: WidgetTheme = {
  primary: "#2563eb",
  background: "#ffffff",
  text: "#374151",
  border: "#e5e7eb",
  shadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
};

const DARK_THEME: WidgetTheme = {
  primary: "#2563eb",
  background: "#1f2937",
  text: "#f9fafb",
  border: "#374151",
  shadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
};

export { DARK_THEME };

export function mergeTheme(
  customTheme: Partial<WidgetTheme> = {}
): WidgetTheme {
  return { ...DARK_THEME, ...customTheme };
}
