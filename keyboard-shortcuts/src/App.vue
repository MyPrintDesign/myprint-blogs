<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import {addKeyboardEvent, isCtrl, isCtrlShift, isDelete, isShift, removeKeyboardEvent} from "./utils/keyboardUtil.ts";

const keyboardShortcutsStr = ref('')
onMounted(() => {
  addKeyboardEvent()
      // macos
      .subscribe([isCtrlShift, 'z'], (_keyStr) => {
        keyboardShortcutsStr.value = 'Ctrl+Shift+z 重做'
      })
      // win
      .subscribe([isCtrlShift, 'y'], () => {
        keyboardShortcutsStr.value = 'Ctrl+y'
      })
      .subscribe([isCtrl, 'z'], () => {
        keyboardShortcutsStr.value = 'Ctrl+z 撤销'
      })
      .subscribe([isCtrl, 'a'], () => {
        keyboardShortcutsStr.value = 'Ctrl+a 全选'
      })
      .subscribe([isCtrl, 'c'], () => {
        keyboardShortcutsStr.value = 'Ctrl+c 复制'
      })
      .subscribe([isCtrl, 'x'], () => {
        keyboardShortcutsStr.value = 'Ctrl+c 剪切'
      })
      .subscribe([isCtrl, 'v'], () => {
        keyboardShortcutsStr.value = 'Ctrl+v 粘贴'
      })
      .subscribe([isCtrl, 'd'], () => {
        keyboardShortcutsStr.value = 'Ctrl+d 副本'
      })
      .subscribe([isCtrl, 's'], () => {
        keyboardShortcutsStr.value = 'Ctrl+s 保存'
      })
      .subscribe([isCtrl, 'f'], () => {
        keyboardShortcutsStr.value = 'Ctrl+f 搜索'
      })
      .subscribe(['Tab'], () => {
        keyboardShortcutsStr.value = 'Tab切换'
      })
      
      .subscribe([isCtrlShift, 'ArrowUp'], () => {
        // console.log('ArrowUp')
        keyboardShortcutsStr.value = 'Ctrl+Shift+方向上'
      })
      .subscribe([isCtrlShift, 'ArrowDown'], () => {
        keyboardShortcutsStr.value = 'Ctrl+Shift+方向下'
        // console.log('ArrowDown')
      })
      .subscribe([isCtrlShift, 'ArrowLeft'], () => {
        keyboardShortcutsStr.value = 'Ctrl+Shift+方向左'
        // console.log('ArrowLeft')
      })
      .subscribe([isCtrlShift, 'ArrowRight'], () => {
        keyboardShortcutsStr.value = 'Ctrl+Shift+方向右'
        // console.log('ArrowRight')
      })
      
      .subscribe([isShift, 'ArrowUp'], () => {
        keyboardShortcutsStr.value = 'Shift+方向上'
        // console.log('ArrowUp')
      })
      .subscribe([isShift, 'ArrowDown'], () => {
        keyboardShortcutsStr.value = 'Shift+方向下'
      })
      .subscribe([isShift, 'ArrowLeft'], () => {
        keyboardShortcutsStr.value = 'Shift+方向左'
      })
      .subscribe([isShift, 'ArrowRight'], () => {
        keyboardShortcutsStr.value = 'Shift+方向右'
      })
      
      .subscribe([isCtrl, 'ArrowUp'], () => {
        keyboardShortcutsStr.value = 'Ctrl+方向上'
      })
      .subscribe([isCtrl, 'ArrowDown'], () => {
        keyboardShortcutsStr.value = 'Ctrl+方向下'
      })
      .subscribe([isCtrl, 'ArrowLeft'], () => {
        keyboardShortcutsStr.value = 'Ctrl+方向左'
      })
      .subscribe([isCtrl, 'ArrowRight'], () => {
        keyboardShortcutsStr.value = 'Ctrl+方向右'
      })
      
      .subscribe(['ArrowUp'], () => {
        keyboardShortcutsStr.value = '方向上'
      })
      .subscribe(['ArrowDown'], () => {
        keyboardShortcutsStr.value = '方向下'
      })
      .subscribe(['ArrowLeft'], () => {
        keyboardShortcutsStr.value = '方向左'
      })
      .subscribe(['ArrowRight'], () => {
        keyboardShortcutsStr.value = '方向右'
      })
      
      .subscribe([isDelete], () => {
        // console.log('ArrowRight')
      })
      .subscribeAny([
          '1','2','3','4','5','6',
          'q', 'w', 'e', 'r', 't','y','u',
        'a', 'b', 'c', 'd','f','g','h','j',
        'z', 'x', 'c', 'v', 'b', 'n'], (keyStr) => {
        // console.log('ArrowRight')
        keyboardShortcutsStr.value = keyStr
      }, false);
})

onUnmounted(() => {
  removeKeyboardEvent()
})
</script>

<template>
  <div style="font-size: 50px">
    {{ keyboardShortcutsStr }}
  </div>
</template>
