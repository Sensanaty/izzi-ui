<template>
  <form class="mx-auto w-full max-w-6xl rounded-md border bg-neutral-900 px-3 py-2 md:max-w-2xl">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <ul v-if="Object.keys(errors).length > 0" class="mb-4 break-words text-red-500">
        <li v-for="(error, key) in errors" :key="error" class="list-white ml-4 list-outside marker:text-white">
          {{ labelize(key) }}: {{ error }}
        </li>
      </ul>
    </Transition>

    <BaseButton v-if="!isCreatePage" class="mb-4" @click="openHistoryModal">
      View Part History
    </BaseButton>

    <PartVersionModal v-if="isHistoryModalOpen" :current-part="form" @close="closeHistoryModal" @choose-past-version="choosePastVersion" @reset="resetPartHistory" />

    <div class="flex w-full flex-col gap-y-2">
      <FormField
        id="partNumber"
        v-model="form.part_number"
        :invalid="!!errors?.part_number"
        class="mb-2"
        label="Part Number"
        label-class="min-w-28"
      />

      <div class="flex justify-between border-y py-2.5 md:flex-col md:border-y-0">
        <FormField
          id="available"
          v-model.number="form.available"
          :invalid="!!errors?.available"
          class="md:my-2"
          label="Available"
          label-class="min-w-28"
        />
        <FormField
          id="reserved"
          v-model.number="form.reserved"
          :invalid="!!errors?.reserved"
          class="md:my-2"
          label="Reserved"
          label-class="min-w-28"
        />
        <FormField
          id="sold"
          v-model.number="form.sold"
          :invalid="!!errors?.sold"
          class="md:my-2"
          label="Sold"
          label-class="min-w-28"
        />
      </div>

      <div class="flex justify-between border-b pb-2.5 md:flex-col md:border-b-0">
        <FormField
          id="minCost"
          v-model.number="form.min_cost"
          :invalid="!!errors?.min_cost"
          class="md:my-2"
          label="Min Cost"
          label-class="min-w-28"
        />
        <FormField
          id="minPrice"
          v-model.number="form.min_price"
          :invalid="!!errors?.min_price"
          class="md:my-2"
          label="Min Price"
          label-class="min-w-28"
        />
        <FormField
          id="minOrder"
          v-model.number="form.min_order"
          :invalid="!!errors?.min_order"
          class="md:my-2"
          label="Min Order"
          label-class="min-w-28"
        />
      </div>

      <div class="flex justify-between border-b pb-2.5 md:flex-col md:border-b-0">
        <FormField
          id="medCost"
          v-model.number="form.med_cost"
          :invalid="!!errors?.med_cost"
          class="md:my-2"
          label="Med Cost"
          label-class="min-w-28"
        />
        <FormField
          id="medPrice"
          v-model.number="form.med_price"
          :invalid="!!errors?.med_price"
          class="md:my-2"
          label="Med Price"
          label-class="min-w-28"
        />
        <FormField
          id="medOrder"
          v-model.number="form.med_order"
          :invalid="!!errors?.med_order"
          class="md:my-2"
          label="Med Order"
          label-class="min-w-28"
        />
      </div>

      <div class="flex justify-between border-b pb-2.5 md:flex-col md:border-b-0">
        <FormField
          id="maxCost"
          v-model.number="form.max_cost"
          :invalid="!!errors?.max_cost"
          class="md:my-2"
          label="Max Cost"
          label-class="min-w-28"
        />
        <FormField
          id="maxPrice"
          v-model.number="form.max_price"
          :invalid="!!errors?.max_price"
          class="md:my-2"
          label="Max Price"
          label-class="min-w-28"
        />
        <FormField
          id="maxOrder"
          v-model.number="form.max_order"
          :invalid="!!errors?.max_order"
          class="md:my-2"
          label="Max Order"
          label-class="min-w-28"
        />
      </div>

      <FormField
        id="leadTime"
        v-model="form.lead_time"
        :invalid="!!errors?.lead_time"
        label="Lead Time"
        label-class="min-w-28"
      />

      <div class="flex items-center gap-2 border-b pb-2.5">
        <SoloLabel html-for="quoteType" class="min-w-28">
          Quote type
        </SoloLabel>
        <SoloSelect id="quoteType" v-model="form.quote_type" :invalid="!!errors?.quote_type" placeholder="Quote type">
          <option value="outright_sale">
            Outright Sale
          </option>
          <option value="flat_rate_exchange">
            Flat Rate Exchange
          </option>
          <option value="exchange_plus_cost">
            Exchange + Cost
          </option>
        </SoloSelect>
      </div>

      <SoloLabel html-for="tag" class="min-w-28">
        Tag
      </SoloLabel>
      <SoloTextarea
        id="tag"
        v-model="form.tag"
        :invalid="!!errors?.tag"
      />

      <SoloLabel html-for="description" class="min-w-28">
        Description
      </SoloLabel>
      <SoloTextarea
        id="description"
        v-model="form.description"
        :invalid="!!errors?.description"
      />

      <SoloLabel html-for="internalNote" class="min-w-28">
        Internal Note
      </SoloLabel>
      <SoloTextarea
        id="internalNote"
        v-model="form.internal_note"
        :invalid="!!errors?.internal_note"
      />
    </div>

    <div class="mt-4 flex justify-center gap-4">
      <BaseButton :disabled="partStore.isFetching" @click="handleSubmit">
        {{ isCreatePage ? 'Create' : 'Update' }}
      </BaseButton>

      <BaseButton @click.prevent="resetForm">
        Reset
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, toRaw, watch } from "vue";
import { usePartsStore } from "@/stores/parts";
import { CreatePartSchema, type CreatePart, type UpdatePart, type Part } from "@/schemas";
import FormField from "@/components/Base/Form/FormField.vue";
import { ZodError, type ZodIssue } from "zod";
import extractDefaults from "@/utils/zodUtils.ts";
import SoloLabel from "@/components/Base/Form/SoloLabel.vue";
import SoloTextarea from "@/components/Base/Form/SoloTextarea.vue";
import { labelize } from "@/utils/stringUtils.ts";
import useModal from "@/composables/useModal.ts";
import SoloSelect from "@/components/Base/Form/SoloSelect.vue";
import { onBeforeRouteLeave } from "vue-router";

const PartVersionModal = defineAsyncComponent(() => import("@/components/Parts/PartVersionModal.vue"));

type Props = { isCreatePage?: boolean };

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "submit", data: CreatePart | UpdatePart): void;
  (e: "success"): void;
}>();

const partStore = usePartsStore();
const form = ref<CreatePart | UpdatePart>(props.isCreatePage ? extractDefaults(CreatePartSchema) : partStore.currentPart );

watch(() => partStore.currentPart.id, () => {
  form.value = structuredClone(toRaw(partStore.currentPart));
  form.value.company_id = 123;
});

onBeforeRouteLeave(() => {
  partStore.clearCurrentPart();
  form.value = structuredClone(toRaw(partStore.currentPart));
});

const errors = ref<Record<string, string>>({});

function validateForm() {
  try {
    CreatePartSchema.parse(form.value);
    errors.value = {};

    return true;
  } catch (e) {
    if (e instanceof ZodError) {
      errors.value = e.errors.reduce((acc: Record<string, string>, curr: ZodIssue) => {
        acc[curr.path[0]] = curr.message;

        return acc;
      }, {});

      return false;
    }
  }
}

async function handleSubmit() {
  if (!validateForm()) return;

  try {
    if (!props.isCreatePage && "id" in form.value) {
      await partStore.updatePart(form.value.id, form.value);
    } else {
      await partStore.createPart(form.value as CreatePart);
    }

    emit("success");
    emit("submit", form.value);
  } catch (e) {
    console.error("Form submission failed:", e);
  }
}

function resetForm() {
  form.value = structuredClone(toRaw(partStore.currentPart));
  errors.value = {};
}

const { isOpen: isHistoryModalOpen, openModal: openHistoryModal, closeModal: closeHistoryModal } = useModal();

function choosePastVersion(key: keyof UpdatePart | keyof CreatePart, value: unknown) {
  // @ts-expect-error Because the types technically exclude created_at, very annoying
  form.value[key] = value;
}

function resetPartHistory(payload: UpdatePart | CreatePart) {
  form.value = structuredClone(payload);
}
</script>
