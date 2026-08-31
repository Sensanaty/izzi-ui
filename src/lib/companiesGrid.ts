import CompanyGridActions from "@/components/companies/CompanyGridActions.vue";

import type { Company } from "@/lib/schemas/company";
import type { ColDef } from "ag-grid-community";

export const companyColumnOptions = [
  { field: "actions", label: "Actions" },
  { field: "name", label: "Name" },
  { field: "address", label: "Address" },
  { field: "city", label: "City" },
  { field: "country", label: "Country" },
  { field: "website", label: "Website" },
  { field: "subscription", label: "Subscription" },
  { field: "parts_count", label: "Parts" },
] as const;

export const companySelectionColumnDef = {
  pinned: "left",
  lockPinned: true,
  lockPosition: "left",
  width: 50,
  minWidth: 50,
  maxWidth: 50,
} as const;

export const companyDefaultColDef: ColDef<Company> = {
  sortable: true,
  comparator: () => 0,
  resizable: true,
  filter: false,
  minWidth: 120,
};

export function createCompanyColumnDefs(onDelete: (company: Company) => void): ColDef<Company>[] {
  return [
  
  {
    colId: "actions",
    headerName: "",
    cellRenderer: CompanyGridActions,
    cellRendererParams: { onDelete },
    sortable: false,
    suppressHeaderMenuButton: true,
    width: 70,
    minWidth: 70,
    maxWidth: 70,
    resizable: false,
  },
  { field: "name", headerName: "Name", flex: 2, minWidth: 220 },
  { field: "address", headerName: "Address", flex: 2, minWidth: 200 },
  { field: "city", headerName: "City" },
  { field: "country", headerName: "Country" },
  { field: "website", headerName: "Website", flex: 2, minWidth: 180 },
  { field: "subscription", headerName: "Subscription" },
    { field: "parts_count", headerName: "Parts", cellClass: "font-mono font-bold" },
  ];
}
