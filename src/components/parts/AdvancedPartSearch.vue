<template>
  <form class="mt-3 grid gap-3" @submit.prevent="apply">
    <p class="text-text-muted text-sm">
      Conditions are evaluated from top to bottom. Each connector combines the result of all prior
      conditions with the next one.
    </p>
    <p v-if="validationMessage" class="text-danger text-sm" role="alert">{{ validationMessage }}</p>

    <div v-for="(condition, index) in conditions" :key="condition.id" class="grid gap-2">
      <div v-if="index > 0" class="flex items-center gap-2">
        <span class="font-bold">Match</span>
        <IzziDropdown
          :id="`condition-connector-${condition.id}`"
          v-model="condition.connector"
          :options="connectorOptions"
          search-label="connectors"
          aria-label="Condition connector"
        />
      </div>

      <div class="advanced-search-row grid gap-2">
        <div class="grid gap-1">
          <span class="font-bold">Field</span>
          <IzziDropdown
            v-model="condition.field"
            :options="fieldOptions"
            searchable
            search-label="fields"
            aria-label="Search field"
            @update:model-value="resetOperator(condition)"
          >
            <template #option="{ option, selected, active, hovered }">
              <span class="flex min-w-0 items-center justify-between gap-2">
                <span class="min-w-0 break-words">{{ option.label }}</span>
                <span
                  class="min-w-0 break-all text-right font-mono text-sm"
                  :class="selected && !active && !hovered ? 'text-on-primary' : 'text-text-muted'"
                >
                  {{ option.value }}
                </span>
              </span>
            </template>
          </IzziDropdown>
        </div>

        <div class="grid gap-1">
          <span class="font-bold">Condition</span>
          <IzziDropdown
            v-model="condition.operator"
            :options="operatorsFor(condition.field)"
            search-label="conditions"
            aria-label="Search condition"
          />
        </div>

        <div class="grid gap-1">
          <span class="font-bold">Value</span>
          <IzziDropdown
            v-if="isEnumField(condition.field)"
            v-model="condition.value"
            :options="enumOptions(condition.field)"
            placeholder="Choose a value"
            clearable
            empty-option-label="Clear value"
            search-label="values"
            :aria-label="`${fieldLabel(condition.field)} value`"
          >
            <template #option="{ option, selected, active, hovered }">
              <span class="grid min-w-0 gap-0.5">
                <span class="break-words">{{ option.label }}</span>
                <span
                  class="break-all font-mono text-sm"
                  :class="selected && !active && !hovered ? 'text-on-primary' : 'text-text-muted'"
                >
                  {{ option.value }}
                </span>
              </span>
            </template>
          </IzziDropdown>
          <IzziInput
            v-else
            v-model="condition.value"
            class="h-10"
            :type="isNumericField(condition.field) ? 'number' : 'text'"
            :step="isNumericField(condition.field) ? 'any' : undefined"
            maxlength="100"
            :aria-label="`${fieldLabel(condition.field)} value`"
          />
          <IzziInput
            v-if="condition.operator === 'between'"
            v-model="condition.secondValue"
            class="h-10"
            :type="isNumericField(condition.field) ? 'number' : 'text'"
            :step="isNumericField(condition.field) ? 'any' : undefined"
            maxlength="100"
            :aria-label="`${fieldLabel(condition.field)} upper value`"
          />
        </div>

        <IzziButton
          type="button"
          size="md"
          variant="outline"
          class="h-10 self-end"
          :disabled="conditions.length === 1"
          :aria-label="`Remove ${fieldLabel(condition.field)} condition`"
          @click="removeCondition(index)"
        >
          Remove
        </IzziButton>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <IzziButton
        type="button"
        size="md"
        variant="outline"
        class="h-10"
        :disabled="conditions.length >= maxConditions"
        @click="addCondition"
      >
        Add condition
      </IzziButton>
      <div class="flex flex-wrap justify-end gap-2">
        <IzziButton type="submit" class="h-10">Search</IzziButton>
        <IzziButton type="button" variant="outline" class="h-10" @click="clear">
          Clear all
        </IzziButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziDropdown from "@/components/ui/IzziDropdown.vue";
import IzziInput from "@/components/ui/IzziInput.vue";
import { useAdvancedPartSearch } from "@/composables/useAdvancedPartSearch";

import type { PartsCondition } from "@/api/parts";

const props = defineProps<{
  initialConditions?: PartsCondition[];
}>();
const emit = defineEmits<{
  apply: [conditions: PartsCondition[]];
}>();
const {
  addCondition,
  clear: clearConditions,
  conditions,
  connectorOptions,
  enumOptions,
  fieldLabel,
  fieldOptions,
  getConditions,
  isEnumField,
  isNumericField,
  maxConditions,
  operatorsFor,
  removeCondition,
  resetOperator,
  validate,
  validationMessage,
} = useAdvancedPartSearch(props.initialConditions);

function apply(): void {
  validationMessage.value = validate();

  if (validationMessage.value) return;

  emit("apply", getConditions());
}

function clear(): void {
  clearConditions();
  emit("apply", []);
}
</script>

<style scoped>
@reference "#style.css";

@media (min-width: 48rem) {
  .advanced-search-row {
    grid-template-columns: minmax(10rem, 1fr) minmax(10rem, 1fr) minmax(12rem, 2fr) auto;
  }
}
</style>
