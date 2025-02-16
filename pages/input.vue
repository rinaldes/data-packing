<script setup lang="ts">
const toast = useToast();
const isLoading = ref(true);
const currentDateTime = ref("");

const { data: picsResponse } = useFetch("/api/pic");

const pics = computed(
  () =>
    picsResponse.value?.data?.map((p) => ({ value: p.name, label: p.name })) ??
    []
);

const formData = reactive({
  datetime: "",
  pic: "",
  weight: 0,
  qtyA: undefined,
  qtyB: undefined,
  qtyC: undefined,
  reject: undefined,
});

const ClearForm = () => {
  formData.datetime = "";
  formData.pic = "";
  formData.weight = 0;
  formData.qtyA = undefined;
  formData.qtyB = undefined;
  formData.qtyC = undefined;
  formData.reject = undefined;
};

const enforceNumberInput = (event: Event) => {
  const input = event.target as HTMLInputElement;

  let newValue = input.value.replace(/[^0-9]/g, "");

  input.value = newValue;
};

const enforceDecimalInput = (event: Event) => {
  const input = event.target as HTMLInputElement;

  let newValue = input.value.replace(/[^0-9.]/g, "");

  const parts = newValue.split(".");
  if (parts.length > 2) {
    newValue = parts[0] + "." + parts.slice(1).join("");
  }

  input.value = newValue;
};

async function submitData() {
  if (confirm("Are you sure you want to save this packing report?")) {
    try {
      await useFetch("/api/packing", { method: "POST", body: formData });
      toast.add({ title: "Data Saved!" });
      ClearForm();
    } catch (error) {
      toast.add({ title: "Error!", color: "red" });
    }
  }
}

watch(
  () => [formData.reject, formData.qtyA, formData.qtyB, formData.qtyC],
  () => {
    const reject = Number(formData.reject) || 0;
    const qtyA = Number(formData.qtyA) || 0;
    const qtyB = Number(formData.qtyB) || 0;
    const qtyC = Number(formData.qtyC) || 0;

    formData.weight = reject + (0.2 * qtyA + 0.3 * qtyB + 0.4 * qtyC);

    formData.weight = formData.weight;
  },
  { immediate: true }
);

onMounted(() => {
  currentDateTime.value = new Date().toISOString().slice(0, 16);

  const date = new Date(currentDateTime.value);

  date.setHours(date.getHours() + 14);

  const updatedTime = date.toISOString().slice(0, 16);

  formData.datetime = updatedTime;
  isLoading.value = false;
});
</script>

<template>
  <NuxtLink to="/" class="hover:underline hover:underline-offset-4"
    >🠠 BACK</NuxtLink
  >
  <br /><br />
  <h1 class="mb-6">Packing Data Entry</h1>

  <UForm :state="formData" @submit="submitData" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <UFormGroup required>
        <Input label="Date Time">
          <UInput
            v-model="formData.datetime"
            type="datetime-local"
            variant="none"
            :required="true"
            :value="currentDateTime"
            :loading="isLoading"
            :disabled="isLoading"
          />
        </Input>
      </UFormGroup>

      <UFormGroup required>
        <Input label="PIC Packing">
          <USelect
            v-model="formData.pic"
            :options="pics"
            variant="none"
            placeholder="PIC Packing..."
            :required="true"
            :loading="isLoading"
            :disabled="isLoading"
          />
        </Input>
      </UFormGroup>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <UFormGroup required>
        <Input label="Weight (kg)">
          <UInput
            v-model="formData.weight"
            type="decimal"
            variant="none"
            :required="true"
            :disabled="true"
          />
        </Input>
      </UFormGroup>

      <UFormGroup required>
        <Input label="Reject (Kg) per jam">
          <UInput
            v-model="formData.reject"
            type="decimal"
            variant="none"
            placeholder="0"
            :required="true"
            :step="0.1"
            :min="0"
            @input="enforceDecimalInput"
            :loading="isLoading"
            :disabled="isLoading"
          />
        </Input>
      </UFormGroup>
    </div>

    <div class="border-t dark:border-gray-700">
      <h2 class="mb-4">Quantities</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <UFormGroup required>
          <Input label="Qty Pack A (0.2 kg) per jam">
            <UInput
              v-model="formData.qtyA"
              type="decimal"
              variant="none"
              placeholder="0"
              :required="true"
              :min="0"
              @input="enforceNumberInput"
              :loading="isLoading"
              :disabled="isLoading"
            />
          </Input>
        </UFormGroup>

        <UFormGroup required>
          <Input label="Qty Pack B (0.3 kg) per jam">
            <UInput
              v-model="formData.qtyB"
              type="decimal"
              variant="none"
              placeholder="0"
              :required="true"
              :min="0"
              @input="enforceNumberInput"
              :loading="isLoading"
              :disabled="isLoading"
            />
          </Input>
        </UFormGroup>

        <UFormGroup required>
          <Input label="Qty Pack C (0.4 kg) per jam">
            <UInput
              v-model="formData.qtyC"
              type="decimal"
              variant="none"
              placeholder="0"
              :required="true"
              :min="0"
              @input="enforceNumberInput"
              :loading="isLoading"
              :disabled="isLoading"
            />
          </Input>
        </UFormGroup>
      </div>
    </div>

    <div class="flex justify-center md:justify-end mt-20 gap-4 md:gap-8">
      <Button
        type="button"
        icon="i-heroicons-x-mark"
        label="CLEAR"
        @click="ClearForm"
        color="crown-of-thorns"
        :loading="isLoading"
        :disabled="isLoading"
      />
      <Button
        type="submit"
        icon="i-heroicons-document-check"
        label="SUBMIT DATA"
        :loading="isLoading"
        :disabled="isLoading"
      />
    </div>
  </UForm>
</template>
