import { ref } from "vue";
import { notifyApiError } from "@/lib/notifications";
import { useNotificationStore } from "@/stores/notification";

import type { Part } from "@/lib/schemas/part";

export type PartField = {
  key: keyof Part;
  label: string;
};

const partFields: PartField[] = [
  { key: "part_number", label: "Part Number" },
  { key: "description", label: "Description" },
  { key: "company_name", label: "Company Name" },
  { key: "available", label: "Available" },
  { key: "reserved", label: "Reserved" },
  { key: "sold", label: "Sold" },
  { key: "condition", label: "Condition" },
  { key: "min_cost", label: "Minimum Cost" },
  { key: "min_price", label: "Minimum Price" },
  { key: "min_order", label: "Minimum Order" },
  { key: "med_cost", label: "Medium Cost" },
  { key: "med_price", label: "Medium Price" },
  { key: "med_order", label: "Medium Order" },
  { key: "max_cost", label: "Maximum Cost" },
  { key: "max_price", label: "Maximum Price" },
  { key: "max_order", label: "Maximum Order" },
  { key: "lead_time", label: "Lead Time" },
  { key: "quote_type", label: "Quote Type" },
  { key: "tag", label: "Tag" },
  { key: "internal_note", label: "Internal Note" },
  { key: "added", label: "Added" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "id", label: "ID" },
];

const quoteTypeLabels: Record<string, string> = {
  outright_sale: "Outright Sale",
  flat_rate_exchange: "Flat Rate Exchange",
  exchange_plus_cost: "Exchange + Cost",
};

const quoteExcludedFields = new Set<keyof Part>([
  "id",
  "company_name",
  "reserved",
  "sold",
  "min_cost",
  "min_order",
  "med_cost",
  "med_order",
  "max_cost",
  "max_order",
  "internal_note",
  "added",
  "created_at",
  "updated_at",
]);

type CopyType = "quote" | "full";

type QuotePriceKey = "min_price" | "med_price" | "max_price";
type QuoteOrderKey = "min_order" | "med_order" | "max_order";

function displayPartValue(value: Part[keyof Part]): string {
  return value ? String(value) : "N/A";
}

function formatPartDetails(part: Part, fields: PartField[]): string {
  return fields.map(({ key, label }) => `${label}: ${displayPartValue(part[key])}`).join("\n");
}

function hasQuoteValue(value: string | number | null | undefined): value is string | number {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return value !== 0;

  const normalizedValue = value.trim().toLowerCase();

  return (
    normalizedValue !== "" && normalizedValue !== "n/a" && !/^0+(?:\.0+)?$/.test(normalizedValue)
  );
}

function formatQuotePrice(part: Part, priceKey: QuotePriceKey): string | null {
  let orderKey: QuoteOrderKey;

  if (priceKey === "min_price") orderKey = "min_order";
  else if (priceKey === "med_price") orderKey = "med_order";
  else orderKey = "max_order";

  const price = part[priceKey];
  const orderQuantity = part[orderKey];

  if (!hasQuoteValue(price) || !hasQuoteValue(orderQuantity)) return null;

  return `Price: USD ${price} for Minimum Order Quantity: ${orderQuantity} EA`;
}

function formatQuoteDetails(part: Part): string {
  return partFields
    .filter(({ key }) => !quoteExcludedFields.has(key))
    .map(({ key, label }) => {
      if (key === "min_price" || key === "med_price" || key === "max_price") {
        return formatQuotePrice(part, key);
      }

      if (key === "quote_type") {
        return `${label}: ${quoteTypeLabels[part.quote_type] ?? displayPartValue(part.quote_type)}`;
      }

      if (key === "available") {
        return `${label}: ${displayPartValue(part[key])} EA`;
      }

      return `${label}: ${displayPartValue(part[key])}`;
    })
    .filter((line): line is string => line !== null)
    .join("\n");
}

function formatDetails(part: Part, type: CopyType): string {
  return type === "quote" ? formatQuoteDetails(part) : formatPartDetails(part, partFields);
}

export function usePartsCopy() {
  const actionMessage = ref<string | null>(null);
  const { createNotification } = useNotificationStore();

  async function copyPartNumbers(partsToCopy: Part[]): Promise<void> {
    const clipboardText = partsToCopy.map(({ part_number }) => part_number).join("\n");

    try {
      await navigator.clipboard.writeText(clipboardText);
      const message = "Part number copied to clipboard";
      actionMessage.value = message;
      createNotification(message);
    } catch (error) {
      actionMessage.value = notifyApiError(error, "Unable to copy part number").message;
    }
  }

  async function copyDetailsForParts(partsToCopy: Part[], type: CopyType): Promise<void> {
    const clipboardText = partsToCopy
      .map((part) => formatDetails(part, type))
      .filter(Boolean)
      .join("\n\n==========\n\n");

    try {
      await navigator.clipboard.writeText(clipboardText);
      const copyType = type === "quote" ? "quote details" : "full details";
      const partLabel =
        partsToCopy.length < 5
          ? `${partsToCopy.length === 1 ? "part" : "parts"} ${partsToCopy
              .map(({ part_number }) => part_number)
              .join(", ")}`
          : `${partsToCopy.length} parts`;
      const message = `Copied ${copyType} for ${partLabel}`;
      actionMessage.value = message;
      createNotification(message);
    } catch (error) {
      actionMessage.value = notifyApiError(error, "Unable to copy details").message;
    }
  }

  function copyDetails(partsToCopy: Part[], type: CopyType): Promise<void> {
    return copyDetailsForParts(partsToCopy, type);
  }

  return { actionMessage, copyDetails, copyDetailsForParts, copyPartNumbers };
}
