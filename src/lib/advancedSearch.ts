export type AdvancedSearchCondition<
  Field extends string = string,
  Operator extends string = string,
> = {
  field: Field;
  operator: Operator;
  value: string;
  secondValue?: string;
  connector?: "and" | "or";
};

export type AdvancedSearchSort<Field extends string = string> = {
  field: Field;
  direction: "asc" | "desc";
};

type AdvancedSearchParserOptions<Field extends string, Operator extends string> = {
  fields: readonly Field[];
  operatorsByField: Readonly<Record<Field, readonly Operator[]>>;
  maxConditions?: number;
  maxValueLength?: number;
};

type AdvancedSearchParser<Field extends string, Operator extends string> = {
  parseConditions: (value: unknown) => AdvancedSearchCondition<Field, Operator>[];
  parseSort: <SortField extends string>(
    value: unknown,
    sortFields: readonly SortField[],
    defaultSort: AdvancedSearchSort<SortField>,
  ) => AdvancedSearchSort<SortField>[];
};

export function createAdvancedSearchParser<Field extends string, Operator extends string>(
  options: AdvancedSearchParserOptions<Field, Operator>,
): AdvancedSearchParser<Field, Operator> {
  const fieldSet = new Set<string>(options.fields);
  const maxConditions = options.maxConditions ?? 20;
  const maxValueLength = options.maxValueLength ?? 100;

  function parseConditions(value: unknown): AdvancedSearchCondition<Field, Operator>[] {
    const serializedConditions = getQueryString(value);

    if (!serializedConditions) return [];

    try {
      const parsed: unknown = JSON.parse(serializedConditions);

      return Array.isArray(parsed) && parsed.length <= maxConditions
        ? parsed.filter(isValidCondition)
        : [];
    } catch {
      return [];
    }
  }

  function parseSort<SortField extends string>(
    value: unknown,
    sortFields: readonly SortField[],
    defaultSort: AdvancedSearchSort<SortField>,
  ): AdvancedSearchSort<SortField>[] {
    const serializedSort = getQueryString(value);
    const sortFieldSet = new Set<string>(sortFields);

    const parsedSort = serializedSort?.split(",").flatMap((entry) => {
      const [field, directionValue] = entry.split(":");

      const direction: AdvancedSearchSort["direction"] | null =
        directionValue === "asc" || directionValue === "desc" ? directionValue : null;

      return field && direction && sortFieldSet.has(field)
        ? [{ field: field as SortField, direction }]
        : [];
    });

    return parsedSort?.length ? parsedSort : [defaultSort];
  }

  function isValidCondition(value: unknown): value is AdvancedSearchCondition<Field, Operator> {
    if (typeof value !== "object" || value === null) return false;

    const condition = value as Record<string, unknown>;

    if (
      !isField(condition.field) ||
      !isOperator(condition.field, condition.operator) ||
      !isValidValue(condition.value) ||
      (condition.secondValue !== undefined && !isValidValue(condition.secondValue)) ||
      !isValidConnector(condition.connector)
    ) {
      return false;
    }

    return true;
  }

  function isField(value: unknown): value is Field {
    return typeof value === "string" && fieldSet.has(value);
  }

  function isOperator(field: Field, value: unknown): value is Operator {
    return typeof value === "string" && options.operatorsByField[field].includes(value as Operator);
  }

  function isValidValue(value: unknown): value is string {
    return typeof value === "string" && value.trim() !== "" && value.length <= maxValueLength;
  }

  return { parseConditions, parseSort };
}

function getQueryString(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return value.find((entry): entry is string => typeof entry === "string");
  }

  return typeof value === "string" ? value : undefined;
}

function isValidConnector(value: unknown): value is "and" | "or" | undefined {
  return value === undefined || value === "and" || value === "or";
}
