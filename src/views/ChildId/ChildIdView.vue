<template>
  <div class="w-full px-3 sm:px-4 lg:px-6 py-4">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <h1 class="text-xl sm:text-2xl font-bold">
        👧 Farzand ma'lumotlari
      </h1>

      <Button
        label="⬅ Orqaga"
        severity="secondary"
        class="w-full sm:w-auto"
        @click="router.back()"
      />
    </div>

    <!-- Progress -->
    <div class="mb-6">
      <Progress />
    </div>

    <!-- Tabs -->
    <TabView>
      <!-- Payments -->
      <TabPanel header="💰 To‘lovlar">
        <DataTable
          :value="payments"
          :loading="loadingPayments"
          stripedRows
          responsiveLayout="stack"
          breakpoint="768px"
          class="text-sm"
        >
          <Column field="amount" header="Summa">
            <template #body="{ data }">
              <span class="font-semibold text-slate-800">
                {{ formatCurrency(data.amount) }}
              </span>
            </template>
          </Column>

          <Column field="paidAt" header="Sana">
            <template #body="{ data }">
              {{ formatDate(data.paidAt) }}
            </template>
          </Column>
        </DataTable>

        <p
          v-if="!payments.length && !loadingPayments"
          class="text-gray-500 text-sm mt-4 text-center"
        >
          To‘lovlar topilmadi
        </p>
      </TabPanel>

      <!-- Attendance -->
      <TabPanel header="📅 Davomat">
        <DataTable
          :value="attendance"
          :loading="loadingAttendance"
          stripedRows
          responsiveLayout="stack"
          breakpoint="768px"
          class="text-sm"
        >
          <Column field="date" header="Sana">
            <template #body="{ data }">
              {{ formatDate(data.date) }}
            </template>
          </Column>

          <Column field="status" header="Holat">
            <template #body="{ data }">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-semibold',
                  data.status === 'present'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                ]"
              >
                {{ data.status }}
              </span>
            </template>
          </Column>

          <Column field="groupId.name" header="Guruh" />
        </DataTable>

        <p
          v-if="!attendance.length && !loadingAttendance"
          class="text-gray-500 text-sm mt-4 text-center"
        >
          Davomat ma’lumotlari yo‘q
        </p>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/utils/api";

// Components
import Progress from "../../components/Student/ChildProgress/Progress.vue";

// PrimeVue
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const route = useRoute();
const router = useRouter();

const studentId = route.params.id;

// State
const payments = ref([]);
const attendance = ref([]);

const loadingPayments = ref(true);
const loadingAttendance = ref(true);

// Fetch data
onMounted(() => {
  fetchPayments();
  fetchAttendance();
});

const fetchPayments = async () => {
  try {
    const { data } = await api.get(`/parents/payments/${studentId}`);
    payments.value = data || [];
  } catch (err) {
    console.error(err);
  } finally {
    loadingPayments.value = false;
  }
};

const fetchAttendance = async () => {
  try {
    const { data } = await api.get(`/parents/attendance/${studentId}`);
    attendance.value = data || [];
  } catch (err) {
    console.error(err);
  } finally {
    loadingAttendance.value = false;
  }
};

// Helpers
const formatDate = (date) =>
  new Date(date).toLocaleDateString("uz-UZ");

const formatCurrency = (amount) =>
  new Intl.NumberFormat("uz-UZ", { minimumFractionDigits: 0 }).format(amount) +
  " so'm";
</script>

<style scoped>
/* Jadval header */
:deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  font-weight: 600;
  color: #334155;
  border-bottom: 2px solid #e2e8f0;
}

/* Jadval body */
:deep(.p-datatable-tbody > tr > td) {
  border-bottom: 1px solid #f1f5f9;
}

/* Hover */
:deep(.p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

/* Mobile stack label */
:deep(.p-column-title) {
  font-weight: 600;
  color: #475569;
}

/* Tabs */
:deep(.p-tabview-nav) {
  flex-wrap: wrap;
}
</style>
