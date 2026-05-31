/**
 * Centralny motyw aplikacji (design tokens). DLACZEGO osobny plik: zamiast
 * powtarzać te same wartości hex/odstępy w każdym StyleSheet, trzymamy je w
 * jednym miejscu — spójny wygląd i łatwa zmiana motywu w jednym pliku.
 */
export const colors = {
  primary: "#4a90e2",
  primaryDark: "#2f6fb0",

  danger: "#e74c3c",
  warning: "#f39c12",
  success: "#27ae60",

  background: "#f5f5f5",
  surface: "#fff",
  white: "#fff",

  border: "#eee",
  borderInput: "#ccc",
  borderSubtle: "#f0f0f0",

  textPrimary: "#333",
  textSecondary: "#666",
  textMuted: "#999",
  textFaint: "#aaa",

  overlay: "rgba(0,0,0,0.5)",
  shadow: "#000",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 30,
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  pill: 20,
};

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};

export default { colors, spacing, radius, fontSize };
