<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Ota-ona Dashboard</h1>
        <p class="text-gray-600">Farzandlaringiz haqida to'liq ma'lumot</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- Children Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChildCard
          v-for="child in children"
          :key="child._id"
          :child="child"
          @payments="openPayments"
          @attendance="openAttendance"
        />
      </div>
    </div>

    <!-- Dialogs -->
    <PaymentsDialog
      v-model:visible="showPayments"
      :payments="payments"
    />

    <AttendanceDialog
      v-model:visible="showAttendance"
      :attendance="attendance"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import api from '@/utils/api'

import ChildCard from '../components/parent/ChildCard.vue'
import PaymentsDialog from '../components/parent/PaymentsDialog.vue'
import AttendanceDialog from '../components/parent/AttendanceDialog.vue'

const loading = ref(true)
const children = ref([])

const showPayments = ref(false)
const showAttendance = ref(false)

const payments = ref([])
const attendance = ref([])

onMounted(fetchChildren)

async function fetchChildren() {
  try {
    const { data } = await api.get('/parents/children')
    children.value = data
    console.log(children.value);
  } finally {
    loading.value = false
  }
}

async function openPayments(studentId) {
  const { data } = await api.get(`/parents/payments/${studentId}`)
  payments.value = data
  showPayments.value = true
  console.log(payments.value);
}

async function openAttendance(studentId) {
  const { data } = await api.get(`/parents/attendance/${studentId}`)
  attendance.value = data
  showAttendance.value = true
}
</script>