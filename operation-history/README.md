今天分享如何通过vue快速实现操作历史记录

## 所需环境：

- vue

## 实现目标

- 历史记录
- 撤销
- 重做
- 记录覆盖

## 代码原理

把键盘监听事件挂载在document上，当键盘事件发生时，依次匹配事先订阅的快捷键/单按键事件，
如果有匹配到对应的订阅，则进行事件回调，并且停止键盘事件的回调。按下的按键进行转换，把`mac`/`win`的键盘差异进行了兼容

## 实现效果

差两个视频

## 核心代码

```ts
import {ref} from 'vue';
import {useManualRefHistory} from '@vueuse/core';

export enum ActionEnum {
    INIT = '加载',
    ADD = '添加<{element}>',
    RESIZE = '修改<{element}>尺寸',
    ROTATE = '旋转<{element}>',
    REMOVE = '删除<{element}>',
    PASTE = '粘贴<{element}>',
    CUT = '剪切<{element}>',
    CLEAR = '清空面板',
    MOVE = '移动<{element}>',
    BATCH_MOVE = '移动<多个元素>',
    UPDATE_STYLE = '修改<{element}>的[{content}]',
    BATCH_UPDATE_STYLE = '修改<多个元素>的[{content}]',
}

let max = 50;

export interface Snapshot {
    elementList?: any[]
    content?: string
    action: ActionEnum,
    type?: 'Element' | 'PANEL'
}

const historyRecord = ref<Snapshot>({} as Snapshot);
const {
    undoStack,
    redoStack,
    commit,
    history,
    undo,
    redo,
    clear,
    canUndo,
    canRedo
} = useManualRefHistory(historyRecord, {capacity: max});

/**
 * 初始化记录
 * @param elementList
 */
function init(elementList: any[]) {
    record(<Snapshot>{
        type: 'PANEL',
        action: ActionEnum.INIT,
        elementList
    });
    clear();
}

/**
 * 记录历史操作
 * @param snapshot
 */
function record(snapshot: Snapshot) {
    let action = snapshot.action as any;
    let label = '';
    if (snapshot.elementList) {
        for (let myElement of snapshot.elementList) {
            label = label + myElement.label + ',';
        }
        label = label.slice(0, -1)
    } else {
        label = '面板';
    }

    if (action == ActionEnum.UPDATE_STYLE) {
        if (snapshot.elementList != null) {
            action = action.replace('{element}', label).replace('{content}', snapshot.content);
        } else {
            action = action.replace('{element}', label).replace('{content}', snapshot.content);
        }
    } else if ([ActionEnum.REMOVE, ActionEnum.ADD, ActionEnum.RESIZE, ActionEnum.ROTATE, ActionEnum.MOVE].includes(action)) {
        action = action.replace('{element}', label);
    }

    snapshot.action = action;

    // 记录历史
    historyRecord.value = JSON.parse(JSON.stringify(snapshot));
    commit();
}

/**
 * 撤销
 */
function undoPanel() {
    if (!canUndo.value) {
        return;
    }
    undo();
    return historyRecord.value.elementList;
}

/**
 * 重做
 */
function redoPanel() {
    if (!canRedo.value) {
        return;
    }
    redo();
    return historyRecord.value.elementList;
}

export {
    init,
    record,
    canUndo,
    canRedo,
    undoStack,
    redoStack,
    undoPanel,
    redoPanel,
    redo,
    history,
    clear
};
```

## 使用示例

```ts

const elementList = ref<any[]>([{}])

// 记录日志
record(<Snapshot>{
  type: 'Element',
  action: ActionEnum.RESIZE,
  elementList: elementList.value
  });

// 撤销
elementList.value = JSON.parse(JSON.stringify(undoPanel()));

// 重做
elementList.value = JSON.parse(JSON.stringify(redoPanel()));
```

## 代码仓库

> [在线体验](https://codepen.io/chushenshen/pen/poXaYdo)
>
> 代码仓库：[github]('')
>
> 代码仓库：[gitee]('')

## 实战项目：MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器
>
> 体验地址：[前往]('https://demo.myprint.top')
>
> 代码仓库：[github]('')
>
> 代码仓库：[gitee]('')
