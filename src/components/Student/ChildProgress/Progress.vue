<template>
  <div class="w-full px-3 sm:px-4 lg:px-0">
    <!-- Ortga tugma -->
    <button
      @click="router.back()"
      class="w-full sm:w-auto inline-flex items-center justify-center cursor-pointer
             px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white
             border border-gray-300 rounded-lg hover:bg-gray-50
             transition-colors duration-200"
    >
      <i class="pi pi-arrow-left mr-2"></i>
      Ortga
    </button>

    <!-- Header -->
    <div
      class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700
             rounded-2xl p-4 sm:p-6 mb-6 text-white"
    >
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
          O'quvchi yillik progressi
        </h1>
        <p class="text-blue-100 text-sm sm:text-base lg:text-lg font-medium">
          Davomat va o'qituvchi baholarining tahlili
        </p>
      </div>
    </div>

    <!-- Statistikalar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      <!-- Year selector -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl p-5 border border-slate-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <i class="pi pi-calendar text-blue-600"></i>
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-slate-800">
              Yil tanlash
            </h3>
          </div>
          <Calendar
            v-model="selectedYear"
            view="year"
            dateFormat="yy"
            placeholder="Yilni tanlang"
            class="w-full text-sm sm:text-base"
          />
        </div>
      </div>

      <!-- Cards -->
      <div class="lg:col-span-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
         

          <!-- Active months -->
          <div
            class="bg-white rounded-2xl p-5 border border-slate-200
                   transition-all duration-300 hover:-translate-y-1"
          >
            <p class="text-slate-500 text-sm font-medium mb-1">Faol oylar</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
              {{ activeMonths }}/12
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-10 text-slate-500">
      Ma'lumotlar yuklanmoqda...
    </div>

    <!-- Chart -->
    <div
      v-if="!isLoading && chartData"
      class="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 mb-6"
    >
      <Chart
        type="bar"
        :data="chartData"
        :options="chartOptions"
        class="h-64 sm:h-80 lg:h-96 w-full"
      />
    </div>

    <!-- Progress table -->
    <ProgressTable :studentId="studentId" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/api.js";

import Chart from "primevue/chart";
import Calendar from "primevue/calendar";
import ProgressTable from "./ProgressTable.vue";

const router = useRouter();
const studentId = ref(router.currentRoute.value.params.id);

const selectedYear = ref(new Date());
const monthlyProgress = ref([]);
const isLoading = ref(false);

const loadProgress = async () => {
  isLoading.value = true;
  try {
    const res = await api.get(`/progress/${studentId.value}/yearly`, {
      params: { year: selectedYear.value.getFullYear() },
    });
    monthlyProgress.value = res.data || [];
  } catch (err) {
    console.error("Yillik progressni olishda xatolik:", err);
    monthlyProgress.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(selectedYear, loadProgress, { immediate: true });



const activeMonths = computed(() =>
  monthlyProgress.value.filter(
    (m) => m.totalAttendance > 0 || m.totalFeedback > 0
  ).length
);

const chartData = computed(() => {
  if (!monthlyProgress.value.length) return null;

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  return {
    labels: monthlyProgress.value.map(
      (m) => months[m.month - 1] || `Oy ${m.month}`
    ),
    datasets: [
      {
        label: "Davomat yig'indisi",
        data: monthlyProgress.value.map((m) => m.totalAttendance || 0),
        backgroundColor: "rgba(52, 211, 153, 0.8)",
      },
      {
        label: "O'qituvchi bahosi yig'indisi",
        data: monthlyProgress.value.map((m) => m.totalFeedback || 0),
        backgroundColor: "rgba(251, 191, 36, 0.8)",
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
