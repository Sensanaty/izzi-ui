import { type Directive } from "vue";

interface TooltipOptions {
  class?: string;
  offset?: number;
  delay?: number;
}

const vTooltip: Directive<HTMLElement, TooltipOptions> = {
  mounted(el, binding) {
    if (el.querySelector("p")?.classList.contains("whitespace-nowrap")) {
      return;
    }

    const tooltip = document.createElement("div");
    const defaultClass = "fixed z-50 bg-neutral-950 p-2 border rounded shadow-lg max-w-sm whitespace-normal font-mono select-all";
    tooltip.className = binding.value?.class || defaultClass;
    tooltip.textContent = el.textContent;
    tooltip.style.visibility = "hidden";

    document.body.appendChild(tooltip);
    let timeout: ReturnType<typeof setTimeout>;

    el.addEventListener("mouseenter", (e) => {
      timeout = setTimeout(() => {
        const rect = el.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + (binding.value?.offset || 0)}px`;
        tooltip.style.visibility = "visible";
      }, binding.value?.delay || 500);
    });

    tooltip.addEventListener("mouseenter", () => {
      clearTimeout(timeout);
      tooltip.style.visibility = "visible";
    });

    tooltip.addEventListener("mouseleave", () => {
      tooltip.style.visibility = "hidden";
    });

    el.addEventListener("mouseleave", (e) => {
      if (!tooltip.matches(":hover")) {
        clearTimeout(timeout);
        tooltip.style.visibility = "hidden";
      }
    });
  },
};

export default vTooltip;
