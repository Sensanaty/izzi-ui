import { useAdvancedSearch } from "@/composables/useAdvancedSearch";

import type { PartsCondition, PartsQueryField, PartsQueryOperator } from "@/api/parts";
import type {
  AdvancedSearchConfig,
  AdvancedSearchEnumOption,
  AdvancedSearchFieldDefinition,
  AdvancedSearchOperatorDefinition,
} from "@/composables/useAdvancedSearch";

const fields: readonly AdvancedSearchFieldDefinition<PartsQueryField>[] = [
  { value: "part_number", label: "Part Number", kind: "text" },
  { value: "description", label: "Description", kind: "text" },
  { value: "available", label: "Available", kind: "number" },
  { value: "reserved", label: "Reserved", kind: "number" },
  { value: "sold", label: "Sold", kind: "number" },
  { value: "min_price", label: "Minimum Price", kind: "number" },
  { value: "med_price", label: "Medium Price", kind: "number" },
  { value: "max_price", label: "Maximum Price", kind: "number" },
  { value: "condition", label: "Condition", kind: "text" },
  { value: "company_name", label: "Company", kind: "text" },
  { value: "quote_type", label: "Quote Type", kind: "enum" },
  { value: "tag", label: "Tag", kind: "text" },
  { value: "lead_time", label: "Lead Time", kind: "text" },
];

const textOperators: readonly AdvancedSearchOperatorDefinition<PartsQueryOperator>[] = [
  { value: "contains", label: "contains" },
  { value: "eq", label: "is" },
];
const numericOperators: readonly AdvancedSearchOperatorDefinition<PartsQueryOperator>[] = [
  { value: "eq", label: "is" },
  { value: "gt", label: "greater than" },
  { value: "gte", label: "at least" },
  { value: "lt", label: "less than" },
  { value: "lte", label: "at most" },
  { value: "between", label: "between" },
];
const enumOperators: readonly AdvancedSearchOperatorDefinition<PartsQueryOperator>[] = [
  { value: "eq", label: "is" },
];
const quoteTypeOptions: readonly AdvancedSearchEnumOption[] = [
  { value: "OUTRIGHT SALE", label: "Outright Sale" },
  { value: "FLAT RATE EXCHANGE", label: "Flat Rate Exchange" },
  { value: "EXCHANGE + COST", label: "Exchange + Cost" },
];

const config: AdvancedSearchConfig<PartsQueryField, PartsQueryOperator> = {
  fields,
  operatorsByField: {
    part_number: textOperators,
    description: textOperators,
    available: numericOperators,
    reserved: numericOperators,
    sold: numericOperators,
    min_price: numericOperators,
    med_price: numericOperators,
    max_price: numericOperators,
    condition: textOperators,
    company_name: textOperators,
    quote_type: enumOperators,
    tag: textOperators,
    lead_time: textOperators,
  },
  enumOptionsByField: { quote_type: quoteTypeOptions },
};

export function useAdvancedPartSearch(initialConditions: PartsCondition[] = []) {
  return useAdvancedSearch(config, initialConditions);
}
