export default interface Notification {
  message: string;
  type: "warn" | "info" | "succ" | "dang";
  autoHide: boolean;
  duration: number;
}
