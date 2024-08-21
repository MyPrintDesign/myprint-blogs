interface keyListener {
    keys: Array<string | ((event: KeyboardEvent) => boolean)>;
    // ALL 全部符合才算| ANY 匹配到任意一个就算
    matchType: 'ALL' | 'ANY';
    callback: (keyStr: string) => void;
    // 是否停止时间传播
    stop: boolean;
}

// 多平台键盘转换
const keyConvert = {
    Ctrl: ['Meta', 'Ctrl']
} as Record<string, Array<string>>;

const eventListeners: Array<keyListener> = [];
const downKeyList = {} as any;

export function addKeyboardEvent() {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    const handlers = {
        subscribe(keys: Array<string | ((event: KeyboardEvent) => boolean)>, callback: (keyStr: string) => void, stop = true) {
            eventListeners.push({
                keys,
                matchType: 'ALL',
                callback,
                stop
            });
            return handlers;
        },
        subscribeAny(keys: Array<string | ((event: KeyboardEvent) => boolean)>, callback: (keyStr: string) => void, stop = true) {
            eventListeners.push({
                keys,
                matchType: 'ANY',
                callback,
                stop
            });
            return handlers;
        }
    };
    return handlers;
}

export function removeKeyboardEvent() {
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
}

function keyUp(event: KeyboardEvent) {
    delete downKeyList[convertKey(event.key)];
}

function convertKey(key: string) {
    for (let keyConvertKey in keyConvert) {
        let convertList = keyConvert[keyConvertKey];
        if (convertList.includes(key)) {
            return keyConvertKey;
        }
    }
    return key;
}

function keyDown(event: KeyboardEvent) {
    // 如果需要输入框，则不监听组合键
    if ((event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'TEXTAREA') {
        // console.log('This event is triggered by an input or textarea!');
        return;
    }

    for (let eventListener of eventListeners) {
        let matchResult = false
        if (eventListener.matchType == 'ALL') {
            matchResult = matchAll(event, eventListener)
        } else {
            matchResult = matchAny(event, eventListener)
        }
        if (matchResult) {
            break
        }
    }
}

function matchAll(event: KeyboardEvent, keyListener: keyListener) {
    const {keys, callback, stop} = keyListener;
    let isTrigger = true;
    let keyStr = ''
    for (let key of keys) {
        if (key instanceof Function) {
            keyStr = keyStr + key.name + "+"
            if (!key(event)) {
                isTrigger = false;
                break;
            }
        } else {
            keyStr = keyStr + event.key + "+"

            if (key != event.key) {
                isTrigger = false;
                break;
            }
        }
    }
    if (isTrigger) {
        keyStr = keyStr.slice(0, -1);
        callback(keyStr);
        if (stop) {
            event.preventDefault();
            event.stopPropagation();
        }
        return true;
    }
    return false
}

function matchAny(event: KeyboardEvent, keyListener: keyListener) {
    const {keys, callback, stop} = keyListener;
    let isTrigger = false;
    let keyStr = ''
    for (let key of keys) {
        if (key instanceof Function) {
            if (key(event)) {
                keyStr = keyStr + key.name + "+"
                isTrigger = true;
            }
        } else {
            if (key == event.key) {
                keyStr = keyStr + event.key + "+"
                isTrigger = true;
            }
        }

        if (isTrigger) {
            keyStr = keyStr.slice(0, -1);
            callback(keyStr);
            if (stop) {
                event.preventDefault();
                event.stopPropagation();
            }
            return true
        }
    }
    return false
}

// 兼容macos & win
export function isCtrl(event: KeyboardEvent) {
    return event.ctrlKey || event.metaKey;
}

export function isShift(event: KeyboardEvent) {
    return event.shiftKey;
}

export function isCtrlShift(event: KeyboardEvent) {
    return (event.ctrlKey || event.metaKey) && event.shiftKey;
}

export function isDelete(event: KeyboardEvent) {
    return event.key == 'Backspace';
}
