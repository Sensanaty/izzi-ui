import { describe, expect, it } from "vitest";
import { createAdvancedSearchParser } from "@/lib/advancedSearch";
import { parsePartsConditions, parsePartsSort } from "@/lib/partsSearch";

describe("parsePartsConditions", () => {
  it("parses conditions produced by the advanced-search UI", () => {
    expect(
      parsePartsConditions(
        JSON.stringify([
          { field: "part_number", operator: "contains", value: "ABC" },
          { field: "available", operator: "between", value: "1", secondValue: "10" },
        ]),
      ),
    ).toEqual([
      { field: "part_number", operator: "contains", value: "ABC" },
      { field: "available", operator: "between", value: "1", secondValue: "10" },
    ]);
  });

  it("accepts repeated query values in the same way as route query parsing", () => {
    const serialized = JSON.stringify([{ field: "part_number", operator: "eq", value: "ABC" }]);

    expect(parsePartsConditions([serialized, "ignored"])).toEqual(JSON.parse(serialized));
  });

  it("rejects malformed or structurally invalid URL state", () => {
    expect(parsePartsConditions("not-json")).toEqual([]);
    expect(parsePartsConditions(JSON.stringify({ field: "part_number" }))).toEqual([]);
    expect(
      parsePartsConditions(
        JSON.stringify([
          { field: "unknown", operator: "eq", value: "ABC" },
          { field: "part_number", operator: "unknown", value: "ABC" },
          { field: "part_number", operator: "eq", value: "   " },
          { field: "part_number", operator: "eq", value: "A".repeat(101) },
          { field: "part_number", operator: "eq", value: "ABC", connector: "xor" },
        ]),
      ),
    ).toEqual([]);
  });

  it("limits the number of URL conditions without validating API semantics", () => {
    const conditions = Array.from({ length: 20 }, (_, index) => ({
      field: "available",
      operator: "eq",
      value: String(index),
    }));

    expect(parsePartsConditions(JSON.stringify(conditions))).toHaveLength(20);
    expect(parsePartsConditions(JSON.stringify([...conditions, conditions[0]]))).toEqual([]);
    expect(
      parsePartsConditions(JSON.stringify([{ field: "available", operator: "eq", value: "not-a-number" }])),
    ).toEqual([{ field: "available", operator: "eq", value: "not-a-number" }]);
  });
});

describe("generic advanced search parser", () => {
  const parser = createAdvancedSearchParser({
    fields: ["name", "status", "quantity"] as const,
    operatorsByField: {
      name: ["contains", "eq"],
      status: ["eq"],
      quantity: ["eq", "between"],
    },
  });

  it("supports another table schema without parts-specific rules", () => {
    expect(
      parser.parseConditions(
        JSON.stringify([
          { field: "name", operator: "contains", value: "bearing" },
          { field: "status", operator: "eq", value: "any-status" },
          { field: "quantity", operator: "between", value: "one", secondValue: "five" },
        ]),
      ),
    ).toHaveLength(3);
  });

  it("uses the configured field and operator shape", () => {
    expect(
      parser.parseConditions(
        JSON.stringify([
          { field: "unknown", operator: "eq", value: "value" },
          { field: "name", operator: "gt", value: "value" },
        ]),
      ),
    ).toEqual([]);
  });

  it("parses sort fields independently from condition fields", () => {
    expect(
      parser.parseSort("name:asc,quantity:desc", ["name", "quantity"], {
        field: "name",
        direction: "desc",
      }),
    ).toEqual([
      { field: "name", direction: "asc" },
      { field: "quantity", direction: "desc" },
    ]);
  });
});

describe("parsePartsSort", () => {
  it("parses valid sort fields and directions", () => {
    expect(parsePartsSort("part_number:asc,available:desc")).toEqual([
      { field: "part_number", direction: "asc" },
      { field: "available", direction: "desc" },
    ]);
  });

  it("ignores invalid entries and applies the default when none remain", () => {
    expect(parsePartsSort("unknown:asc,part_number:sideways")).toEqual([
      { field: "updated_at", direction: "desc" },
    ]);
    expect(parsePartsSort(["updated_at:asc", "part_number:desc"])).toEqual([
      { field: "updated_at", direction: "asc" },
    ]);
  });
});
