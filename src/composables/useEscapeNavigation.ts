import { onBeforeUnmount, onMounted } from "vue";

function isFormControl(element: EventTarget | null): boolean {
  if (!(element instanceof HTMLElement)) return false;

  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element.isContentEditable
  );
}

export function useEscapeNavigation(navigate: () => Promise<void>): void {
  async function handleKeydown(event: KeyboardEvent): Promise<void> {
    if (event.key !== "Escape" || event.defaultPrevented || isFormControl(event.target)) {
      return;
    }

    await navigate();
  }

  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeydown);
  });
}
