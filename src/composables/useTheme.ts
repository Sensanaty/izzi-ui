import { ref, watch } from "vue";

export type Theme = "light" | "dark";

const themeStorageKey = "izzi-theme";

const getStoredTheme = (): Theme | null => {
  const storedTheme = localStorage.getItem(themeStorageKey);

  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
};

const getInitialTheme = (): Theme => {
  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const theme = ref<Theme>(getInitialTheme());

const applyTheme = (selectedTheme: Theme): void => {
  document.documentElement.dataset.theme = selectedTheme;
  document.documentElement.style.colorScheme = selectedTheme;
};

watch(
  theme,
  (selectedTheme) => {
    applyTheme(selectedTheme);
    localStorage.setItem(themeStorageKey, selectedTheme);
  },
  { immediate: true },
);

export const useTheme = () => {
  const toggleTheme = (): void => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  return { theme, toggleTheme };
};
