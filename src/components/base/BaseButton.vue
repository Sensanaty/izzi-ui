<template>
  <button
    class="flex items-center justify-center text-xl leading-tight py-1.5 px-4 rounded uppercase"
    :class="[`${backgroundColor}`, `${backgroundHover}`, `${backgroundActive}`, hasDarkText ? 'text-black' : 'text-white']"
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
      default: "bg-blue-500"
    },
    backgroundHover: {
      validator(value: string): boolean {
        return /^hover:bg-[a-z].+-[1-9]00$/.test(value);
      },
      default: "hover:bg-blue-700"
    },
    backgroundActive: {
      validator(value: string): boolean {
        return /^active:bg-[a-z].+-[1-9]00$/.test(value);
      },
      default: "active:bg-blue-800"
    },
    hasDarkText: {
      type: Boolean,
      default: false
    }
  });
</script>
