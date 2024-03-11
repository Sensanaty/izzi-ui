<template>
  <button
    class="flex items-center justify-center leading-tight py-1.5 px-3 rounded uppercase disabled:cursor-not-allowed"
    :class="[`${backgroundColor}`, `${backgroundHover}`, `${backgroundActive}`, `${backgroundDisabled}`, hasDarkText ? 'text-black font-bold' : 'text-white']"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
  defineProps({
    backgroundColor: {
      validator(value: string): boolean {
        return /^bg-[a-z].+-[1-9]00$/.test(value);
      },
      default: "bg-yellow-500"
    },

    backgroundHover: {
      validator(value: string): boolean {
        return /^hover:bg-[a-z].+-[1-9]00$/.test(value);
      },
      default: "hover:bg-yellow-700"
    },

    backgroundActive: {
      validator(value: string): boolean {
        return /^active:bg-[a-z].+-[1-9]00$/.test(value);
      },
      default: "active:bg-yellow-800"
    },

    backgroundDisabled: {
      validator(value: string): boolean {
        return /^disabled:bg-[a-z].+-[1-9]00$/.test(value);
      },
      default: "disabled:bg-yellow-900"
    },

    hasDarkText: {
      type: Boolean,
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    }
  });
</script>
