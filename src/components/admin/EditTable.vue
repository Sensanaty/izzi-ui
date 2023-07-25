<template>
  <form class="flex flex-col w-[70%] p-2 bg-stone-800 border border-gray-600 font-mono font-bold">
    <div class="wrapper">
      <label>ID</label>
      <input v-model="localPart.id" type="text" class="bg-transparent !text-white" disabled>

      <div class="flex flex-row ml-auto items-center justify-center">
        <ph-gear-six class="ml-auto cursor-pointer hover:text-green-500 active:text-green-600 mb-2" :size="32" @click="toggleModal" />
      </div>
    </div>

    <div class="wrapper">
      <label for="part_number">Part Number</label>
      <input id="part_number" v-model="localPart.part_number" type="text" :placeholder="part.part_number" required>
    </div>

    <div class="wrapper">
      <label for="company_name">Owner</label>
      <input id="company_name" v-model="localPart.company_name" type="text" :placeholder="part.company_name" required>
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
        required
      />
    </div>

    <div class="wrapper">
      <label for="available">Available Quantity</label>
      <input id="available" v-model="localPart.available" class="max-w-[90px]" type="number" :placeholder="String(part.available)" required>
    </div>

    <div class="wrapper">
      <label for="reserved">Reserved</label>
      <input id="reserved" v-model="localPart.reserved" class="max-w-[90px]" type="number" :placeholder="String(part.reserved)">
    </div>

    <div class="wrapper">
      <label for="sold">Sold</label>
      <input id="sold" v-model="localPart.sold" class="max-w-[90px]" type="number" :placeholder="String(part.reserved)">
    </div>

    <div class="wrapper">
      <label for="condition">Condition</label>
      <input id="condition" v-model="localPart.condition" class="max-w-[110px]" type="text" :placeholder="part.condition" required>
    </div>

    <div class="wrapper flex-wrap border-t border-gray-600 pt-3">
      <div class="flex flex-row items-center">
        <label for="min_cost">Cost of Goods 1</label>
        <input id="min_cost" v-model="localPart.min_cost" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.min_cost)" required>
      </div>

      <div class="flex flex-row items-center">
        <label for="min_price">Sales Price 1</label>
        <input id="min_price" v-model="localPart.min_price" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.min_price)" required>
      </div>

      <div class="flex flex-row items-center">
        <label for="min_order">Minimum Order 1</label>
        <input id="min_order" v-model="localPart.min_order" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.min_order)" required>
      </div>
    </div>

    <div class="wrapper flex-wrap">
      <div class="flex flex-row items-center">
        <label for="med_cost">Cost of Goods 2</label>
        <input id="med_cost" v-model="localPart.med_cost" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.med_cost)" required>
      </div>

      <div class="flex flex-row items-center">
        <label for="med_price">Sales Price 2</label>
        <input id="med_price" v-model="localPart.med_price" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.med_price)" required>
      </div>

      <div class="flex flex-row items-center">
        <label for="med_order">Minimum Order 2</label>
        <input id="med_order" v-model="localPart.med_order" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.med_order)" required>
      </div>
    </div>

    <div class="wrapper flex-wrap border-b border-gray-600 pb-3">
      <div class="flex flex-row items-center">
        <label for="max_cost">Cost of Goods 3</label>
        <input id="max_cost" v-model="localPart.max_cost" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.max_cost)" required>
      </div>

      <div class="flex flex-row items-center">
        <label for="max_price">Sales Price 3</label>
        <input id="max_price" v-model="localPart.max_price" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.max_price)" required>
      </div>

      <div class="flex flex-row items-center">
        <label for="max_order">Minimum Order 3</label>
        <input id="max_order" v-model="localPart.max_order" type="number" class="max-w-[130px] mr-4" :placeholder="String(part.max_order)" required>
      </div>
    </div>

    <div class="wrapper">
      <label for="lead_time">Lead Time</label>
      <input id="lead_time" v-model="localPart.lead_time" type="text" :placeholder="part.lead_time" required>
    </div>

    <div class="wrapper">
      <label for="quote_type">Quote Type</label>
      <input id="quote_type" v-model="localPart.quote_type" type="text" :placeholder="part.quote_type" required>
    </div>

    <div class="wrapper">
      <label for="tag">Tag</label>
      <textarea
        id="tag"
        v-model="localPart.tag"
        cols="40"
        rows="4"
        type="text"
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
  </form>
</template>

<script lang="ts" setup>
  import { PhGearSix } from "@phosphor-icons/vue";
  import { ref, toRef } from "vue";
  import { useRouter } from "vue-router";

  import useModal from "~/composables/useModal";
  import useNotificationStore from "~/store/notification";
  import usePartStore from "~/store/part";
  import type Part from "~/types/store/part";
  import BaseButton from "~components/base/BaseButton.vue";
  import BaseModal from "~components/base/BaseModal.vue";

  const partStore = usePartStore();
  const notification = useNotificationStore();
  const router = useRouter();

  const props = defineProps<{
    part: Part | Partial<Part>
  }>();
  const localPart = toRef({ ...props.part });

  const isSaveDisabled = ref(false);

  const shouldSave = (): boolean => {
    return true;
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

    await partStore.updatePart(payload).then(() => {
      notification.createNotification(`${localPart.value.part_number} Updated Successfuly`, "succ");
      isSaveDisabled.value = false;

      if (editOptions.value.redirectAfterSaving) {
        router.push("/admin");
      }
    });
  }

  const { toggleModal, isModalOpen } = useModal();

  type EditOptions = { redirectAfterSaving: boolean }

  const editOptions = ref({
    redirectAfterSaving: !!localStorage.getItem("editOptions/redirectAfterSaving"),
  });

  const setEditOption = (option: keyof EditOptions, save: boolean) => {
    save ? localStorage.setItem(`editOptions/${option}`, String(true)) : localStorage.removeItem(`editOptions/${option}`);

    editOptions.value[option] = save;
  };
</script>

<style scoped>
.wrapper {
  @apply flex flex-row mb-3;
}

input, textarea {
  @apply text-black px-3 py-0.5;
}

input {
  @apply max-h-[30px];
}

label:has(+ input:required):after {
  @apply text-red-500;
  content: " *";
}

label {
  @apply mr-3 min-w-[190px] bg-stone-700 px-2 py-1;
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
