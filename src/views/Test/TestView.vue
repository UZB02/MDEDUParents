<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p class="text-lg text-gray-600 font-medium">Test yuklanmoqda...</p>
      </div>

      <!-- Not Found State -->
      <div v-else-if="notFound" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Test topilmadi</h2>
        <p class="text-gray-600">Havola noto'g'ri yoki test o'chirilgan bo'lishi mumkin</p>
      </div>

      <!-- Test Content -->
      <div v-else class="space-y-6">
        <!-- Header Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{{ test.title }}</h1>
              <p class="text-gray-600 text-lg mb-4 leading-relaxed">{{ test.description }}</p>
              <div class="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13M0-13C4.168 5.477 5.754 5 7.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>{{ test.subjectId?.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Info Card -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 md:p-8 text-white">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold">O'quvchi ma'lumotlari</h2>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">Ismingiz</label>
              <InputText
                v-model="studentName"
                placeholder="Ismingizni kiriting"
                class="w-full"
                :disabled="submitted"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">Familiyangiz</label>
              <InputText
                v-model="studentSurname"
                placeholder="Familiyangizni kiriting"
                class="w-full"
                :disabled="submitted"
              />
            </div>
          </div>
        </div>

        <!-- Questions -->
        <div class="space-y-5">
          <div
            v-for="(q, idx) in answers"
            :key="q._id"
            class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-gray-100"
          >
            <div class="flex items-start gap-4 mb-5">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">
                {{ idx + 1 }}
              </div>
              <h3 class="text-lg md:text-xl font-semibold text-gray-900 leading-relaxed" v-html="q.question"></h3>
            </div>

            <div class="space-y-3 ml-0 md:ml-14">
              <label
                v-for="(option, i) in q.options"
                :key="i"
                class="flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-indigo-300 hover:bg-indigo-50"
                :class="q.selectedOption === option ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'"
              >
                <input
                  type="radio"
                  :name="'question-' + idx"
                  :value="option"
                  :checked="q.selectedOption === option"
                  @change="answers[idx].selectedOption = option"
                  class="mt-1 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                  :disabled="submitted"
                />
                <span class="flex-1 text-gray-700" v-html="option"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="sticky bottom-4 bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
          <Button
            label="Javoblarni yuborish"
            icon="pi pi-check"
            class="w-full !py-4 !text-lg !font-semibold"
            severity="success"
            @click="submitAnswers"
            :disabled="loadingSubmit || submitted"
            :loading="loadingSubmit"
          />
        </div>
      </div>

      <!-- Result Dialog -->
      <Dialog 
        v-model:visible="showResult" 
        modal 
        :closable="false"
        class="w-full max-w-md mx-4"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">Natijangiz</span>
          </div>
        </template>
        
        <div class="text-center py-6">
          <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span class="text-4xl font-bold text-white">{{ score }}</span>
          </div>
          <p class="text-gray-600 mb-2">Jami ball</p>
          <p class="text-2xl font-bold text-gray-900 mb-8">{{ score }} / {{ answers.length }}</p>
          
          <Button
            label="Testni qayta boshlash"
            icon="pi pi-refresh"
            class="w-full !py-3"
            severity="info"
            @click="resetTest"
          />
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import api from "@/utils/api.js"
import Button from "primevue/button";
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';

const route = useRoute();
const token = route.params.token;

const loading = ref(true);
const notFound = ref(false);
const test = ref(null);

const studentName = ref("");
const studentSurname = ref("");
const answers = ref([]);

const loadingSubmit = ref(false);
const submitted = ref(false);
const showResult = ref(false);
const score = ref(0);

// TESTNI TOKEN ORQALI YUKLASH
const loadTest = async () => {
  try {
    const res = await api.get(`/tests/link/${token}`);
    test.value = res.data;

    // Savollarni tayyorlash
    answers.value = res.data.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      selectedOption: null,
    }));
  } catch (err) {
    notFound.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadTest());

// JAVOBLARNI YUBORISH
const submitAnswers = async () => {
  if (!studentName.value || !studentSurname.value) {
    alert("Ism va familiyani kiriting!");
    return;
  }

  loadingSubmit.value = true;

  try {
    const res = await api.post(`/tests/link/${token}/submit`, {
      studentName: studentName.value,
      studentSurname: studentSurname.value,
      answers: answers.value.map((a) => ({
        questionId: a._id,
        selectedOption: a.selectedOption,
      })),
    });

    score.value = res.data.score;
    submitted.value = true;
    showResult.value = true;
  } catch (err) {
    alert("Xatolik: " + err.response?.data?.message);
  } finally {
    loadingSubmit.value = false;
  }
};

// TESTNI QAYTA BOSHLASH
const resetTest = () => {
  showResult.value = false;
  submitted.value = false;
  studentName.value = "";
  studentSurname.value = "";
  answers.value.forEach((a) => (a.selectedOption = null));
};
</script>