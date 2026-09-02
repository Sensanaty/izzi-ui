<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <h1 class="font-bold text-3xl">{{ isEditing ? "Edit User" : "New User" }}</h1>

      <p class="text-text-muted">
        {{
          isEditing ? "Update this IZZICUP user's access" : "Create an account for an IZZICUP user"
        }}
      </p>
    </div>

    <RouterLink class="text-accent underline" :to="RoutePath.USERS">Back to users</RouterLink>
  </div>

  <p v-if="loadError" class="text-danger" role="alert">{{ loadError }}</p>
  <p v-else-if="isLoadingUser" class="text-text-muted" role="status">Loading user...</p>

  <form
    v-else
    class="bg-surface-raised border-border grid w-full max-w-2xl gap-6 rounded-sm border-2 p-4"
    novalidate
    @submit.prevent="submitForm"
  >
    <div class="grid gap-4 md:grid-cols-2">
      <IzziInput
        id="user-username"
        v-model="form.username"
        autocomplete="username"
        label="Username"
        :disabled="isSaving"
        :error="fieldError('username')"
        required
      />

      <IzziInput
        id="user-email"
        v-model="form.email"
        autocomplete="email"
        label="Email"
        :disabled="isSaving"
        :error="fieldError('email')"
        type="email"
        required
      />

      <IzziInput
        id="user-password"
        v-model="form.password"
        autocomplete="new-password"
        :description="
          isEditing ? 'Leave blank to keep the current password' : 'Use at least 9 characters'
        "
        label="Password"
        :disabled="isSaving"
        :error="fieldError('password')"
        type="password"
        :required="!isEditing"
      />
    </div>

    <label class="flex items-center gap-2 font-bold" for="user-admin">
      <input
        id="user-admin"
        v-model="form.admin"
        class="size-4"
        type="checkbox"
        :disabled="isSaving"
      />
      Administrator access
    </label>

    <div class="flex gap-2">
      <IzziButton type="submit" :disabled="isSaving">
        {{ isSaving ? "Saving..." : isEditing ? "Save user" : "Create user" }}
      </IzziButton>

      <IzziButton variant="secondary" :disabled="isSaving" @click="cancel">Cancel</IzziButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { createUser, getUser, updateUser } from "@/api/users";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziInput from "@/components/ui/IzziInput.vue";
import { notifyApiError } from "@/lib/notifications";
import { Route, RoutePath } from "@/router/constants";
import { useNotificationStore } from "@/stores/notification";

type UserFormState = {
  username: string;
  email: string;
  password: string;
  admin: boolean;
};

const route = useRoute();
const router = useRouter();
const { createNotification } = useNotificationStore();
const isEditing = computed(() => route.name === Route.USER_EDIT);
const userId = computed(() => {
  const value = route.params.id;
  const parsedValue = typeof value === "string" ? Number(value) : NaN;

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
});
const form = reactive<UserFormState>({ username: "", email: "", password: "", admin: false });
const fieldErrors = ref<Record<string, string[]>>({});
const isLoadingUser = ref(isEditing.value);
const isSaving = ref(false);
const loadError = ref<string | null>(null);

function fieldError(field: "username" | "email" | "password"): string | null {
  return fieldErrors.value[field]?.join(", ") ?? null;
}

function validateForm(): boolean {
  const errors: Record<string, string[]> = {};

  if (!form.username.trim()) errors.username = ["is required"];
  if (!form.email.trim()) errors.email = ["is required"];
  if (!isEditing.value && !form.password) errors.password = ["is required"];

  fieldErrors.value = errors;

  if (Object.keys(errors).length === 0) return true;

  createNotification("Username and email are required", { kind: "w" });

  return false;
}

async function loadUser(): Promise<void> {
  if (!isEditing.value) return;

  if (userId.value === null) {
    loadError.value = "The requested user could not be found";
    isLoadingUser.value = false;

    return;
  }

  try {
    const user = await getUser(userId.value);
    form.username = user.username;
    form.email = user.email;
    form.admin = user.admin;
  } catch (error) {
    const details = notifyApiError(error, "Unable to load user");
    loadError.value = details.message;
  } finally {
    isLoadingUser.value = false;
  }
}

async function submitForm(): Promise<void> {
  if (!validateForm()) return;

  fieldErrors.value = {};
  isSaving.value = true;

  try {
    if (isEditing.value && userId.value !== null) {
      await updateUser(userId.value, {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password || undefined,
        admin: form.admin,
      });
      createNotification("User updated");
    } else {
      await createUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        admin: form.admin,
      });
      createNotification("User created");
    }

    await router.replace(RoutePath.USERS);
  } catch (error) {
    const details = notifyApiError(
      error,
      isEditing.value ? "Unable to update user" : "Unable to create user",
    );
    fieldErrors.value = details.fieldErrors;
  } finally {
    isSaving.value = false;
  }
}

function cancel(): void {
  void router.push(RoutePath.USERS);
}

onMounted(() => {
  void loadUser();
});
</script>
