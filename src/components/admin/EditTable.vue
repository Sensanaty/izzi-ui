<template>
  <div class="flex flex-col w-[70%] p-2 bg-stone-800 border border-gray-600 font-mono font-bold">
    <div class="wrapper">
      <label>ID</label>
      <input v-model="localPart.id" type="text" class="bg-transparent !text-white" disabled>

      <div class="flex flex-row ml-auto items-center justify-center">
        <ph-gear-six class="ml-auto cursor-pointer hover:text-green-500 active:text-green-600 mb-2" :size="24" @click="toggleModal" />
      </div>
    </div>

    <div class="wrapper">
      <label for="part_number">Part Number</label>
      <input
        id="part_number"
        v-model="localPart.part_number"
        type="text"
        class="w-[400px]"
        :placeholder="part.part_number ?? 'ABC'"
        :class="{ error: formErrors.part_number }"
        required
      >
    </div>

    <div class="wrapper">
      <label for="company_name">Owner <span class="text-red-500">*</span></label>

      <Suspense>
        <CompanySearch class="mr-4" @set-company="setCompany" />
      </Suspense>

      <BaseButton class="mr-3" @click.prevent="toggleCompanyEditModal">Edit Company</BaseButton>
      <BaseButton class="mr-3" @click.prevent="toggleQuickAddModal">Quick Add</BaseButton>
      <BaseButton class="mr-3" @click.prevent="toggleCompanyModal">New Company</BaseButton>

      <BaseModal :is-open="isCompanyEditModalOpen" title="Edit Company" large @close="toggleCompanyEditModal">
        <CompanyEdit class="bg-stone-900 p-3" :is-new="false" @close-modal="toggleCompanyEditModal" />
      </BaseModal>

      <BaseModal :is-open="isQuickAddModalOpen" title="Quick Add" @close="toggleQuickAddModal">
        <CompanyEdit :quick="true" :is-new="true" @close-modal="toggleQuickAddModal" />
      </BaseModal>

      <BaseModal :is-open="isCompanyModalOpen" title="Create new Company" large @close="toggleCompanyModal">
        <CompanyEdit class="bg-stone-900 p-3" :is-new="true" @close-modal="toggleCompanyModal" />
      </BaseModal>
    </div>

    <div class="wrapper">
      <label for="added">Date Added</label>
      <input id="added" v-model="localPart.added" type="date">
    </div>

    <div class="wrapper">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="localPart.description"
        cols="40"
        rows="4"
        type="text"
        :class="{ error: formErrors.description }"
        required
      />
    </div>

    <div class="wrapper">
      <label for="available">Available Quantity</label>
      <input
        id="available"
        v-model="localPart.available"
        class="max-w-[90px]"
        type="number"
        :class="{ error: formErrors.available }"
        required
      >
    </div>

    <div class="wrapper">
      <label for="reserved">Reserved</label>
      <input id="reserved" v-model="localPart.reserved" class="max-w-[90px]" type="number">
    </div>

    <div class="wrapper">
      <label for="sold">Sold</label>
      <input id="sold" v-model="localPart.sold" class="max-w-[90px]" type="number">
    </div>

    <div class="wrapper">
      <label for="condition">Condition</label>
      <input
        id="condition"
        v-model="localPart.condition"
        class="max-w-[110px]"
        type="text"
        :class="{ error: formErrors.condition }"
        required
      >
    </div>

    <div class="wrapper flex-wrap border-t border-gray-600 pt-3">
      <div class="flex flex-row items-center">
        <label for="min_cost">Cost of Goods 1</label>
        <input
          id="min_cost"
          v-model="localPart.min_cost"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.min_cost }"
          required
        >
      </div>

      <div class="flex flex-row items-center">
        <label for="min_price">Sales Price 1</label>
        <input
          id="min_price"
          v-model="localPart.min_price"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.min_price }"
          required
        >
      </div>

      <div class="flex flex-row items-center">
        <label for="min_order">Minimum Order 1</label>
        <input
          id="min_order"
          v-model="localPart.min_order"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.min_order }"
          required
        >
      </div>
    </div>

    <div class="wrapper flex-wrap">
      <div class="flex flex-row items-center">
        <label for="med_cost">Cost of Goods 2</label>
        <input
          id="med_cost"
          v-model="localPart.med_cost"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.med_cost }"
          required
        >
      </div>

      <div class="flex flex-row items-center">
        <label for="med_price">Sales Price 2</label>
        <input
          id="med_price"
          v-model="localPart.med_price"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.med_price }"
          required
        >
      </div>

      <div class="flex flex-row items-center">
        <label for="med_order">Minimum Order 2</label>
        <input
          id="med_order"
          v-model="localPart.med_order"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.med_order }"
          required
        >
      </div>
    </div>

    <div class="wrapper flex-wrap border-b border-gray-600 pb-3">
      <div class="flex flex-row items-center">
        <label for="max_cost">Cost of Goods 3</label>
        <input
          id="max_cost"
          v-model="localPart.max_cost"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.max_cost }"
          required
        >
      </div>

      <div class="flex flex-row items-center">
        <label for="max_price">Sales Price 3</label>
        <input
          id="max_price"
          v-model="localPart.max_price"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.max_price }"
          required
        >
      </div>

      <div class="flex flex-row items-center">
        <label for="max_order">Minimum Order 3</label>
        <input
          id="max_order"
          v-model="localPart.max_order"
          type="number"
          class="max-w-[130px] mr-4"
          :class="{ error: formErrors.max_order }"
          required
        >
      </div>
    </div>

    <div class="wrapper">
      <label for="lead_time">Lead Time</label>
      <input
        id="lead_time"
        v-model="localPart.lead_time"
        type="text"
        :placeholder="part.lead_time ?? 'NE'"
        :class="{ error: formErrors.lead_time }"
        required
      >
    </div>

    <div class="wrapper">
      <label for="quote_type">Quote Type</label>
      <input
        id="quote_type"
        v-model="localPart.quote_type"
        type="text"
        :placeholder="part.quote_type ?? 'OUTRIGHT SALE'"
        :class="{ error: formErrors.quote_type }"
        required
      >
    </div>

    <div class="wrapper">
      <label for="tag">Tag</label>
      <textarea
        id="tag"
        v-model="localPart.tag"
        cols="40"
        rows="4"
        type="text"
        :class="{ error: formErrors.tag }"
        required
      />
    </div>

    <div class="wrapper">
      <label for="internal_note">Internal Note</label>
      <textarea
        id="internal_note"
        v-model="localPart.internal_note"
        cols="40"
        rows="4"
        type="text"
      />
    </div>

    <BaseButton class="mx-auto my-3 text-2xl" :disabled="isSaveDisabled" @click.prevent="savePart">Save</BaseButton>

    <BaseModal :is-open="isModalOpen" title="Editing Options" @close="toggleModal">
      <div class="flex flex-row items-center">
        <label for="redirectAfterSaving" class="!bg-transparent mr-4 text-xl cursor-pointer">Redirect after saving</label>
        <input id="redirectAfterSaving" class="my-auto align-middle" type="checkbox" :checked="editOptions.redirectAfterSaving" @change="setEditOption('redirectAfterSaving', (<HTMLInputElement>$event.target).checked)">
      </div>
    </BaseModal>
  </div>
</template>

<script lang="ts" setup>
  import { PhGearSix } from "@phosphor-icons/vue";
  import { useEventListener } from "@vueuse/core";
  import { onBeforeUnmount, ref, toRef } from "vue";
  import { useRouter } from "vue-router";

  import useModal from "~/composables/useModal";
  import useCompanyStore from "~/store/company";
  import useNotificationStore from "~/store/notification";
  import usePartStore from "~/store/part";
  import type Company from "~/types/store/company";
  import type Part from "~/types/store/part";
  import CompanySearch from "~components/admin/table/CompanySearch.vue";
  import BaseButton from "~components/base/BaseButton.vue";
  import BaseModal from "~components/base/BaseModal.vue";
  import CompanyEdit from "~components/Companies/CompanyEdit.vue";

  const partStore = usePartStore();
  const notification = useNotificationStore();
  const companyStore = useCompanyStore();
  const router = useRouter();

  const props = defineProps<{
    part: Partial<Part>,
    isNew: boolean
  }>();
  const localPart = toRef({ ...props.part });

  const isSaveDisabled = ref(false);

  const formErrors = ref({
    part_number: false,
    available: false,
    description: false,
    condition: false,
    min_cost: false,
    min_price: false,
    min_order: false,
    med_cost: false,
    med_price: false,
    med_order: false,
    max_cost: false,
    max_price: false,
    max_order: false,
    lead_time: false,
    quote_type: false,
    tag: false,
  });

  const shouldSave = (): boolean => {
    const required = Object.keys(formErrors.value);
    let canSave = true;

    required.forEach((field) => {
      // @ts-ignore
      formErrors.value[field] = !localPart.value[field];
    });

    required.forEach((field) => {
      // @ts-ignore
      if (formErrors.value[field]) { canSave = false; }
    });

    if (!canSave) {
      notification.createNotification("Please make sure all required fields are filled in properly", "dang", 4000);
    }

    return canSave;
  };

  async function savePart() {
    if (isSaveDisabled.value || !shouldSave()) {
      return;
    }

    isSaveDisabled.value = true;
    const payload = localPart.value;

    delete payload.created_at;
    delete payload.updated_at;
    delete payload.company_name;

    await partStore.updatePart(payload, props.isNew).then(() => {
      notification.createNotification(`${localPart.value.part_number} Updated Successfuly`, "succ");
      isSaveDisabled.value = false;

      if (editOptions.value.redirectAfterSaving) {
        router.push("/admin");
      }
    }).catch(() => {
      isSaveDisabled.value = false;
    });
  }

  const { isModalOpen, toggleModal } = useModal();

  const isCompanyModalOpen = ref(false);
  const toggleCompanyModal = () => { isCompanyModalOpen.value = !isCompanyModalOpen.value; };

  const isQuickAddModalOpen = ref(false);
  const toggleQuickAddModal = () => {
    companyStore.activeCompany = companyStore.companies.find((company) => company.id === localPart.value.company_id) as Partial<Company>;
    isQuickAddModalOpen.value  = !isQuickAddModalOpen.value;
  };

  const isCompanyEditModalOpen = ref(false);
  const toggleCompanyEditModal = () => {
    companyStore.activeCompany = companyStore.companies.find((company) => company.id === localPart.value.company_id) as Partial<Company>;
    isCompanyEditModalOpen.value = !isCompanyEditModalOpen.value;
  };

  type EditOptions = { redirectAfterSaving: boolean }

  const editOptions = ref({
    redirectAfterSaving: !!localStorage.getItem("editOptions/redirectAfterSaving"),
  });

  const setEditOption = (option: keyof EditOptions, save: boolean) => {
    save ? localStorage.setItem(`editOptions/${option}`, String(true)) : localStorage.removeItem(`editOptions/${option}`);

    editOptions.value[option] = save;
  };

  function setCompany(id: Company["id"]) {
    localPart.value.company_id = id;
  }

  const navigateBackListener = useEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "b")  {
      router.push("/admin");
    }
  });

  onBeforeUnmount(() => navigateBackListener());
</script>

<style scoped>
.wrapper {
  @apply flex flex-row mb-3;
}

input, textarea {
  @apply text-black px-3 py-0.5 border-4 border-transparent;
}

input {
  @apply max-h-[30px];
  transition: border-color;
}

.error {
  @apply border-red-500 border-4;
}

label:has(+ input:required):after, label:has(+ textarea:required):after {
  @apply text-red-500;
  content: " *";
}

label {
  @apply mr-3 min-w-[215px] bg-stone-700 px-2 py-1;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
