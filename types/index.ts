export enum NotificationType {
  warn = "warning",
  info = "information",
  succ = "success",
  dang = "danger"
}

export interface Notification {
  id: number;
  message: string;
  type?: NotificationType;
  autoHide?: boolean;
  duration?: number;
}

export interface User {
  id: number;
  username: string;
  admin: boolean;
  email?: string;
}

export interface Client {
  id: number;
  name: string;
  address?: string;
  number?: string;
  email?: string;
  company_id: Company["id"];
}

export interface Company {
  id: number;
  name: string;
  address: string;
  city?: string;
  country?: string;
  website?: string;
  type?: string;
  subscription?: string;
}

export interface Part {
  id: number;
  part_number: string;
  description: string;
  available: number;
  reserved: number;
  sold: number;
  condition: string
  min_cost?: number;
  min_price?: number;
  min_order?: number;
  med_cost?: number;
  med_price?: number;
  med_order?: number;
  max_cost?: number;
  max_price?: number;
  max_order?: number;
  lead_time?: string;
  quote_type?: string;
  tag: string;
  added: Date;
  company_id: Company["id"];
}
