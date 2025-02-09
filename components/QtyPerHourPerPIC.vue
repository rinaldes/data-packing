<script setup lang="ts">
import { defineProps, computed } from "vue";
import type { PackingType } from "@/types/PackingType";
import dayjs from "dayjs";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  data: Array as () => PackingType[],
});

const chartData = computed(() => ({
  labels: props.data?.map((entry) => dayjs(entry.datetime).format("HH:mm")),
  datasets: [
    {
      label: "Quantity A",
      data: props.data?.map((entry) => entry.qtyA),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    {
      label: "Quantity A",
      data: props.data?.map((entry) => entry.qtyA),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
