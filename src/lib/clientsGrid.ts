import ClientsGridActions from "@/components/clients/ClientsGridActions.vue";

import type { Client } from "@/lib/schemas/client";
import type { ColDef } from "ag-grid-community";

export const clientColumnOptions = [
  { field: "actions", label: "Actions" },
  { field: "name", label: "Name" },
  { field: "address", label: "Address" },
  { field: "number", label: "Number" },
  { field: "email", label: "Email" },
  { field: "company_name", label: "Company" },
] as const;

export const clientSelectionColumnDef = {
  pinned: "left",
  lockPinned: true,
  lockPosition: "left",
  width: 50,
  minWidth: 50,
  maxWidth: 50,
} as const;

export const clientDefaultColDef: ColDef<Client> = {
  sortable: true,
  comparator: () => 0,
  resizable: true,
  filter: false,
  minWidth: 120,
};

export function createClientColumnDefs(onDelete: (client: Client) => void): ColDef<Client>[] {
  return [
    {
      colId: "actions",
      headerName: "",
      cellRenderer: ClientsGridActions,
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
    { field: "number", headerName: "Number" },
    { field: "email", headerName: "Email", flex: 2, minWidth: 180 },
    { field: "company_name", headerName: "Company", flex: 2, minWidth: 180 },
  ];
}
