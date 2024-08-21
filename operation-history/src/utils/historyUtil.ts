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
