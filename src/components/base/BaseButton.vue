<template>
  <button
    class="flex items-center justify-center leading-tight py-1.5 px-3 rounded uppercase"
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
      default: "bg-sky-500"
    },
    backgroundHover: {
      validator(value: string): boolean {
        return /^hover:bg-[a-z].+-[1-9]00$/.test(value);
      },
      default: "hover:bg-cyan-700"
    },
    backgroundActive: {
      validator(value: string): boolean {
        return /^active:bg-[a-z].+-[1-9]00$/.test(value);
      },
      default: "active:bg-cyan-800"
    },
    hasDarkText: {
      type: Boolean,
      default: false
    }
  });
</script>
