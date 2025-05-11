<template>
  <div
    class="group/card border bg-neutral-900 px-2 py-1"
    :class="{ 'cursor-pointer': company.parts_count > 0 }"
    @click.self="expandCard"
  >
    <div
      class="flex items-center gap-x-4"
      @click="expandCard"
    >
      <div class="size-4 text-neutral-400">
        <PhCaretDown v-if="company.parts_count > 0" class="transition-transform" :class="{ 'rotate-180': !isOpen }" />
      </div>

      <span class="line-clamp-1 text-ellipsis text-neutral-300">
        {{ company.name }}
      </span>

      <p class="ml-auto min-w-fit font-mono text-neutral-400">
        {{ company.parts_count }} part<span v-if="company.parts_count !== 1">s</span>
      </p>
    </div>

    <div v-if="isOpen" class="mt-2 cursor-auto p-1.5" @click.stop>
      <div v-if="isFetching">
        Fetching parts...
      </div>

      <div v-else>
        <p v-if="company.parts_count >= 100" class="mb-4 font-bold">
          Showing only 100 last update parts
        </p>

        <ul class="flex flex-col gap-y-1.5">
          <li v-for="part in parts" :key="part.id">
            <RouterLink
              :to="{ name: ROUTE.PART_EDIT, params: { id: part.id } }"
              class="font-mono underline underline-offset-2 transition-colors duration-75 hover:text-emerald-500"
              target="_blank"
            >
              {{ part.part_number }}
            </RouterLink>

            <span v-if="part.description"> - {{ part.description }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-2.5 flex cursor-auto items-center gap-x-2.5">
      <BaseButton variant="danger" class=" flex items-center gap-x-2" @click="openDeleteModal">
        <PhTrash />
        Delete
      </BaseButton>

      <BaseButton class="flex items-center gap-x-2" @click="router.push({ name: ROUTE.COMPANY_EDIT, params: { id: company.id } })">
        <PhPencil />
        Edit
      </BaseButton>
    </div>
  </div>

  <BaseModal :model-value="isDeleteModalOpen" title="Confirm deletion" size="xlarge" @close="closeDeleteModal">
    <p class="tx-lg text-center">
      Are you sure you want to delete this company?
    </p>

    <p class="mt-4 text-center text-lg">
      Deleting this company will also <span class="font-bold text-red-500">delete ALL PARTS</span> belonging to the company. This action cannot be undone.
    </p>

    <template #footer>
      <BaseButton class="mr-4" variant="danger" @click.prevent="confirmDelete">
        I'm sure
      </BaseButton>

      <BaseButton @click.prevent="closeDeleteModal">
        Cancel
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PhCaretDown, PhTrash, PhPencil } from "@phosphor-icons/vue";
import type { Company, Part } from "@/schemas";
import useCompanyStore from "@/stores/company.ts";
import useModal from "@/composables/useModal.ts";
import BaseModal from "@/components/Base/BaseModal.vue";
import { ROUTE } from "@/router/routes.ts";
import { useRouter } from "vue-router";

const props = defineProps<{
  company: Company;
}>();

const { isOpen: isDeleteModalOpen, closeModal: closeDeleteModal, openModal: openDeleteModal } = useModal();

const router = useRouter();

const companyStore = useCompanyStore();

const isOpen = ref(false);

const isFetching = ref(false);

const parts = ref<Part[]>([]);
const hasFetchedParts = ref(false);

async function getCompanyParts() {
  isFetching.value = true;

  companyStore.fetchParts(props.company.id).then((response) => {
    parts.value = response;
    hasFetchedParts.value = true;
  }).finally(() => {
    isFetching.value = false;
  });
}

function expandCard() {
  if (props.company.parts_count > 0) {
    isOpen.value = !isOpen.value;

    if (!hasFetchedParts.value) {
      getCompanyParts();
    }
  }
}

async function confirmDelete() {
  companyStore.deleteCompany(props.company.id).then(() => closeDeleteModal());
}
</script>
