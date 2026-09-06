<template>
  <IzziModal v-model="isOpen" title="Dirty company records" size="md">
    <div class="grid gap-4">
      <p>
        Dirty records are companies that were referenced by legacy parts or contacts but were
        missing from the legacy company table
      </p>

      <p>
        Their relationships were preserved, but the company details could not be recovered. These
        records may have a blank name and incomplete contact details
      </p>

      <section class="grid gap-2">
        <h2 class="font-bold">How to review them</h2>

        <ol class="list-decimal space-y-1 pl-5">
          <li>Open a company record from the table</li>

          <li>
            Review its Parts and Contacts sections in the details sidebar (Ctrl+Click in the table
            or View Company action)
          </li>

          <li>Use that information to identify and complete the company details</li>

          <li>Edit the company and mark cleanup complete after reviewing it</li>
        </ol>
      </section>

      <p class="text-text-muted text-sm">
        Filtering by dirty records is {{ isFiltering ? "currently enabled" : "available" }} from the
        button above
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <IzziButton variant="secondary" @click="isOpen = false">Close</IzziButton>
      </div>
    </template>
  </IzziModal>
</template>

<script setup lang="ts">
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziModal from "@/components/ui/IzziModal.vue";

defineProps<{ isFiltering: boolean }>();
const isOpen = defineModel<boolean>({ required: true });
</script>
