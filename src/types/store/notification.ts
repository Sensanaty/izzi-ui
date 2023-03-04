export default interface Notification {
  id: number;
  message: string;
  type: "warn" | "info" | "succ" | "dang";
  autoHide: boolean;
  duration: number;
}
