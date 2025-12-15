<script setup>
import { ref, onMounted, watch } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import api from "@/utils/api.js";

/* Props */
const props = defineProps({
  studentId: {
    type: String,
    required: true,
  },
});

/* State */
const progresses = ref([]);
const loading = ref(false);

/* Fetch */
const fetchProgresses = async () => {
  if (!props.studentId) return;

  loading.value = true;
  try {
    const res = await api.get(`/progress/${props.studentId}`);
    progresses.value = res.data || [];
  } catch (err) {
    console.error("Progresslarni olishda xatolik:", err);
    progresses.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProgresses);
watch(() => props.studentId, fetchProgresses);

</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
    <div class="p-3 sm:p-4">
      <DataTable
        :value="progresses"
        :loading="loading"
        stripedRows
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20]"
        responsiveLayout="stack"
        breakpoint="768px"
        removableSort
        emptyMessage="Ma'lumotlar topilmadi"
        class="text-sm"
      >
        <!-- Sana -->
        <Column field="date" header="📅 Sana" sortable>
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="font-semibold text-slate-800">
                {{ new Date(data.date).toLocaleDateString("uz-UZ") }}
              </span>
              <span class="text-xs text-slate-500">
                {{ new Date(data.date).toLocaleDateString("uz-UZ", { weekday: "short" }) }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Fan -->
       

        <!-- Davomat -->
        <Column field="attendanceRate" header="👥 Davomat" sortable>
          <template #body="{ data }">
            <span class="font-semibold text-slate-800">
              {{ data.attendanceRate }} ball
            </span>
          </template>
        </Column>

        <!-- Baholash -->
        <Column field="teacherFeedback" header="⭐ Baho" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span class="text-yellow-500 text-lg">🪙</span>
              <span class="font-bold text-yellow-700">
                {{ data.teacherFeedback }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Izoh -->
        <Column field="description" header="💬 Izoh">
          <template #body="{ data }">
            <p
              class="text-slate-600 text-sm line-clamp-2"
              :title="data.description"
            >
              {{ data.description || "—" }}
            </p>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
/* Jadval sarlavhasi */
:deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #334155;
  padding: 0.75rem;
}

/* Jadval body */
:deep(.p-datatable-tbody > tr > td) {
  border-bottom: 1px solid #f1f5f9;
  padding: 0.75rem;
}

/* Hover */
:deep(.p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

/* Paginator */
:deep(.p-paginator) {
  border-top: 1px solid #e2e8f0;
  padding: 0.75rem;
}

/* Mobile stack label */
:deep(.p-column-title) {
  font-weight: 600;
  color: #475569;
}

/* Clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Mobil optimizatsiya */
@media (max-width: 768px) {
  :deep(.p-datatable-tbody > tr > td) {
    padding: 0.5rem 0;
  }
}
</style>
