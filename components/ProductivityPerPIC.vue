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
    if (!dataEntry[entry.pic]) {
      dataEntry[entry.pic] = {
        totalQtyA: 0,
        totalQtyB: 0,
        totalQtyC: 0,
      };
    }

    dataEntry[entry.pic].totalQtyA += entry.qtyA;
    dataEntry[entry.pic].totalQtyB += entry.qtyB;
    dataEntry[entry.pic].totalQtyC += entry.qtyC;
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

const chartData = computed(() => {
  const picData = new Map();
  filteredData.value.forEach((entry) => {
    const allPicKeys = Object.keys(entry).filter((key) => key !== "datetime");

    allPicKeys.forEach((pic) => {
      if (!picData.has(pic)) {
        picData.set(pic, {
          label: pic,
          data: [],
          backgroundColor: generateRandomColor(),
          borderColor: generateRandomColor(),
          borderWidth: 2,
          tension: 0.3,
        });
      }

      const productivityPerHour =
        (entry[pic]?.totalQtyA +
          entry[pic]?.totalQtyB +
          entry[pic]?.totalQtyC) /
        60;

      picData.get(pic).data.push(productivityPerHour || 0);
    });
  });

  const finalData = Array.from(picData.values()).map((pic) => ({
    label: pic.label,
    data: filteredTimestamps.value.map((timestamp) => {
      const entry = filteredData.value.find(
        (data) => data.datetime === timestamp
      );
      const qty = entry?.[pic.label] || {
        totalQtyA: 0,
        totalQtyB: 0,
        totalQtyC: 0,
      };
      return (qty.totalQtyA + qty.totalQtyB + qty.totalQtyC) / 60 || 0;
    }),
    backgroundColor: pic.backgroundColor,
    borderColor: pic.borderColor,
    borderWidth: pic.borderWidth,
    tension: pic.tension,
  }));

  return {
    labels: filteredTimestamps.value,
    datasets: finalData,
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
        text: "Productivity (Qty per hour)",
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

const generateRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, ${
    Math.floor(Math.random() * 50) + 50
  }%, ${Math.floor(Math.random() * 40) + 40}%)`;
</script>

<template>
  <div class="h-64">
    <h3 class="text-xl font-medium text-center">
      {{ filterType === "hourly" ? "Hourly" : "Daily" }} Productivity per PIC
    </h3>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
