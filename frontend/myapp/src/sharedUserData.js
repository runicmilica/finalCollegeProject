// useSharedData.js
import { ref } from 'vue';

const sharedData = ref(null);
const classData = ref(null);
const studentData = ref(null);

export function useSharedData() {
  return { sharedData, classData, studentData };
}

