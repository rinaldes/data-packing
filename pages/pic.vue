<script setup lang="ts">
const toast = useToast();
const isLoading = ref(true);
const { data: pics, refresh } = useFetch("/api/pic");
const newPIC = ref({ name: "" });
const rows = computed(() => pics.value?.data || []);
const page = ref(1);
const pageCount = 10;
const q = ref("");
const search = ref("");
const columns = [
  {
    key: "id",
    label: "No",
  },
  {
    key: "name",
    label: "PIC Pengerjaan",
  },
  {
    key: "actions",
    label: " ",
  },
];
const filteredRows = computed(() => {
  const indexedRows = rows.value?.map((data, index) => ({
    ...data,
    id: index + 1,
    actions: [
      {
        label: "Delete",
        icon: "i-heroicons-trash",
        color: "crown-of-thorns",
        onClick: () => deletePIC(data.id),
      },
    ],
  }));

  let filtered = indexedRows;

  if (q.value) {
    filtered = indexedRows?.filter((data) =>
      Object.values(data).some((value) =>
        String(value).toLowerCase().includes(q.value.toLowerCase())
      )
    );
  }
  return filtered?.slice((page.value - 1) * pageCount, page.value * pageCount);
});

const paginatedRows = computed(() => {
  return filteredRows.value?.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  );
});

async function addPIC() {
  try {
    await useFetch("/api/pic", {
      method: "POST",
      body: newPIC.value,
    });
    newPIC.value = { name: "" };
    await refresh();
    toast.add({ title: "PIC added successfully!" });
  } catch (error) {
    console.error("Failed to add PIC:", error);
  }
}

async function deletePIC(id: string) {
  if (confirm("Are you sure you want to delete this packing report?")) {
    await useFetch(`/api/pic/${id}`, {
      method: "DELETE",
    });
    await refresh();
    toast.add({ title: "PIC deleted successfully!" });
  }
}

const debouncedSetQuery = useDebounceFn((newQuery: string) => {
  q.value = newQuery;
  page.value = 1;
}, 725);

watch(search, (newQuery) => {
  debouncedSetQuery(newQuery);
});

onMounted(async () => {
  await refresh();
  isLoading.value = false;
});
</script>

<template>
  <div>
    <h1>Manage PICs</h1>
    <br />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-12">
      <UForm :state="newPIC" @submit="addPIC">
        <Input label="Nama PIC Pengerjaan">
          <UInput
            v-model="newPIC.name"
            placeholder="New Name..."
            required
            variant="none"
            :disabled="isLoading"
            :loading="isLoading"
          />
        </Input>
        <br />
        <Button
          type="submit"
          icon="i-heroicons-document-check"
          label="SUBMIT DATA"
          class="w-full lg:w-auto"
          :disabled="isLoading"
          :loading="isLoading"
        />
      </UForm>
      <div class="col-span-2">
        <div class="w-full md:w-1/4">
          <Input label="Cari PIC Pengerjaan">
            <UInput
              v-model="search"
              variant="none"
              placeholder="Search..."
              :disabled="isLoading"
              :loading="isLoading"
            />
          </Input>
        </div>
        <br />
        <UTable :rows="paginatedRows" :columns="columns">
          <template #actions-data="{ row }">
            <div class="flex justify-end gap-2">
              <UButton
                v-for="action in row.actions"
                :key="action.label"
                :icon="action.icon"
                @click="action.onClick"
                :class="`rounded-none bg-${action.color}-500 hover:bg-${action.color}-500 hover:opacity-75`"
                :disabled="isLoading"
                :loading="isLoading"
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
            :total="filteredRows?.length || 0"
            class="custom-pagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>
