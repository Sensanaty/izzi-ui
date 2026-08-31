<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <h1 class="font-bold text-3xl">Users</h1>
      <p class="text-text-muted">Manage IZZICUP user access</p>
    </div>

    <RouterLink class="text-accent underline" :to="RoutePath.USER_NEW">New User</RouterLink>
  </div>

  <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>
  <p v-else-if="isLoading" class="text-text-muted" role="status">Loading users...</p>
  <p v-else-if="!users.length" class="text-text-muted">No users found</p>

  <div v-else class="overflow-x-auto">
    <table class="border-border w-full min-w-xl border-2 text-left">
      <caption class="sr-only">
        IZZICUP users and administrator access
      </caption>
      <thead class="bg-surface-raised">
        <tr>
          <th class="border-border border-b-2 px-3 py-2" scope="col">Username</th>

          <th class="border-border border-b-2 px-3 py-2" scope="col">Email</th>

          <th class="border-border border-b-2 px-3 py-2" scope="col">Administrator</th>

          <th class="border-border border-b-2 px-3 py-2" scope="col">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id" class="border-border border-b last:border-b-0">
          <th class="px-3 py-2 font-bold" scope="row">{{ user.username }}</th>

          <td class="px-3 py-2">{{ user.email }}</td>

          <td class="px-3 py-2">{{ user.admin ? "Yes" : "No" }}</td>

          <td class="flex justify-end gap-2 px-3 py-2">
            <RouterLink
              class="text-accent self-center underline"
              :to="{ name: Route.USER_EDIT, params: { id: user.id } }"
            >
              Edit
            </RouterLink>

            <IzziButton
              size="sm"
              variant="secondary"
              :aria-pressed="user.admin"
              :disabled="updatingUserId === user.id"
              @click="toggleAdmin(user)"
            >
              {{
                updatingUserId === user.id
                  ? "Saving..."
                  : user.admin
                    ? "Remove admin"
                    : "Make admin"
              }}
            </IzziButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { getUsers, updateUser } from "@/api/users";
import IzziButton from "@/components/ui/IzziButton.vue";
import { notifyApiError } from "@/lib/notifications";
import { Route, RoutePath } from "@/router/constants";

import type { User } from "@/lib/schemas/user";

const users = ref<User[]>([]);
const errorMessage = ref<string | null>(null);
const isLoading = ref(true);
const updatingUserId = ref<number | null>(null);

async function loadUsers(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    users.value = await getUsers();
  } catch (error) {
    const details = notifyApiError(error, "Unable to load users");
    errorMessage.value = details.message;
  } finally {
    isLoading.value = false;
  }
}

async function toggleAdmin(user: User): Promise<void> {
  updatingUserId.value = user.id;

  try {
    const updatedUser = await updateUser(user.id, { admin: !user.admin });
    const userIndex = users.value.findIndex((entry) => entry.id === user.id);

    if (userIndex >= 0) users.value[userIndex] = updatedUser;
  } catch (error) {
    notifyApiError(error, "Unable to update user access");
  } finally {
    updatingUserId.value = null;
  }
}

onMounted(() => {
  void loadUsers();
});
</script>
