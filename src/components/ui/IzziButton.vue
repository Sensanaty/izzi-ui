<template>
  <button
    class="izzi-button inline-flex h-fit rounded-sm font-black items-center justify-center gap-2 border border-transparent whitespace-nowrap cursor-pointer"
    :class="[
      `izzi-button--${variant}`,
      `izzi-button--size-${size}`,
      { 'izzi-button--round': rounded, 'izzi-button--flat': flat },
    ]"
    :type="type"
    :disabled="disabled"
  >
    <span v-if="$slots.iconLeft" class="-ml-0.5 inline-flex shrink-0" aria-hidden="true">
      <slot name="iconLeft" />
    </span>

    <slot />

    <span v-if="$slots.iconRight" class="-mr-0.5 inline-flex shrink-0" aria-hidden="true">
      <slot name="iconRight" />
    </span>
  </button>
</template>

<script setup lang="ts">
type IzziButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  type?: HTMLButtonElement["type"];
  disabled?: boolean;
  rounded?: boolean;
  flat?: boolean;
};

withDefaults(defineProps<IzziButtonProps>(), {
  variant: "primary",
  size: "md",
  type: "button",
});
</script>

<style scoped>
@reference "#style.css";

.izzi-button {
  box-shadow: 0.1rem 0.1rem 0 var(--theme-border);
  transition:
    background 80ms ease-in-out,
    border-color 80ms ease-in-out,
    color 80ms ease-in-out,
    box-shadow 80ms ease-in-out,
    transform 80ms ease-in-out;

  &:active {
    box-shadow: none;
    transform: translate(0.1rem, 0.1rem);
  }

  &:is(.izzi-button--size-xs) {
    @apply text-base p-0.5;
  }

  &:is(.izzi-button--size-sm) {
    @apply text-base py-0.5 px-2;
  }

  &:is(.izzi-button--size-md) {
    @apply text-lg py-1 px-2;
  }

  &:is(.izzi-button--size-lg) {
    @apply text-xl py-2 px-3;
  }

  &:disabled {
    @apply cursor-not-allowed opacity-50;
  }

  &:is(.izzi-button--primary) {
    @apply border-primary bg-primary text-on-primary;

    &:not(:disabled) {
      &:hover {
        @apply border-primary-hover bg-primary-hover;
      }

      &:active {
        @apply bg-primary;
      }
    }
  }

  &:is(.izzi-button--secondary) {
    @apply border-border border-2 bg-surface-raised text-text;

    &:not(:disabled) {
      &:hover {
        @apply border-border bg-surface-hover;
      }

      &:active {
        @apply bg-surface-raised;
      }
    }
  }

  &:is(.izzi-button--outline) {
    @apply border-primary bg-transparent text-text;

    &:not(:disabled) {
      &:hover {
        @apply bg-surface-hover;
      }

      &:active {
        @apply bg-transparent;
      }
    }
  }

  &:is(.izzi-button--danger) {
    @apply border-danger bg-danger text-on-danger;

    &:not(:disabled) {
      &:hover {
        @apply border-danger-hover bg-danger-hover;
      }

      &:active {
        @apply bg-danger;
      }
    }
  }

  &:is(.izzi-button--success) {
    @apply border-success bg-success text-on-success;

    &:not(:disabled) {
      &:hover {
        @apply border-success-hover bg-success-hover;
      }

      &:active {
        @apply bg-success;
      }
    }
  }

  &:is(.izzi-button--ghost) {
    @apply border-0 bg-transparent;
    box-shadow: none;
    transform: none;

    &:not(:disabled) {
      &:hover,
      &:active {
        @apply border-transparent bg-transparent;
      }
    }
  }

  &:is(.izzi-button--round) {
    @apply rounded-full;

    &:is(.izzi-button--size-sm) {
      @apply size-10;
    }

    &:is(.izzi-button--size-md) {
      @apply size-12;
    }

    &:is(.izzi-button--size-lg) {
      @apply size-14;
    }
  }

  &.izzi-button--flat,
  &.izzi-button--flat:active {
    box-shadow: none !important;
    transform: none !important;
  }
}
</style>
