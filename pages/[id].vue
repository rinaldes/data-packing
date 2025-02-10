<script setup lang="ts">
import dayjs from "dayjs";

const toast = useToast();
const route = useRoute();

const { data: picsResponse } = await useFetch("/api/pic");
const pics = computed(
  () =>
    picsResponse.value?.data?.map((p) => ({ value: p.name, label: p.name })) ??
    []
);

const reportId = route.params.id as string;

const formData = reactive({
  datetime: "",
  pic: "",
  weight: 0,
  qtyA: undefined as number | undefined,
  qtyB: undefined as number | undefined,
  qtyC: undefined as number | undefined,
  reject: undefined as number | undefined,
});

// Fetch the current report data from the API when the component mounts
const { data: reportData } = await useFetch(`/api/reports/${reportId}`, {
  method: "GET",
});

onMounted(() => {
  if (reportData.value) {
    const report = reportData.value;
    formData.datetime = dayjs(report.datetime).format("YYYY-MM-DDTHH:mm"); // Format the datetime for input    formData.pic = report.pic;
    formData.weight = report.weight;
    formData.qtyA = report.qtyA;
    formData.qtyB = report.qtyB;
    formData.qtyC = report.qtyC;
    formData.reject = report.reject;
    formData.pic = report.pic;
  }
});

// Recalculate weight automatically when inputs change
watch(
  () => [formData.reject, formData.qtyA, formData.qtyB, formData.qtyC],
  () => {
    const reject = Number(formData.reject) || 0;
    const qtyA = Number(formData.qtyA) || 0;
    const qtyB = Number(formData.qtyB) || 0;
    const qtyC = Number(formData.qtyC) || 0;
    formData.weight = reject + (0.2 * qtyA + 0.3 * qtyB + 0.4 * qtyC);
  },
  { immediate: true }
);

// Function to submit the edited report
const submitData = async () => {
  if (
    confirm(
      "Are you sure you want to update this packing report and return to dashboard?"
    )
  ) {
    try {
      const { data, error } = await useFetch(`/api/reports/${reportId}`, {
        method: "PUT",
        body: formData,
      });

      if (error.value) {
        throw new Error(error.value.message || "Failed to update report");
      }

      toast.add({ title: "Report updated successfully!" });
      navigateTo("/");
    } catch (err) {
      toast.add({ title: "Error updating report", color: "red" });
    }
  }
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
  <div class="p-4">
    <h1 class="text-2xl mb-4">Edit Report</h1>
    <!-- You can reuse your UForm and UFormGroup components -->
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
              :value="dayjs(formData.datetime)"
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
          type="submit"
          icon="i-heroicons-document-check"
          label="UPDATE REPORT"
        />
      </div>
    </UForm>
  </div>
</template>
