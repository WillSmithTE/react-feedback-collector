export const colorNameToHex = (color: string): string => {
  if (color.startsWith("#")) return color;
  if (typeof document === "undefined") return color;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return color;

  ctx.fillStyle = color;
  return ctx.fillStyle;
};

export const getGradientEnd = (color: string) => {
  const hex = colorNameToHex(color);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const shiftedR = Math.max(0, r - 60);
  const shiftedG = Math.min(255, g + 40);
  const shiftedB = Math.min(255, b + 20);
  return `#${[shiftedR, shiftedG, shiftedB]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
};
