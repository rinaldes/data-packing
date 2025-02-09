<script setup lang="ts">
import dayjs from "dayjs";

const { data: reports } = await useFetch("/api/reports");

const page = ref(1);
const pageCount = 10;
const q = ref("");

const rows = reports?.value?.data;
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
    label: "Weight",
    sortable: true,
  },
  {
    key: "qtyA",
    label: "A",
    sortable: true,
  },
  {
    key: "qtyB",
    label: "B",
    sortable: true,
  },
  {
    key: "qtyC",
    label: "C",
    sortable: true,
  },
  {
    key: "reject",
    label: "Reject",
    sortable: true,
  },
];

const filteredRows = computed(() => {
  const indexedRows = rows?.map((data, index) => ({
    ...data,
    id: index + 1,
    datetime: dayjs(data.datetime).locale("id").format("DD MMMM YYYY HH:mm"),
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
  <UTable :rows="filteredRows" :columns="columns" class="flex-1" />
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
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
    <QtyPerHourPerPIC :data="rows" />
    <QtyPerHourPerModelPack :data="rows" />
    <ProductivityPerPIC :data="rows" />
    <RejectWeightRatio :data="rows" />
    <PackRatio :data="rows" />
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
