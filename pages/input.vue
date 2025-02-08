<script setup lang="ts">
import { UButton } from "#components";

const formData = reactive({
  datetime: "",
  pic: "",
  weight: 0,
  qtyA: 0,
  qtyB: 0,
  qtyC: 0,
  reject: 0,
});

async function submitData() {
  await useFetch("/api/packing", { method: "POST", body: formData });
  alert("Data submitted!");
}

const ClearForm = () => {
  formData.datetime = "";
  formData.pic = "";
  formData.weight = 0;
  formData.qtyA = 0;
  formData.qtyB = 0;
  formData.qtyC = 0;
  formData.reject = 0;
};
</script>

<template>
  <UCard class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Packing Data Entry
    </h1>

    <UForm :state="formData" @submit="submitData" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Datetime" required class="w-full">
          <UInput
            v-model="formData.datetime"
            type="datetime-local"
            icon="i-heroicons-calendar-days"
            :required="true"
          />
        </UFormGroup>

        <UFormGroup label="PIC Name" required>
          <UInput
            v-model="formData.pic"
            type="text"
            icon="i-heroicons-user-circle"
            :required="true"
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Weight (kg)" required>
          <UInput
            v-model="formData.weight"
            type="number"
            step="0.1"
            min="0"
            icon="i-heroicons-scale"
            :required="true"
          />
        </UFormGroup>

        <UFormGroup label="Reject (kg)" required>
          <UInput
            v-model="formData.reject"
            type="number"
            step="0.1"
            min="0"
            icon="i-heroicons-x-circle"
            :required="true"
          />
        </UFormGroup>
      </div>

      <div class="border-t dark:border-gray-700 pt-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quantities
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormGroup label="Qty A" required>
            <UInput
              v-model="formData.qtyA"
              type="number"
              min="0"
              icon="i-heroicons-tag"
              :required="true"
            />
          </UFormGroup>

          <UFormGroup label="Qty B" required>
            <UInput
              v-model="formData.qtyB"
              type="number"
              min="0"
              icon="i-heroicons-tag"
              :required="true"
            />
          </UFormGroup>

          <UFormGroup label="Qty C" required>
            <UInput
              v-model="formData.qtyC"
              type="number"
              min="0"
              icon="i-heroicons-tag"
              :required="true"
            />
          </UFormGroup>
        </div>
      </div>

      <div class="flex justify-end mt-8 gap-4">
        <UButton
          type="button"
          size="lg"
          icon="i-heroicons-x-mark"
          @click="ClearForm"
          color="primary"
        >
          Clear
        </UButton>
        <UButton
          type="submit"
          color="primary"
          icon="i-heroicons-document-check"
          class="button"
        >
          Submit Data
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
