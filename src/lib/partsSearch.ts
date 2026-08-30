import { partsQueryFields, partsSortFields } from "@/api/parts";
import { createAdvancedSearchParser } from "@/lib/advancedSearch";

import type { PartsCondition, PartsQueryField, PartsSort } from "@/api/parts";

const partsSearchParser = createAdvancedSearchParser<PartsQueryField, PartsCondition["operator"]>({
  fields: partsQueryFields,
  operatorsByField: {
    part_number: ["contains", "eq"],
    description: ["contains", "eq"],
    available: ["eq", "gt", "gte", "lt", "lte", "between"],
    reserved: ["eq", "gt", "gte", "lt", "lte", "between"],
    sold: ["eq", "gt", "gte", "lt", "lte", "between"],
    min_price: ["eq", "gt", "gte", "lt", "lte", "between"],
    med_price: ["eq", "gt", "gte", "lt", "lte", "between"],
    max_price: ["eq", "gt", "gte", "lt", "lte", "between"],
    condition: ["contains", "eq"],
    company_name: ["contains", "eq"],
    quote_type: ["eq"],
    tag: ["contains", "eq"],
    lead_time: ["contains", "eq"],
  },
});

export function parsePartsConditions(value: unknown): PartsCondition[] {
  return partsSearchParser.parseConditions(value);
}

export function parsePartsSort(value: unknown): PartsSort[] {
  return partsSearchParser.parseSort(value, partsSortFields, {
    field: "updated_at",
    direction: "desc",
  });
}

export type { AdvancedSearchCondition, AdvancedSearchSort } from "@/lib/advancedSearch";
