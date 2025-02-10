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
  filterType: String as () => "hourly" | "daily",
  maxTicks: Number,
});

const groupedData = computed(() => {
  const grouped = new Map();

  props.data?.forEach((entry) => {
    const timeKey =
      props.filterType === "hourly"
        ? dayjs(entry.datetime).format("DD/MM HH:00")
        : dayjs(entry.datetime).format("DD/MM");

    if (!grouped.has(timeKey)) {
      grouped.set(timeKey, {});
    }

    const dataEntry = grouped.get(timeKey);
    dataEntry[entry.pic] =
      (dataEntry[entry.pic] || 0) + entry.qtyA + entry.qtyB + entry.qtyC;
  });

  return grouped;
});

const filteredTimestamps = computed(() => {
  const labels = Array.from(groupedData.value.keys());
  const maxTicks = props.maxTicks || 10;

  if (labels.length <= maxTicks) {
    return labels;
  }

  const step = Math.ceil(labels.length / maxTicks);
  return labels.filter((_, index) => index % step === 0);
});

const filteredData = computed(() => {
  return Array.from(groupedData.value.entries())
    .filter(([key]) => filteredTimestamps.value.includes(key))
    .map(([key, value]) => ({ datetime: key, ...value }));
});

const generateRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, ${
    Math.floor(Math.random() * 50) + 50
  }%, ${Math.floor(Math.random() * 40) + 40}%)`;

const chartData = computed(() => {
  const uniquePics = new Set(props.data?.map((entry) => entry.pic));
  return {
    labels: filteredTimestamps.value,
    datasets: Array.from(uniquePics).map((pic) => ({
      label: pic,
      data: filteredData.value.map((entry) => entry[pic] || 0),
      backgroundColor: generateRandomColor(),
      borderColor: generateRandomColor(),
      borderWidth: 2,
    })),
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Quantity",
      },
    },
    x: {
      title: {
        display: true,
        text: props.filterType === "hourly" ? "Hour" : "Date",
      },
      ticks: {
        autoSkip: false,
        maxTicksLimit: props.maxTicks || 10,
      },
    },
  },
}));
</script>

<template>
  <div class="h-64">
    <h3 class="text-xl font-medium text-center">
      {{ filterType === "hourly" ? "Hourly" : "Daily" }} Quantity per PIC
    </h3>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
