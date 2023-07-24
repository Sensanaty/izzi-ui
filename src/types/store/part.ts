import Company from "~/types/store/company";

export default interface Part {
  readonly id: number;
  part_number: string;
  description: string;
  available: number;
  reserved: number;
  sold: number;
  condition: string;
  min_cost: number;
  min_price: number;
  min_order: number;
  med_cost?: number;
  med_price?: number;
  med_order?: number;
  max_cost?: number;
  max_price?: number;
  max_order?: number;
  lead_time?: string;
  quote_type?: string;
  tag: string;
  internal_note: string;
  added?: Date | string;
  company_name: Company["name"];
  company_id: Company["id"];
  created_at: Date;
  updated_at: Date;
}
