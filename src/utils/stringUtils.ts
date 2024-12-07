export function labelize(input: string): string {
  const words = input
    // Replace dashes and underscores with spaces
    .replace(/[-_]/g, " ")
    // Split on camelCase
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // Split into words
    .split(" ")
    // Remove empty strings from potential double spaces
    .filter(word => word.length > 0)
    .map(word => {
      if (word.toLowerCase() === "id") {
        return "ID";
      }

      return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
    })
    .join(" ");

  return words;
};

export function formatDate(isoString: string) {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);

    return Promise.resolve(true);
  } catch (err: unknown) {
    console.error(err);

    return Promise.reject(err);
  }
}
