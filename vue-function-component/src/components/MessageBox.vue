<script setup lang="ts">
import {ref} from "vue";

interface Message {
  msg: string
}

defineExpose({
  success, clear
});
const messageContentList = ref<Message[]>([]);

function success(msg: string) {
  messageContentList.value.push({msg})
}

function clear() {
  messageContentList.value.length = 0
}

</script>

<template>
  
  <div class="msg_wrapper">
    <div v-for="(item) in messageContentList">
      <div class="msg_body">
        <span class="msg_content">
        {{ item.msg }}
      </span>
      </div>
    
    </div>
  </div>
</template>

<style scoped>
.msg_wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  pointer-events: none;
  text-align: center;
}

.msg_body {
  display: inline-flex;
  padding: 10px 20px;
  margin-top: 5px;
  background: gray;
  border-radius: 5px;
}
</style>
