export function titleize(text: string): string {
  const splitText = text.replace(/[-_]/, " ").split(" ").map((split) => {
    return split.charAt(0).toUpperCase() + split.substring(1);
  });

  return splitText.join(" ");
}
