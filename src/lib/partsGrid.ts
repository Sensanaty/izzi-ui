import PartsGridActions from "@/components/parts/PartsGridActions.vue";

import type { PartsGridActionsParams } from "@/components/parts/PartsGridActions.vue";
import type { Part, PartField } from "@/lib/schemas/part";
import type { ColDef } from "ag-grid-community";

export type PartColumnField = Exclude<PartField, "id" | "created_at" | "company_id">;
export type ColumnOption = {
  field: "actions" | PartColumnField;
  label: string;
};

export type CopyDetailsForParts = (parts: Part[], type: "quote" | "full") => Promise<void>;

export const columnOptions: ColumnOption[] = [
  { field: "actions", label: "Actions" },
  { field: "part_number", label: "Part Number" },
  { field: "description", label: "Description" },
  { field: "company_name", label: "Company" },
  { field: "available", label: "Available" },
  { field: "reserved", label: "Reserved" },
  { field: "sold", label: "Sold" },
  { field: "condition", label: "Condition" },
  { field: "min_price", label: "Min Price" },
  { field: "med_price", label: "Med Price" },
  { field: "max_price", label: "Max Price" },
  { field: "lead_time", label: "Lead Time" },
  { field: "quote_type", label: "Quote Type" },
  { field: "tag", label: "Tag" },
  { field: "updated_at", label: "Updated" },
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

export function createPartsColumnDefs(copyDetailsForParts: CopyDetailsForParts): ColDef<Part>[] {
  return [
    {
      colId: "actions",
      headerName: "",
      cellRenderer: PartsGridActions,
      cellRendererParams: { copyDetailsForParts } satisfies Partial<PartsGridActionsParams>,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true,
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      resizable: false,
    },
    { field: "part_number", headerName: "Part Number", minWidth: 180 },
    { field: "description", headerName: "Description", flex: 2, minWidth: 220 },
    { field: "company_name", headerName: "Company", minWidth: 180 },
    {
      field: "available",
      headerName: "Available",
      cellClass: "font-mono font-bold",
    },
    {
      field: "reserved",
      headerName: "Reserved",
      cellClass: "font-mono font-bold",
    },
    { field: "sold", headerName: "Sold", cellClass: "font-mono font-bold" },
    { field: "condition", headerName: "Condition" },
    {
      field: "min_price",
      headerName: "Min Price",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
    },
    {
      field: "med_price",
      headerName: "Med Price",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
    },
    {
      field: "max_price",
      headerName: "Max Price",
      valueFormatter: currencyFormatter,
      cellClass: "font-mono font-bold",
    },
    { field: "lead_time", headerName: "Lead Time", cellClass: "font-mono" },
    { field: "quote_type", headerName: "Quote Type", minWidth: 190, cellClass: "font-mono" },
    { field: "tag", headerName: "Tag", wrapText: true, autoHeight: true },
    { field: "updated_at", headerName: "Updated", valueFormatter: dateFormatter, minWidth: 160 },
  ];
}
