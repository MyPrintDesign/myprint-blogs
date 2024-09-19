今天分享如何快速实现js快捷键监听

## 所需环境：

- 浏览器
- js

## 实现目标

- mac/win兼容，一套代码，多个平台
- 支持快捷键监听/单按键监听
- 事件是否冒泡可设置
- 使用方式简单
- 快速挂载与卸载
- 4行代码实现组合键监听

## 代码原理

把键盘监听事件挂载在document上，当键盘事件发生时，依次匹配事先订阅的快捷键/单按键事件，
如果有匹配到对应的订阅，则进行事件回调，并且停止键盘事件的回调。按下的按键进行转换，把`mac`/`win`的键盘差异进行了兼容

## 实现效果
<img src="https://i-blog.csdnimg.cn/direct/fb6728f9982f45d2a30cba37cf90c800.gif"/>

## 核心代码

```ts
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

```

## 使用示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint-快捷键示例</title>
    <style>
        :root {
            font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            font-weight: 400;
            
            color-scheme: light dark;
            color: rgba(255, 255, 255, 0.87);
            background-color: #242424;
            
            font-synthesis: none;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        body {
            display: flex;
            height: 100vh;
            place-items: center;
            width: 100%;
            min-height: 100vh;
            margin: 0 auto;
            text-align: center;
        }
        
        #keyboardShortcutsStr {
            width: 100%;
        }
    </style>
</head>
<body>
<div id="keyboardShortcutsStr"></div>
<script>
    function setKeyboardShortcutsStr(keyboardShortcutsStr) {
        document.querySelector("#keyboardShortcutsStr").innerHTML = keyboardShortcutsStr
    }
    
    var keyConvert = {
        Ctrl: ['Meta', 'Ctrl']
    };
    var eventListeners = [];
    var downKeyList = {};
    
    function addKeyboardEvent() {
        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);
        var handlers = {
            subscribe: function (keys, callback, stop) {
                if (stop === void 0) {
                    stop = true;
                }
                eventListeners.push({
                    keys: keys,
                    matchType: 'ALL',
                    callback: callback,
                    stop: stop
                });
                return handlers;
            },
            subscribeAny: function (keys, callback, stop) {
                if (stop === void 0) {
                    stop = true;
                }
                eventListeners.push({
                    keys: keys,
                    matchType: 'ANY',
                    callback: callback,
                    stop: stop
                });
                return handlers;
            }
        };
        return handlers;
    }
    
    function removeKeyboardEvent() {
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    }
    
    function keyUp(event) {
        delete downKeyList[convertKey(event.key)];
    }
    
    function convertKey(key) {
        for (var keyConvertKey in keyConvert) {
            var convertList = keyConvert[keyConvertKey];
            if (convertList.includes(key)) {
                return keyConvertKey;
            }
        }
        return key;
    }
    
    function keyDown(event) {
        // 如果需要输入框，则不监听组合键
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            // console.log('This event is triggered by an input or textarea!');
            return;
        }
        for (var _i = 0, eventListeners_1 = eventListeners; _i < eventListeners_1.length; _i++) {
            var eventListener = eventListeners_1[_i];
            var matchResult = false;
            if (eventListener.matchType == 'ALL') {
                matchResult = matchAll(event, eventListener);
            } else {
                matchResult = matchAny(event, eventListener);
            }
            if (matchResult) {
                break;
            }
        }
    }
    
    function matchAll(event, keyListener) {
        var keys = keyListener.keys, callback = keyListener.callback, stop = keyListener.stop;
        var isTrigger = true;
        var keyStr = '';
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (key instanceof Function) {
                keyStr = keyStr + key.name + "+";
                if (!key(event)) {
                    isTrigger = false;
                    break;
                }
            } else {
                keyStr = keyStr + event.key + "+";
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
        return false;
    }
    
    function matchAny(event, keyListener) {
        var keys = keyListener.keys, callback = keyListener.callback, stop = keyListener.stop;
        var isTrigger = false;
        var keyStr = '';
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            if (key instanceof Function) {
                if (key(event)) {
                    keyStr = keyStr + key.name + "+";
                    isTrigger = true;
                }
            } else {
                if (key == event.key) {
                    keyStr = keyStr + event.key + "+";
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
                return true;
            }
        }
        return false;
    }
    
    // 兼容macos & win
    function isCtrl(event) {
        return event.ctrlKey || event.metaKey;
    }
    
    function isShift(event) {
        return event.shiftKey;
    }
    
    function isCtrlShift(event) {
        return (event.ctrlKey || event.metaKey) && event.shiftKey;
    }
    
    function isDelete(event) {
        return event.key == 'Backspace';
    }
    
    
    addKeyboardEvent()
            // macos
            .subscribe([isCtrlShift, 'z'], (_keyStr) => {
                setKeyboardShortcutsStr('Ctrl+Shift+z 重做')
            })
            // win
            .subscribe([isCtrlShift, 'y'], () => {
                setKeyboardShortcutsStr('Ctrl+y')
            })
            .subscribe([isCtrl, 'z'], () => {
                setKeyboardShortcutsStr('Ctrl+z 撤销')
            })
            .subscribe([isCtrl, 'a'], () => {
                setKeyboardShortcutsStr('Ctrl+a 全选')
            })
            .subscribe([isCtrl, 'c'], () => {
                setKeyboardShortcutsStr('Ctrl+c 复制')
            })
            .subscribe([isCtrl, 'x'], () => {
                setKeyboardShortcutsStr('Ctrl+c 剪切')
            })
            .subscribe([isCtrl, 'v'], () => {
                setKeyboardShortcutsStr('Ctrl+v 粘贴')
            })
            .subscribe([isCtrl, 'd'], () => {
                setKeyboardShortcutsStr('Ctrl+d 副本')
            })
            .subscribe([isCtrl, 's'], () => {
                setKeyboardShortcutsStr('Ctrl+s 保存')
            })
            .subscribe([isCtrl, 'f'], () => {
                setKeyboardShortcutsStr('Ctrl+f 搜索')
            })
            .subscribe(['Tab'], () => {
                setKeyboardShortcutsStr('Tab切换')
            })
            
            .subscribe([isCtrlShift, 'ArrowUp'], () => {
                // console.log('ArrowUp')
            })
            .subscribe([isCtrlShift, 'ArrowDown'], () => {
                // console.log('ArrowDown')
            })
            .subscribe([isCtrlShift, 'ArrowLeft'], () => {
                // console.log('ArrowLeft')
            })
            .subscribe([isCtrlShift, 'ArrowRight'], () => {
                // console.log('ArrowRight')
            })
            
            .subscribe([isShift, 'ArrowUp'], () => {
                // console.log('ArrowUp')
            })
            .subscribe([isShift, 'ArrowDown'], () => {
            })
            .subscribe([isShift, 'ArrowLeft'], () => {
            })
            .subscribe([isShift, 'ArrowRight'], () => {
            })
            
            .subscribe([isCtrl, 'ArrowUp'], () => {
            })
            .subscribe([isCtrl, 'ArrowDown'], () => {
            })
            .subscribe([isCtrl, 'ArrowLeft'], () => {
            })
            .subscribe([isCtrl, 'ArrowRight'], () => {
            })
            
            .subscribe(['ArrowUp'], () => {
            })
            .subscribe(['ArrowDown'], () => {
            })
            .subscribe(['ArrowLeft'], () => {
            })
            .subscribe(['ArrowRight'], () => {
            })
            
            .subscribe([isDelete], () => {
                // console.log('ArrowRight')
            })
            .subscribeAny(['q', 'w', 'e', 'r', 't', 'a', 'b', 'c', 'd'], (keyStr) => {
                // console.log('ArrowRight')
                setKeyboardShortcutsStr(keyStr)
            }, false);
</script>
</body>
</html>

```

## 代码仓库

> [在线体验](https://codepen.io/chushenshen/pen/poXaYdo)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint-blogs/tree/main/keyboard-shortcuts)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint-blogs/tree/main/keyboard-shortcuts)

## 实战项目：MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器
>
> 体验地址：[前往](https://demo.cfcss.top)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint)
