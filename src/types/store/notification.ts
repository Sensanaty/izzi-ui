export default interface Notification {
  id: string;
  message: string;
  type: "warn" | "info" | "succ" | "dang";
  autoHide: boolean;
  duration: number;
}
