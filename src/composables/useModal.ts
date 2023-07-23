import { ref } from "vue";

export default function useModal() {
  const isModalOpen = ref(false);
  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value;
  }

  return { isModalOpen, toggleModal };
}
