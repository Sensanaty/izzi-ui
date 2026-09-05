import PartsGridActions from "@/components/parts/PartsGridActions.vue";

import type { PartsGridActionsParams } from "@/components/parts/PartsGridActions.vue";
import type { Part, PartField } from "@/lib/schemas/part";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

export type PartColumnField = Exclude<PartField, "id" | "company_id">;
export type ColumnGroup = "General" | "Inventory" | "Pricing" | "Dates";
export type ColumnOption = {
  field: "actions" | PartColumnField;
  label: string;
  group: ColumnGroup;
};

export type CopyDetailsForParts = (parts: Part[], type: "quote" | "full") => Promise<void>;
export type CopyPartNumber = (part: Part) => Promise<void>;

export const columnOptions: ColumnOption[] = [
  { field: "actions", label: "Actions", group: "General" },
  { field: "part_number", label: "Part Number", group: "General" },
  { field: "description", label: "Description", group: "General" },
  { field: "company_name", label: "Company", group: "General" },
  { field: "condition", label: "Condition", group: "General" },
  { field: "quote_type", label: "Quote Type", group: "General" },
  { field: "tag", label: "Tag", group: "General" },
  { field: "available", label: "Available", group: "Inventory" },
  { field: "reserved", label: "Reserved", group: "Inventory" },
  { field: "sold", label: "Sold", group: "Inventory" },
  { field: "lead_time", label: "Lead Time", group: "Inventory" },
  { field: "min_cost", label: "Min Cost", group: "Pricing" },
  { field: "min_price", label: "Min Price", group: "Pricing" },
  { field: "med_cost", label: "Med Cost", group: "Pricing" },
  { field: "med_price", label: "Med Price", group: "Pricing" },
  { field: "max_cost", label: "Max Cost", group: "Pricing" },
  { field: "max_price", label: "Max Price", group: "Pricing" },
  { field: "added", label: "Date Added", group: "Dates" },
  { field: "updated_at", label: "Updated At", group: "Dates" },
  { field: "created_at", label: "Created At", group: "Dates" },
];

export const selectionColumnDef = {
  pinned: "left",
  lockPinned: true,
  lockPosition: "left",
  width: 50,
  minWidth: 50,
  maxWidth: 50,
} as const;

export const defaultColDef: ColDef<Part> = {
  sortable: true,
  comparator: () => 0,
  resizable: true,
  filter: false,
  minWidth: 120,
};

const currencyFormatter = (params: { value: string | null | undefined }): string =>
  params.value === null || params.value === undefined ? "" : params.value;

const dateFormatter = (params: { value: string | null | undefined }): string => {
  if (!params.value) return "";

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(params.value));
};

const numberWidth = 100;

type SearchCellRendererParams = ICellRendererParams<Part, string | null | undefined>;

function createSearchCellRenderer(getSearchQuery: () => string) {
  return (params: SearchCellRendererParams): HTMLElement => {
    const value = params.value ?? "";

    const searchQuery = getSearchQuery();
    const container = document.createElement("span");

    if (!searchQuery) {
      container.textContent = value;

      return container;
    }

    const normalizedValue = value.toLocaleLowerCase();
    const normalizedQuery = searchQuery.toLocaleLowerCase();
    let matchStart = 0;

    while (matchStart < value.length) {
      const matchIndex = normalizedValue.indexOf(normalizedQuery, matchStart);

      if (matchIndex === -1) {
        container.append(document.createTextNode(value.slice(matchStart)));
        break;
      }

      container.append(document.createTextNode(value.slice(matchStart, matchIndex)));

      const match = document.createElement("span");
      match.className = "text-accent font-semibold";
      match.textContent = value.slice(matchIndex, matchIndex + searchQuery.length);
      container.append(match);
      matchStart = matchIndex + searchQuery.length;
    }

    return container;
  };
}

export function createPartsColumnDefs(
  copyDetailsForParts: CopyDetailsForParts,
  copyPartNumber: CopyPartNumber,
  onDelete: (part: Part) => void,
  getSearchQuery: () => string,
): ColDef<Part>[] {
  return [
    {
      colId: "actions",
      headerName: "",
      pinned: "left",
      cellRenderer: PartsGridActions,
      cellRendererParams: {
        copyDetailsForParts,
        copyPartNumber,
        onDelete,
      } satisfies Partial<PartsGridActionsParams>,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true,
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      resizable: false,
    },
    {
      field: "part_number",
      headerName: "Part Number",
      minWidth: 120,
      cellClass: "cursor-pointer",
      cellRenderer: createSearchCellRenderer(getSearchQuery),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 180,
      wrapText: true,
      autoHeight: true,
      cellRenderer: createSearchCellRenderer(getSearchQuery),
    },
    {
      field: "company_name",
      headerName: "Company",
      minWidth: 140,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: "available",
      headerName: "Available",
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    {
      field: "reserved",
      headerName: "Reserved",
      hide: true,
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    {
      field: "sold",
      headerName: "Sold",
      hide: true,
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    { field: "condition", headerName: "Condition", minWidth: numberWidth },
    {
      field: "min_cost",
      headerName: "Min Cost",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    {
      field: "min_price",
      headerName: "Min Price",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    {
      field: "med_cost",
      headerName: "Med Cost",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    {
      field: "med_price",
      headerName: "Med Price",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    {
      field: "max_cost",
      headerName: "Max Cost",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    {
      field: "max_price",
      headerName: "Max Price",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
      minWidth: numberWidth,
    },
    { field: "lead_time", headerName: "Lead Time", cellClass: "font-mono", minWidth: 100 },
    { field: "quote_type", headerName: "Quote Type", minWidth: 125, cellClass: "font-mono" },
    {
      field: "tag",
      headerName: "Tag",
      wrapText: true,
      autoHeight: true,
      minWidth: 165,
      cellRenderer: createSearchCellRenderer(getSearchQuery),
    },
    { field: "added", headerName: "Date Added", valueFormatter: dateFormatter, minWidth: 130 },
    { field: "created_at", headerName: "Created", valueFormatter: dateFormatter, minWidth: 130 },
    { field: "updated_at", headerName: "Updated", valueFormatter: dateFormatter, minWidth: 130 },
  ];
}
