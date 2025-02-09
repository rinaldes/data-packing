<script setup lang="ts">
import { defineProps } from "vue";
import {
  Chart as ChartJS,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(PieController, ArcElement, Title, Tooltip, Legend);

const props = defineProps({
  data: Object,
});

let totalPackA = 0;
let totalPackB = 0;
let totalPackC = 0;

props.data?.forEach((item) => {
  totalPackA +=
    (item["qtyA"] / (item["qtyA"] + item["qtyB"] + item["qtyC"])) * 100;
  totalPackB +=
    (item["qtyB"] / (item["qtyA"] + item["qtyB"] + item["qtyC"])) * 100;
  totalPackC +=
    (item["qtyC"] / (item["qtyA"] + item["qtyB"] + item["qtyC"])) * 100;
});

const chartData = {
  labels: ["Pack A", "Pack B", "Pack C"],
  datasets: [{ data: [totalPackA, totalPackB, totalPackC] }],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="h-64 w-full">
    <h2>Pack Ratio (%)</h2>
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
