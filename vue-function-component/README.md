vue中，通常情况下调用一个组件需要以下步骤

* 导入组件
* 在`template`引入组件，并且设置`ref`属性
* 在js模块定义对应的`ref`属性
* 通过`ref`对象调用对应的方法

如果这个组件在`template`是不必要的，那么可以通过函数式调用组件，
来省略在`template`标签中引入组件，来简化调用步骤，做到可以通过纯js调用组件

这种方法也有一定的缺陷，因为在初始化的时候就已经确定了组件的DOM所在的层级，所以无法灵活的控制DOM元素的层级，
所有一般在`Message`这种不关心组件DOM层级的组件中使用，以下是使用示例，`结尾有实战项目中的使用示例`

## 组件代码

```vue
<!--MessageBox.vue-->
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

```

## 渲染安装组件

```ts
// install.ts
import {App, h, render, VNode} from 'vue';
import MessageBox from './MessageBox.vue';


let messageBoxNode: VNode = null!;
let successMsgHandle: (msg: string) => void;
let clearHandle: () => void;

export function mountMessageBox(app: App<any>) {
    if (!messageBoxNode) {
        messageBoxNode = h(MessageBox, {});
        const container = document.createElement('div');
        messageBoxNode.appContext = app._context;

        render(messageBoxNode, container);

        successMsgHandle = messageBoxNode.component!.exposed!.success;
        clearHandle = messageBoxNode.component!.exposed!.clear;

        document.body.appendChild(container.firstElementChild!);
    }
}

export function success(msg: string) {
    successMsgHandle(msg)
}

export function clearMsg() {
    clearHandle()
}

```

## 使用

1、main.js中安装

```ts
// main.js
import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {mountMessageBox} from "./components/install.ts";

const app = createApp(App);
mountMessageBox(app)
app.mount('#app')

```

2、代码中使用

```vue

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

```
