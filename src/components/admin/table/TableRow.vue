<template class="flex flex-row">
  <h1>{{ part.id }} - {{ part.part_number }}</h1>
</template>

<script lang="ts" setup>
  import Part from "~/types/store/part";

  defineProps<{
    part: Part
  }>();
</script>
