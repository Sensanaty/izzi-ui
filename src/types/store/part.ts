import Company from "~/types/store/company";

export default interface Part {
  id: number;
  part_number: string;
  available: number;
  reserved: number;
  sold: number;
  condition: boolean;
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
  added?: Date;
  company_id: Company["id"];
}
