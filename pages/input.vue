<script setup lang="ts">
const { data: picsResponse } = useFetch("/api/pic");
const toast = useToast();
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

watch(
  () => [formData.reject, formData.qtyA, formData.qtyB, formData.qtyC],
  () => {
    const reject = Number(formData.reject) || 0; // Convert to number
    const qtyA = Number(formData.qtyA) || 0; // Convert to number
    const qtyB = Number(formData.qtyB) || 0; // Convert to number
    const qtyC = Number(formData.qtyC) || 0;
    console.log("Reject ori:", reject);

    // Calculate the weight based on the formula
    formData.weight = reject + (0.2 * qtyA + 0.3 * qtyB + 0.4 * qtyC);

    // Optional: Format the weight to show only one decimal place
    formData.weight = formData.weight;
  },
  { immediate: true } // This will also run the calculation immediately on initial load
);

async function submitData() {
  try {
    await useFetch("/api/packing", { method: "POST", body: formData });
    toast.add({ title: "Data Saved!" });
    ClearForm();
  } catch (error) {
    toast.add({ title: "Error!", color: "red" });
  }
}

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
</script>

<template>
  <a href="/" class="hover:underline hover:underline-offset-4">🠠 BACK</a>
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
            placeholder="Date Time..."
            :required="true"
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
          />
        </Input>
      </UFormGroup>
    </div>

    <div class="border-t dark:border-gray-700 pt-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quantities
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <UFormGroup required>
          <Input label="Qty Pack A per jam">
            <UInput
              v-model="formData.qtyA"
              type="decimal"
              variant="none"
              placeholder="0"
              :required="true"
              :min="0"
              @input="enforceNumberInput"
            />
          </Input>
        </UFormGroup>

        <UFormGroup required>
          <Input label="Qty Pack B per jam">
            <UInput
              v-model="formData.qtyB"
              type="decimal"
              variant="none"
              placeholder="0"
              :required="true"
              :min="0"
              @input="enforceNumberInput"
            />
          </Input>
        </UFormGroup>

        <UFormGroup required>
          <Input label="Qty Pack C per jam">
            <UInput
              v-model="formData.qtyC"
              type="decimal"
              variant="none"
              placeholder="0"
              :required="true"
              :min="0"
              @input="enforceNumberInput"
            />
          </Input>
        </UFormGroup>
      </div>
    </div>

    <div class="flex justify-end mt-16 gap-8">
      <Button
        type="button"
        icon="i-heroicons-x-mark"
        label="CLEAR"
        @click="ClearForm"
        color="crown-of-thorns"
      />
      <Button
        type="submit"
        icon="i-heroicons-document-check"
        label="SUBMIT DATA"
      />
    </div>
  </UForm>
</template>
