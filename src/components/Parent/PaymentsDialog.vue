<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="To'lov tarixi"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <DataTable
      :value="payments"
      :paginator="true"
      :rows="10"
      stripedRows
      class="text-sm"
      :pt="{
        header: { class: 'bg-gradient-to-r from-blue-50 to-indigo-50' }
      }"
    >
      <Column field="amount" header="Summa">
        <template #body="{ data }">
          <span class="font-semibold text-gray-900">
            {{ formatCurrency(data.amount) }}
          </span>
        </template>
      </Column>
      <Column field="paymentDate" header="To'lov sanasi">
        <template #body="{ data }">
          {{ formatDate(data.paidAt) }}
        </template>
      </Column>
      
      <Column field="status" header="Status">
        <template #body="{ data }">
          <Tag
            :value="getStatusLabel(data.status)"
            :severity="getStatusSeverity(data.status)"
          />
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const props = defineProps({
  visible: Boolean,
  payments: Array
})

const emit = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0
  }).format(amount)
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('uz-UZ')
}

function getStatusLabel(status) {
  const labels = {
    paid: "To'landi",
    pending: 'Kutilmoqda',
    overdue: 'Muddati o\'tgan'
  }
  return labels[status] || status
}

function getStatusSeverity(status) {
  const severities = {
    paid: 'success',
    pending: 'warning',
    overdue: 'danger'
  }
  return severities[status] || 'info'
}
</script>