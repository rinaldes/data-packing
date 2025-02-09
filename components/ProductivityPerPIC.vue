<script setup lang="ts">
import { defineProps, computed } from "vue";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  data: Array,
});

console.log("ahay");
console.log(props.data);

const chartData = computed(() => ({
  labels: props.data?.map((entry) => entry.pic),
  datasets: [
    {
      label: "Productivity per Hour",
      data: props.data?.map((entry) => entry.qtyPerHour),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
    {
      label: "Productivity per Day",
      data: props.data?.map((entry) => entry.qtyPerDay),
      backgroundColor: "rgba(153, 102, 255, 0.6)",
      borderColor: "rgba(153, 102, 255, 1)",
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
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
