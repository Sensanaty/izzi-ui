export interface BaseIconProps {
  name: `ph-${string}`;
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

export interface BaseButtonProps {
  text?: string;
  iconName?: BaseIconProps["name"];
  iconSize?: BaseIconProps["size"];
  iconWeight?: BaseIconProps["weight"];
}
