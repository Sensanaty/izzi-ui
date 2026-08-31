import { ref } from "vue";
import type { Ref } from "vue";

import type { AdvancedSearchCondition } from "@/lib/advancedSearch";

export type AdvancedSearchFieldDefinition<Field extends string> = {
  value: Field;
  label: string;
  kind: "text" | "number" | "enum";
};

export type AdvancedSearchOperatorDefinition<Operator extends string> = {
  value: Operator;
  label: string;
};

export type AdvancedSearchEnumOption = {
  value: string;
  label: string;
};

export type AdvancedSearchConfig<Field extends string, Operator extends string> = {
  fields: readonly AdvancedSearchFieldDefinition<Field>[];
  operatorsByField: Readonly<Record<Field, readonly AdvancedSearchOperatorDefinition<Operator>[]>>;
  enumOptionsByField?: Partial<Record<Field, readonly AdvancedSearchEnumOption[]>>;
  maxConditions?: number;
};

type QueryConditionDraft<Field extends string, Operator extends string> = {
  field: Field & string;
  operator: Operator & string;
  value: string;
  secondValue?: string;
  connector?: "and" | "or";
  id: number;
};

function getDefaultField<Field extends string>(
  fields: readonly AdvancedSearchFieldDefinition<Field>[],
): AdvancedSearchFieldDefinition<Field> {
  const field = fields[0];

  if (!field) throw new Error("Advanced search requires at least one field.");

  return field;
}

export function useAdvancedSearch<Field extends string, Operator extends string>(
  config: AdvancedSearchConfig<Field, Operator>,
  initialConditions: AdvancedSearchCondition<Field, Operator>[] = [],
) {
  const maxConditions = config.maxConditions ?? 20;
  const defaultField = getDefaultField(config.fields);

  const nextId = ref(1);
  const validationMessage = ref<string | null>(null);
  const conditions: Ref<QueryConditionDraft<Field, Operator>[]> = ref([]);
  const initialDrafts = initialConditions.length ? initialConditions : [createCondition()];

  conditions.value = initialDrafts.map((condition) => ({
    ...condition,
    id: nextId.value++,
  }));

  const fieldOptions = config.fields.map((field) => ({ ...field, searchText: field.value }));

  const connectorOptions: readonly AdvancedSearchOperatorDefinition<"and" | "or">[] = [
    { value: "and", label: "AND" },
    { value: "or", label: "OR" },
  ];

  function fieldDefinition(field: Field): AdvancedSearchFieldDefinition<Field> {
    return config.fields.find((item) => item.value === field) ?? defaultField;
  }

  function fieldLabel(field: Field): string {
    return fieldDefinition(field).label;
  }

  function isNumericField(field: Field): boolean {
    return fieldDefinition(field).kind === "number";
  }

  function isEnumField(field: Field): boolean {
    return fieldDefinition(field).kind === "enum";
  }

  function operatorsFor(field: Field): readonly AdvancedSearchOperatorDefinition<Operator>[] {
    return config.operatorsByField[field];
  }

  function enumOptions(field: Field): readonly AdvancedSearchEnumOption[] {
    return config.enumOptionsByField?.[field] ?? [];
  }

  function resetOperator(condition: QueryConditionDraft<Field, Operator>): void {
    const firstOperator = operatorsFor(condition.field)[0];

    if (firstOperator) condition.operator = firstOperator.value;

    condition.value = "";
    condition.secondValue = undefined;
  }

  function addCondition(): void {
    if (conditions.value.length >= maxConditions) return;

    conditions.value = [...conditions.value, { ...createCondition(), id: nextId.value++ }];
  }

  function removeCondition(index: number): void {
    if (conditions.value.length > 1) {
      conditions.value = conditions.value.filter((_, conditionIndex) => conditionIndex !== index);
    }
  }

  function clear(): void {
    validationMessage.value = null;
    conditions.value = [{ ...createCondition(), id: nextId.value++ }];
  }

  function validate(): string | null {
    const incompleteCondition = conditions.value.find(
      (condition) =>
        condition.value.trim() === "" ||
        (condition.operator === "between" && !condition.secondValue?.trim()),
    );

    if (!incompleteCondition) return null;

    return incompleteCondition.operator === "between"
      ? "Enter both values for a range"
      : "Enter a value for every condition";
  }

  function getConditions(): AdvancedSearchCondition<Field, Operator>[] {
    return conditions.value.map(({ field, operator, value, secondValue, connector }) => ({
      field,
      operator,
      value,
      secondValue,
      connector,
    }));
  }

  function createCondition(): AdvancedSearchCondition<Field, Operator> {
    const field = defaultField?.value;
    const operator = field ? config.operatorsByField[field][0]?.value : undefined;

    if (!field || !operator) throw new Error("Advanced search requires a field and operator.");

    return { field, operator, value: "", connector: "and" };
  }

  return {
    addCondition,
    clear,
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
  };
}
