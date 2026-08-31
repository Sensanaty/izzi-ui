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
  "created_at",
  "updated_at",
]);

type CopyType = "quote" | "full";

type QuotePriceKey = "min_price" | "med_price" | "max_price";

function displayPartValue(value: Part[keyof Part]): string {
  return value ? String(value) : "N/A";
}

function formatPartDetails(part: Part, fields: PartField[]): string {
  return fields.map(({ key, label }) => `${label}: ${displayPartValue(part[key])}`).join("\n");
}

function formatQuotePrice(part: Part, priceKey: QuotePriceKey): string {
  const orderKey =
    priceKey === "min_price" ? "min_order" : priceKey === "med_price" ? "med_order" : "max_order";

  return `Price ${displayPartValue(part[priceKey])} for Minimum Order Quantity ${displayPartValue(part[orderKey])}`;
}

function formatQuoteDetails(part: Part): string {
  return partFields
    .filter(({ key }) => !quoteExcludedFields.has(key))
    .map(({ key, label }) => {
      if (key === "min_price" || key === "med_price" || key === "max_price") {
        return formatQuotePrice(part, key);
      }

      return `${label}: ${displayPartValue(part[key])}`;
    })
    .join("\n");
}

function formatDetails(part: Part, type: CopyType): string {
  return type === "quote" ? formatQuoteDetails(part) : formatPartDetails(part, partFields);
}

export function usePartsCopy() {
  const actionMessage = ref<string | null>(null);
  const { createNotification } = useNotificationStore();

  async function copyDetailsForParts(partsToCopy: Part[], type: CopyType): Promise<void> {
    const clipboardText = partsToCopy
      .map((part) => formatDetails(part, type))
      .filter(Boolean)
      .join("\n\n==========\n\n");

    try {
      await navigator.clipboard.writeText(clipboardText);
      const copyType = type === "quote" ? "Quote Details" : "Part Details";

      const message = `${copyType} copied to clipboard`;
      actionMessage.value = message;
      createNotification(message);
    } catch (error) {
      actionMessage.value = notifyApiError(error, "Unable to copy details").message;
    }
  }

  function copyDetails(partsToCopy: Part[], type: CopyType): Promise<void> {
    return copyDetailsForParts(partsToCopy, type);
  }

  return { actionMessage, copyDetails, copyDetailsForParts };
}
