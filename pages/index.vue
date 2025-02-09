<script setup lang="ts">
type Packing = {
  id: string;
  datetime: string;
  pic: string;
  weight: number;
  qtyA: number;
  qtyB: number;
  qtyC: number;
  reject: number;
};

const { data: reports } = await useFetch("/api/reports");
const rows = reports?.value?.data;
const columns = [
  {
    key: "id",
    label: "No",
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

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return rows;
  }

  return rows?.filter((data) => {
    return Object.values(data).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>

<template>
  <h1 class="mb-4">Dashboard</h1>
  <h2 class="font-semibold">Report Data</h2>
  <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
    <Input>
      <UInput v-model="q" variant="none" placeholder="Search..." />
    </Input>
  </div>
  <UTable :rows="filteredRows" :columns="columns" class="flex-1" />
</template>
