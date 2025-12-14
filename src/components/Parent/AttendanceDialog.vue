<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Davomat tarixi"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <DataTable
      :value="attendance"
      :paginator="true"
      :rows="10"
      stripedRows
      class="text-sm"
      :pt="{
        header: { class: 'bg-gradient-to-r from-purple-50 to-pink-50' }
      }"
    >
      <Column field="date" header="Sana">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-purple-500 text-xs"></i>
            <span class="font-medium">{{ formatDate(data.date) }}</span>
          </div>
        </template>
      </Column>
      
      <Column field="status" header="Status">
        <template #body="{ data }">
          <Tag
            :value="getAttendanceLabel(data.status)"
            :severity="getAttendanceSeverity(data.status)"
          />
        </template>
      </Column>
      
      <Column field="lesson" header="Dars">
        <template #body="{ data }">
          <span class="text-gray-700">{{ data.lesson?.name || 'N/A' }}</span>
        </template>
      </Column>
      
      <Column field="notes" header="Izoh">
        <template #body="{ data }">
          <span class="text-gray-600 text-xs">{{ data.notes || '-' }}</span>
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
  attendance: Array
})

const emit = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getAttendanceLabel(status) {
  const labels = {
    present: 'Keldi',
    absent: 'Kelmadi',
    late: 'Kechikdi',
    excused: "Uzrli"
  }
  return labels[status] || status
}

function getAttendanceSeverity(status) {
  const severities = {
    present: 'success',
    absent: 'danger',
    late: 'warning',
    excused: 'info'
  }
  return severities[status] || 'info'
}
</script>