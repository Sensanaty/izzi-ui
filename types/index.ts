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
