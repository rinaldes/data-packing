<script setup>
const { data: pics, refresh } = useFetch("/api/pic");
const newPIC = ref({ name: "" });
const rows = computed(() => pics.value?.data || []);
const page = ref(1);
const pageCount = 10;
const q = ref("");

async function addPIC() {
  try {
    await useFetch("/api/pic", {
      method: "POST",
      body: newPIC.value,
    });
    newPIC.value = { name: "" };
    await refresh();
  } catch (error) {
    console.error("Failed to add PIC:", error);
  }
}

const columns = [
  {
    key: "id",
    label: "No",
    sortable: true,
  },
  {
    key: "name",
    label: "PIC Pengerjaan",
    sortable: true,
  },
];

const filteredRows = computed(() => {
  const indexedRows = rows.value?.map((data, index) => ({
    ...data,
    id: index + 1,
  }));

  if (!q.value) {
    return indexedRows;
  }

  return indexedRows?.filter((data) => {
    return Object.values(data).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const paginatedRows = computed(() => {
  return filteredRows.value?.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  );
});
</script>

<template>
  <div>
    <h1>Manage PICs</h1>
    <br />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <UForm @submit="addPIC">
        <Input label="Nama PIC Pengerjaan">
          <UInput
            v-model="newPIC.name"
            placeholder="New Name..."
            required
            variant="none"
          />
        </Input>
        <br />
        <Button
          type="submit"
          icon="i-heroicons-document-check"
          label="SUBMIT DATA"
        />
      </UForm>
      <div class="col-span-2">
        <div class="w-1/4">
          <Input label="Cari PIC Pengerjaan">
            <UInput v-model="q" variant="none" placeholder="Search..." />
          </Input>
        </div>
        <br />
        <UTable :rows="paginatedRows" :columns="columns" />
        <div
          class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
        >
          <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="filteredRows?.length || 0"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>
