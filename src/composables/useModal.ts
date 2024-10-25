import { ref } from "vue";

export default function useModal() {
  const isOpen = ref(false);

  const closeModal = () => isOpen.value = false;
  const openModal = () => isOpen.value = true;

  return {
    isOpen,

    closeModal,
    openModal,
  };
}
