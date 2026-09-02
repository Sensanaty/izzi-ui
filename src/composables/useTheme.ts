import { ref, watch } from "vue";

export type Theme = "light" | "dark";

const themeStorageKey = "izzi-theme";

function getStoredTheme(): Theme | null {
  const storedTheme = localStorage.getItem(themeStorageKey);

  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
}

function getInitialTheme(): Theme {
  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const theme = ref<Theme>(getInitialTheme());

function applyTheme(selectedTheme: Theme) {
  document.documentElement.dataset.theme = selectedTheme;
  document.documentElement.style.colorScheme = selectedTheme;
}

watch(
  theme,
  (selectedTheme) => {
    applyTheme(selectedTheme);
    localStorage.setItem(themeStorageKey, selectedTheme);
  },
  { immediate: true },
);

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }

  return { theme, toggleTheme };
}
