<script setup lang="ts">
import Moveable, {BoundType, OnDrag, OnRender} from "vue3-moveable";
import {nextTick, ref} from "vue";
import {
  ActionEnum,
  canRedo,
  canUndo,
  history, init,
  record,
  redoPanel,
  redoStack,
  Snapshot,
  undoPanel
} from "./utils/historyUtil.ts";
import numberUtil from "./utils/numberUtil.ts";
import HistoryLineText from "./history-line-text.vue";

const elementTmp = {label: '矩形', x: 0, y: 0, width: 100, height: 100, rotate: 0};
const elementList = ref<any[]>([elementTmp])
const element = ref(elementList.value[0])
const draggable = true;
const throttleDrag = 1;
const edgeDraggable = false;
const startDragRotate = 0;
const throttleDragRotate = 0;
const resizable = true;
const keepRatio = false;
const throttleResize = 1;
const renderDirections = ["nw", "n", "ne", "w", "e", "sw", "s", "se"];
const snappable = true;
const snapDirections = {"top": true, "left": true, "bottom": true, "right": true};
const verticalGuidelines = [50, 150, 250, 450, 550];
const horizontalGuidelines = [0, 100, 200, 400, 500];
const bounds = {"left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css"} as BoundType;
const rotatable = true;
const throttleRotate = 0;
const rotationPosition = "top";
const targetRef = ref(null);
const moveableRef = ref(null);

const computeElement = {
  init: {
    x: 0, y: 0, width: 0, height: 0, rotate: 0
  },
  x: 0, y: 0, width: 0, height: 0, rotate: 0
}
const dragStart = (e: any) => {
  computeElement.init.x = element.value.x
  computeElement.init.y = element.value.y
};

const drag = (e: any) => {
  computeElement.x = numberUtil.sum(computeElement.init.x, e.translate[0])
  computeElement.y = numberUtil.sum(computeElement.init.y, e.translate[1])
};
const onDragEnd = (e: any) => {
  // element.value.x = computeElement.x
  // element.value.y = computeElement.y
  element.value.x = computeElement.x
  element.value.y = computeElement.y
  record(<Snapshot>{
    type: 'Element',
    action: ActionEnum.MOVE,
    elementList: elementList.value
  });
};
const onResize = (e: any) => {
  computeElement.width = e.width;
  computeElement.height = e.height;
};
const resizeStart = (e: any) => {
  computeElement.init.x = element.value.x
  computeElement.init.y = element.value.y
};
const onResizeEnd = (e: any) => {
  const drag = e.lastEvent.drag as OnDrag;
  
  element.value.width = computeElement.width
  element.value.height = computeElement.height
  
  element.value.x = numberUtil.sum(computeElement.init.x, drag.translate[0]);
  element.value.y = numberUtil.sum(computeElement.init.y, drag.translate[1]);
  
  record(<Snapshot>{
    type: 'Element',
    action: ActionEnum.RESIZE,
    elementList: elementList.value
  });
};

const onRotate = (e: any) => {
  element.value.rotate = (numberUtil.sum(e.rotation % 360, 360)) % 360;
};

const onRotateEnd = (e: any) => {
  record(<Snapshot>{
    type: 'Element',
    action: ActionEnum.ROTATE,
    elementList: elementList.value
  });
};

const onRender = (e: OnRender) => {
  if (e.cssText == '') {
    return;
  }
  e.target.style.cssText += e.cssText;
};

function undoPanelHandle() {
  const value = undoPanel()
  if (value) {
    elementList.value = JSON.parse(JSON.stringify(value));
    element.value = elementList.value[0]
    nextTick(() => {
      moveableRef.value.updateRect()
    })
  }
}

function redoPanelHandle() {
  const value = redoPanel()
  if (value) {
    elementList.value = JSON.parse(JSON.stringify(value));
    element.value = elementList.value[0]
    nextTick(() => {
      moveableRef.value.updateRect()
    })
  }
}

init(elementList.value)
</script>

<template>
  
  <div class="container_wrapper">
    <div class="container">
      <div class="target"
           :style="{
      left: element.x + 'px',
        top: element.y + 'px',
        transform: `translate(0px, 0px) rotate(${element.rotate}deg)`,
        width: element.width + 'px',
        height: element.height + 'px'
         }"
           ref="targetRef"/>
      
      <Moveable
          ref="moveableRef"
          :target="targetRef"
          :draggable="draggable"
          :throttleDrag="throttleDrag"
          :edgeDraggable="edgeDraggable"
          :startDragRotate="startDragRotate"
          :throttleDragRotate="throttleDragRotate"
          :resizable="resizable"
          :keepRatio="keepRatio"
          :throttleResize="throttleResize"
          :renderDirections="renderDirections"
          :rotatable="rotatable"
          :throttleRotate="throttleRotate"
          :rotationPosition="rotationPosition"
          :snappable="snappable"
          :snapDirections="snapDirections"
          :verticalGuidelines="verticalGuidelines"
          :horizontalGuidelines="horizontalGuidelines"
          :bounds="bounds"
          :snapRotationDegrees="[0, 45, 90, 135, 180, 225, 270, 315]"
          @render="onRender"
          @dragStart="dragStart"
          @drag="drag"
          @dragEnd="onDragEnd"
          @resizeStart="resizeStart"
          @resize="onResize"
          @resizeEnd="onResizeEnd"
          @rotate="onRotate"
          @rotateEnd="onRotateEnd"/>
    </div>
    
    <div class="container_history">
      <div style="margin: 5px; text-align: left; font-size: 20px">历史记录</div>
      <div>
        <div class="display-flex">
          <button @mousedown="($event)=>$event.stopPropagation()" @click="undoPanelHandle"
                  :class="[{'my-icon-disabled': !canUndo}]"
                  class="my-icon iconfont icon-undo my-handle-panel-icon">
            撤销
          </button>
          <button @mousedown="($event)=>$event.stopPropagation()" @click="redoPanelHandle"
                  :class="[{'my-icon-disabled': !canRedo}]"
                  style="margin-left: 20px"
                  class="my-icon iconfont icon-redo my-handle-panel-icon">
            重做
          </button>
        </div>
        
        <div class="history-list">
          <div v-for="(item) in redoStack.slice().reverse()" :key="item.timestamp"
               class="history-list-item">
            <history-line-text :content="item.snapshot.action"/>
          </div>
          <history-line-text
              v-for="(item, index) in history"
              :class="[{'currentHistory': index == 0, 'history-list-item': index != 0}]"
              :key="item.timestamp"
              :content="item.snapshot.action"/>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
html,
body {
  position: relative;
  height: 100%;
  margin: 0;
  padding: 0;
}

html:has(.no-relative),
body:has(.no-relative) {
  margin: 8px;
  padding: 8px;
  position: static;
  /* border: 8px solid red; */
}

html:has(.no-relative) {
  position: relative;
}

html:has(.margin),
body:has(.margin) {
  /* margin-top: 50px; */
}

.margin .root {
  position: static;
}

.container_wrapper {
  display: flex;
  margin-top: 200px;
  
}

.container {
  width: 450px;
  height: 450px;
  border: 1px solid black;
  position: relative;
  /*box-shadow: 1px 1px 20px 0px #fff;*/
}

.container_history {
  width: 200px;
  margin-left: 50px;
  border: 1px solid black;
}

.target {
  background: black;
  
  position: absolute;
  width: 100px;
  height: 100px;
  top: 150px;
  left: 100px;
  line-height: 100px;
  text-align: center;
  /*background: gray*/;
  color: #333;
  font-weight: bold;
  border: 1px solid #333;
  box-sizing: border-box;
}

.nested .target {
  top: 50px;
  left: 50px
}

.control-padding .moveable-around-control {
  background: #f55 !important;
}

.cube .cube {
  background: #ddd;
  margin-left: 20px;
}

.history-list {
  font-size: 13px;
  
  .currentHistory {
    color: white;
    padding-left: 3px;
    background: gray;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  
  .history-list-item {
    color: rgb(128, 128, 128);
    padding-left: 3px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  
  .history-line-wrapper {
    display: flex;
    flex: 1;
    
    .prefix {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-left: -3px;
    }
  }
}
</style>
