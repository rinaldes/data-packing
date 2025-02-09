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

const chartData = computed(() => ({
  labels: props.data?.map((entry) => entry.hour),
  datasets: [
    {
      label: "Reject-to-Weight Ratio (%)",
      data: props.data?.map((entry) => (entry.reject / entry.weight) * 100),
      backgroundColor: "rgba(255, 206, 86, 0.6)",
      borderColor: "rgba(255, 206, 86, 1)",
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
