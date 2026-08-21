<template>
  <IzziButton
    :aria-label="`Switch to ${nextTheme} theme`"
    :title="`Switch to ${nextTheme} theme`"
    @click="toggleTheme"
    size="xs"
    rounded
  >
    <component :is="theme === 'light' ? Sun : Moon" class="size-5" />
  </IzziButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Moon, Sun } from "@lucide/vue";
import { useTheme } from "@/composables/useTheme";

const { theme, toggleTheme } = useTheme();
const nextTheme = computed(() => (theme.value === "light" ? "dark" : "light"));
</script>
