import { defineStore } from "pinia";
import { ref } from "vue";


export const qItemStore = defineStore("q-todo", () => {
  const items = ref<QTodoModel[]>([])
})