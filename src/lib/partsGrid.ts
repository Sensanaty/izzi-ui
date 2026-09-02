import PartsGridActions from "@/components/parts/PartsGridActions.vue";

import type { PartsGridActionsParams } from "@/components/parts/PartsGridActions.vue";
import type { Part, PartField } from "@/lib/schemas/part";
import type { ColDef } from "ag-grid-community";

export type PartColumnField = Exclude<PartField, "id" | "company_id">;
export type ColumnOption = {
  field: "actions" | PartColumnField;
  label: string;
};

export type CopyDetailsForParts = (parts: Part[], type: "quote" | "full") => Promise<void>;
export type CopyPartNumber = (part: Part) => Promise<void>;

export const columnOptions: ColumnOption[] = [
  { field: "actions", label: "Actions" },
  { field: "part_number", label: "Part Number" },
  { field: "description", label: "Description" },
  { field: "company_name", label: "Company" },
  { field: "available", label: "Available" },
  { field: "reserved", label: "Reserved" },
  { field: "sold", label: "Sold" },
  { field: "condition", label: "Condition" },
  { field: "min_cost", label: "Min Cost" },
  { field: "min_price", label: "Min Price" },
  { field: "med_cost", label: "Med Cost" },
  { field: "med_price", label: "Med Price" },
  { field: "max_cost", label: "Max Cost" },
  { field: "max_price", label: "Max Price" },
  { field: "lead_time", label: "Lead Time" },
  { field: "quote_type", label: "Quote Type" },
  { field: "tag", label: "Tag" },
  { field: "added", label: "Date Added" },
  { field: "updated_at", label: "Updated At" },
  { field: "created_at", label: "Created At" },
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

export function createPartsColumnDefs(
  copyDetailsForParts: CopyDetailsForParts,
  copyPartNumber: CopyPartNumber,
  onDelete: (part: Part) => void,
): ColDef<Part>[] {
  return [
    {
      colId: "actions",
      headerName: "",
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
    { field: "part_number", headerName: "Part Number", minWidth: 120 },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 180,
      wrapText: true,
      autoHeight: true,
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
    { field: "tag", headerName: "Tag", wrapText: true, autoHeight: true },
    { field: "added", headerName: "Date Added", valueFormatter: dateFormatter, minWidth: 130 },
    { field: "created_at", headerName: "Created", valueFormatter: dateFormatter, minWidth: 130 },
    { field: "updated_at", headerName: "Updated", valueFormatter: dateFormatter, minWidth: 130 },
  ];
}
