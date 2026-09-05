const openMenus = new Set<() => void>();

export function useExclusiveActionMenu() {
  function registerMenu(closeMenu: () => void): void {
    for (const openMenu of openMenus) {
      openMenu();
    }

    openMenus.add(closeMenu);
  }

  function unregisterMenu(closeMenu: () => void): void {
    openMenus.delete(closeMenu);
  }

  return { registerMenu, unregisterMenu };
}
