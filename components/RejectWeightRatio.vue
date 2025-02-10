<script setup lang="ts">
import { defineProps, computed } from "vue";
import type { PackingType } from "@/types/PackingType";
import dayjs from "dayjs";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
      grouped.set(timeKey, {
        datetime: timeKey,
        totalReject: 0,
        totalWeight: 0,
      });
    }

    const dataEntry = grouped.get(timeKey);
    dataEntry.totalReject += entry.reject;
    dataEntry.totalWeight += entry.weight;
  });

  return Array.from(grouped.values()).map((entry) => ({
    ...entry,
    ratio:
      entry.totalWeight > 0 ? (entry.totalReject / entry.totalWeight) * 100 : 0,
  }));
});

const filteredTimestamps = computed(() => {
  const labels = groupedData.value.map((entry) => entry.datetime);
  const maxTicks = props.maxTicks || 10;

  if (labels.length <= maxTicks) {
    return labels;
  }

  const step = Math.ceil(labels.length / maxTicks);
  return labels.filter((_, index) => index % step === 0);
});

const filteredData = computed(() => {
  return groupedData.value.filter((entry) =>
    filteredTimestamps.value.includes(entry.datetime)
  );
});

const chartData = computed(() => ({
  labels: filteredTimestamps.value,
  datasets: [
    {
      label: "Reject-to-Weight Ratio (%)",
      data: filteredData.value.map((entry) => entry.ratio),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Percentage (%)",
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
      {{ filterType === "hourly" ? "Hourly" : "Daily" }} Reject-to-Weight Ratio
      (%)
    </h3>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
