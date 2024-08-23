<script setup lang="ts">
import {ref} from "vue";
import {success, clearMsg} from "./components/install.ts";

const input = ref('MyPrint打印设计器，函数式调用组件实例！')

function showMsg() {
  success(input.value)
}

function clickClearMsg() {
  clearMsg()
}
</script>

<template>
  <input v-model="input" type="text">
  <button @click="showMsg">
    发送
  </button>
  <button @click="clickClearMsg">
    清空
  </button>
</template>

<style scoped>

</style>
