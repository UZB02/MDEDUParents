<template>
  <div class="group relative overflow-hidden rounded-2xl  border-surface-200 bg-gradient-to-br from-white to-surface-50 md:p-6 p-2 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <!-- Header with child name and avatar -->
    <div class="flex items-start gap-4 mb-5">
      <Avatar 
        :label="getInitials(child.name, child.lastname)" 
        size="xlarge" 
        shape="circle"
        class="bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold shadow-lg"
      />
      <div class="flex-1">
        <h3 class="text-xl font-bold text-surface-900 mb-1">
          {{ child.name }} {{ child.lastname }}
        </h3>
        <Tag 
          v-if="child.groups?.group" 
          :value="child.groups.group.name" 
          severity="info"
          class="!bg-primary-100 !text-primary-700 !border-primary-200"
        />
      </div>
    </div>

    <!-- Group information -->
    <div v-if="child.groups" class="space-y-3 mb-6">
      <!-- Schedule days -->
      <div class="flex items-start gap-3">
        <i class="pi pi-calendar text-surface-500 mt-1"></i>
        <div>
          <p class="text-xs font-medium text-surface-500 mb-1">Dars kunlari</p>
          <div class="flex flex-wrap gap-1.5">
            <Tag 
              v-for="day in child.groups.group.days" 
              :key="day"
              :value="day"
              severity="secondary"
              class="!text-xs !px-2 !py-1"
            />
          </div>
        </div>
      </div>

      <!-- Schedule time -->
      <div class="flex items-start gap-3">
        <i class="pi pi-clock text-surface-500 mt-1"></i>
        <div>
          <p class="text-xs font-medium text-surface-500 mb-1">Dars vaqti</p>
          <div class="flex flex-wrap gap-1.5">
            <Tag 
              :value="child.groups.group.startTime"
              severity="secondary"
              class="!text-xs !px-2 !py-1"
            />-<Tag 
              :value="child.groups.group.endTime"
              severity="secondary"
              class="!text-xs !px-2 !py-1"
            />
          </div>
        </div>
      </div>

      <!-- Monthly fee -->
      <div class="flex items-center gap-3">
        <i class="pi pi-wallet text-surface-500"></i>
        <div>
          <p class="text-xs font-medium text-surface-500">Oylik to'lov</p>
          <p class="text-lg font-bold text-surface-900">
            {{ formatCurrency(child.groups.group.monthlyFee) }}
          </p>
        </div>
      </div>

      <!-- Teacher info -->
      <div class="flex items-center gap-3">
        <i class="pi pi-user text-surface-500"></i>
        <div class="w-full">
          <p class="text-xs font-medium text-surface-500">O'qituvchi</p>
          <p class="flex justify-between w-full">
           <span class="text-sm font-semibold text-surface-900">
             {{ child.groups.group.teacher?.name }}
             {{ child.groups.group.teacher?.lastname }}
           </span>
           <span>
             <Tag
               icon="pi pi-phone"
               severity="success"
               value="Bog'lanish"
               class="cursor-pointer"
               @click="callTeacher(child.groups.group.teacher?.phone)"
             />
           </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-3 pt-4 border-t border-surface-200">
      <Button
        label="To'lovlar"
        icon="pi pi-dollar"
        severity="primary"
        class="flex-1"
        @click="$emit('payments', child.id)"
      />
      <Button
        label="Davomat"
        icon="pi pi-calendar-clock"
        severity="secondary"
        outlined
        class="flex-1"
        @click="$emit('attendance', child.id)"
      />
    </div>

    <!-- Decorative gradient overlay -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';

const { child } = defineProps({
  child: {
    type: Object,
    required: true
  }
});

defineEmits(['payments', 'attendance']);

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uz-UZ', {
    minimumFractionDigits: 0
  }).format(amount) + " so'm";
};

// Telefon qilish funksiyasi
const callTeacher = (phone) => {
  if (!phone) {
    alert("Telefon raqam mavjud emas");
    return;
  }
  window.location.href = `tel:${phone}`;
};
</script>

<style scoped>
/* Qo‘shimcha style kerak bo‘lsa shu yerga yoziladi */
</style>
