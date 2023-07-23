<template>
  <div class="grid grid-cols-4">
    <div class="wrapper">
      <input id="part_number" type="checkbox" :checked="headers.part_number" @change="$emit('change', 'part_number')">
      <label for="part_number">Part Number</label>
    </div>
    <div class="wrapper">
      <input id="company_name" type="checkbox" :checked="headers.company_name" @change="$emit('change', 'company_name')">
      <label for="company_name">Owner</label>
    </div>
    <div class="wrapper">
      <input id="added" type="checkbox" :checked="headers.added" @change="$emit('change', 'added')">
      <label for="added">Date Added</label>
    </div>
    <div class="wrapper">
      <input id="description" type="checkbox" :checked="headers.description" @change="$emit('change', 'description')">
      <label for="description">Description</label>
    </div>
    <div class="wrapper">
      <input id="available" type="checkbox" :checked="headers.available" @change="$emit('change', 'available')">
      <label for="available">Available</label>
    </div>
    <div class="wrapper">
      <input id="reserved" type="checkbox" :checked="headers.reserved" @change="$emit('change', 'reserved')">
      <label for="reserved">Reserved</label>
    </div>
    <div class="wrapper">
      <input id="sold" type="checkbox" :checked="headers.sold" @change="$emit('change', 'sold')">
      <label for="sold">Sold</label>
    </div>
    <div class="wrapper">
      <input id="condition" type="checkbox" :checked="headers.condition" @change="$emit('change', 'condition')">
      <label for="condition">Condition</label>
    </div>
    <div class="wrapper">
      <input id="min_cost" type="checkbox" :checked="headers.min_cost" @change="$emit('change', 'min_cost')">
      <label for="min_cost">Cost 1</label>
    </div>
    <div class="wrapper">
      <input id="min_price" type="checkbox" :checked="headers.min_price" @change="$emit('change', 'min_price')">
      <label for="min_price">Sales 1</label>
    </div>

    <div class="wrapper right">
      <input id="min_order" type="checkbox" :checked="headers.min_order" @change="$emit('change', 'min_order')">
      <label for="min_order">Order 1</label>
    </div>
    <div class="wrapper right">
      <input id="med_cost" type="checkbox" :checked="headers.med_cost" @change="$emit('change', 'med_cost')">
      <label for="med_cost">Cost 2</label>
    </div>
    <div class="wrapper right">
      <input id="med_price" type="checkbox" :checked="headers.med_price" @change="$emit('change', 'med_price')">
      <label for="med_price">Sales 2</label>
    </div>
    <div class="wrapper right">
      <input id="med_order" type="checkbox" :checked="headers.med_order" @change="$emit('change', 'med_order')">
      <label for="med_order">Order 2</label>
    </div>
    <div class="wrapper right">
      <input id="max_cost" type="checkbox" :checked="headers.max_cost" @change="$emit('change', 'max_cost')">
      <label for="max_cost">Cost 3</label>
    </div>
    <div class="wrapper right">
      <input id="max_price" type="checkbox" :checked="headers.max_price" @change="$emit('change', 'max_price')">
      <label for="max_price">Sales 3</label>
    </div>
    <div class="wrapper right">
      <input id="max_order" type="checkbox" :checked="headers.max_order" @change="$emit('change', 'max_order')">
      <label for="max_order">Order 3</label>
    </div>
    <div class="wrapper right">
      <input id="lead_time" type="checkbox" :checked="headers.lead_time" @change="$emit('change', 'lead_time')">
      <label for="lead_time">Lead Time</label>
    </div>
    <div class="wrapper right">
      <input id="quote_type" type="checkbox" :checked="headers.quote_type" @change="$emit('change', 'quote_type')">
      <label for="quote_type">Quote Type</label>
    </div>
    <div class="wrapper right">
      <input id="tag" type="checkbox" :checked="headers.tag" @change="$emit('change', 'tag')">
      <label for="tag">Tag</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { VisibleHeaders } from "~components/admin/types";

  defineEmits(["change"]);

  defineProps<{
    headers: VisibleHeaders
  }>();
</script>

<style scoped>
label, input {
  @apply cursor-pointer;
}

.wrapper {
  @apply flex items-center justify-center;
}
</style>
