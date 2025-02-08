<script setup lang="ts">
const links = [
  [
    {
      label: "Dashboard",
      icon: "i-heroicons-home",
      to: "/",
    },
    {
      label: "PIC",
      icon: "i-heroicons-users",
      to: "/pic",
    },
    {
      label: "Product",
      icon: "i-heroicons-cube",
      to: "/product",
    },
  ],
];
</script>

<template>
  <div class="py-4 px-8">
    <div class="flex justify-end">
      <UHorizontalNavigation :links="links" class="w-fit" />
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
