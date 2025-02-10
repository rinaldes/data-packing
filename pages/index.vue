<script setup lang="ts">
import dayjs from "dayjs";
const toast = useToast();

const { data: reports, refresh } = await useFetch("/api/reports");

const page = ref(1);
const pageCount = 10;
const q = ref("");
const tick = ref(10);
const selected = ref<"hourly" | "daily">("hourly");

const methods = [
  { value: "daily", label: "Daily" },
  { value: "hourly", label: "Hourly" },
];

const rows = ref(reports?.value?.data);
const columns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "datetime",
    label: "Date",
    sortable: true,
  },
  {
    key: "pic",
    label: "PIC",
    sortable: true,
  },
  {
    key: "weight",
    label: "Weight (kg)",
    sortable: true,
  },
  {
    key: "qtyA",
    label: "Pack A (0.2 kg)",
    sortable: true,
  },
  {
    key: "qtyB",
    label: "Pack B (0.3 kg)",
    sortable: true,
  },
  {
    key: "qtyC",
    label: "Pack C (0.4 kg)",
    sortable: true,
  },
  {
    key: "reject",
    label: "Reject (kg)",
    sortable: true,
  },
  {
    key: "actions",
    label: " ",
  },
];

async function editReport(id: string) {
  navigateTo(`/${id}`);
}

async function deleteReport(id: string) {
  if (confirm("Are you sure you want to delete this packing report?")) {
    await useFetch(`/api/reports/${id}`, {
      method: "DELETE",
    });
    await refresh();
    rows.value = rows.value?.filter((report) => report.id !== id);
    toast.add({ title: "Report deleted successfully!" });
  }
}

const filteredRows = computed(() => {
  const indexedRows = rows.value?.map((data, index) => ({
    ...data,
    id: index + 1,
    datetime: dayjs(data.datetime).format("DD MMMM YYYY HH:mm"),
    weight: (
      data.reject +
      (0.2 * data.qtyA + 0.3 * data.qtyB + 0.4 * data.qtyC)
    ).toFixed(2),
    actions: [
      {
        label: "Edit",
        icon: "i-heroicons-pencil",
        color: "plantation",
        onClick: () => editReport(data.id),
      },
      {
        label: "Delete",
        icon: "i-heroicons-trash",
        color: "crown-of-thorns",
        onClick: () => deleteReport(data.id),
      },
    ],
  }));

  if (!q.value) {
    return indexedRows;
  }

  return indexedRows
    ?.filter((data) => {
      return Object.values(data).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    })
    .slice((page.value - 1) * pageCount, page.value * pageCount);
});
</script>

<template>
  <h1 class="mb-4">Dashboard</h1>
  <div
    class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
  >
    <div class="w-1/4">
      <Input>
        <UInput v-model="q" variant="none" placeholder="Search..." />
      </Input>
    </div>
    <a href="/input">
      <Button
        class="ml-2"
        color="primary"
        label="ADD PACKING"
        icon="i-heroicons-plus"
      />
    </a>
  </div>
  <UTable :rows="filteredRows" :columns="columns">
    <template #actions-data="{ row }">
      <div class="flex justify-end gap-2">
        <UButton
          v-for="action in row.actions"
          :key="action.label"
          :icon="action.icon"
          @click="action.onClick"
          :class="`rounded-none bg-${action.color}-500 hover:bg-${action.color}-500 hover:opacity-75`"
        >
          {{ action.label }}
        </UButton>
      </div>
    </template>
  </UTable>
  <div
    class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
  >
    <UPagination
      v-model="page"
      :page-count="pageCount"
      :total="rows?.length || 0"
      class="custom-pagination"
    />
  </div>
  <div class="mt-16">
    <h1 class="text-2xl">Report</h1>
    <div class="w-48 mt-4">
      <Input label="Max Latest Data">
        <UInput
          v-model="tick"
          type="number"
          placeholder="Max Ticks"
          :ui="{ rounded: 'rounded-none' }"
          variant="none"
        />
      </Input>
    </div>
    <div class="flex justify-start gap-4 mt-4">
      <URadio
        v-for="method of methods"
        :key="method.value"
        v-model="selected"
        v-bind="method"
      />
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
    <QtyPerHourPerPIC :data="rows" :filter-type="selected" :maxTicks="tick" />
    <QtyPerHourPerModelPack
      :data="rows"
      :filter-type="selected"
      :maxTicks="tick"
    />
    <ProductivityPerPIC :data="rows" :filter-type="selected" :maxTicks="tick" />
    <RejectWeightRatio :data="rows" :filter-type="selected" :maxTicks="tick" />
    <PackRatio :data="rows" :filter-type="selected" :maxTicks="tick" />
  </div>
</template>

<style>
.custom-pagination button {
  transition: background-color 0.2s ease-in-out;
}

.custom-pagination button:hover {
  background-color: #1d4949;
  opacity: 75%;
}
</style>
