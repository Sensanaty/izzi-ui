import { ref } from "vue";

export interface BaseIconProps {
  size: number;
  weight: "thin" | "regular" | "bold" | "duotone";
}

export default function useIcon() {
  const size = ref<BaseIconProps["size"]>(28);
  const weight = ref<BaseIconProps["weight"]>("regular");

  return { size, weight };
}
