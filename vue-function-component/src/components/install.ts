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
