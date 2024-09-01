# vueuse/core助你一臂之力
> 官方文档：[前往](https://vueuse.org/core/useLocalStorage/)

VueUse 是一个基于 Vue 3 的实用工具库，专门为 Vue 3 应用程序提供一系列经过优化和高度可组合的工具函数。
VueUse 提供了许多实用的组合式 API，
帮助开发者更轻松地管理状态、处理副作用、与 DOM 交互、处理时间和日期等常见任务。

本文将介绍一些常用示例，以及一些有趣的功能


## 代码示例
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint|打印设计|vueuse/core</title>
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
        
        button {
            margin-left: 5px;
            margin-right: 5px;
        }
        
        #app{
            width: 100%;
        }
        body {
            /*display: flex;*/
            height: 100vh;
            /*place-items: center;*/
            width: 100%;
            min-height: 100vh;
            margin: 0 auto;
            text-align: center;
        }
        
        .core_wrapper {
            width: 100%;
            margin-top: 10px;
            display: flex;
            text-align: left;
            border-top: 1px solid gray;
            border-bottom: 1px solid gray;
            padding-top: 10px;
            padding-bottom: 10px;
        
        }
        
        .span-api {
            margin-left: 10px;
            padding-left: 5px;
            padding-right: 5px;
            margin-right: 20px;
            width: 200px;
            background: #333333;
            border-radius: 5px;
        }
        
        .modal {
            position: fixed;
            left: 50%;
            top: 50%;
            background: gray;
            border-radius: 5px;
            
            transform: translate(-50%, -50%);
            width: 420px;
            max-width: 100%;
            z-index: 10;
        }
        
        .inner {
            background-color: var(--vp-c-bg);
            padding: 0.4em 2em;
            border-radius: 5px;
            border: 1px solid var(--vp-c-divider);
            box-shadow: 2px 2px 10px rgba(10, 10, 10, 0.1);
        }
        
        .heading {
            font-weight: bold;
            font-size: 1.4rem;
            margin-bottom: 2rem;
        }
        
        .button {
            position: absolute;
            top: -0.9rem;
            right: -0.5rem;
            font-weight: bold;
        }
        
        .useElementByPoint-control {
            position: fixed;
            background: gray;
            border-radius: 5px;
            padding: 4px 10px;
            right: 100px;
            top: 100px;
            z-index: 998;
        }
        
        .useElementByPoint-box {
            position: fixed;
            pointer-events: none;
            z-index: 999;
            border: 1px #1a1a1a solid;
        }
        
        .useElementByPoint-point {
            position: fixed;
            pointer-events: none;
            z-index: 999;
            border: 1px #1a1a1a solid;
            left: 0;
            top: 0;
            width: 10px;
            height: 10px;
            border-radius: 100px;
            background: green;
        }
        
        .drag {
            top: 300px;
            max-width: 200px;
            position: fixed;
            user-select: none;
            cursor: move;
            background: gray;
            border: 1px solid black;
            border-radius: 10px;
            padding: 4px 10px;
        }
    </style>
    <script src="https://unpkg.com/vue@3"></script>
    <script src="https://unpkg.com/@vueuse/shared"></script>
    <script src="https://unpkg.com/@vueuse/core"></script>

</head>
<body>

<div id="app">
    <div class="core_wrapper">
        <div class="span-api">
            <div>鼠标</div>
            useMouse()
        </div>
        <span>鼠标位置： {{mouseDefault}}</span>
    </div>
    <div class="core_wrapper">
        <div class="span-api">
            <div>广播</div>
            useBroadcastChannel()
        </div>
        <div>
            <span>广播，接收到消息： <span style="color: red">{{receiveData}}</span></span>
            <div>
                发送消息(请打开至少2个页面)
                <form @submit.prevent="postMsg(message)">
                    <input v-model="message" type="text">
                    <button type="submit">
                        发送消息
                    </button>
                </form>
            </div>
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>剪切板</div>
            useClipboard()
        </div>
        <div>
            <div>
                <form @submit.prevent="copy(message)">
                    <input v-model="message" type="text">
                    <button type="submit">
                        复制到剪切板
                    </button>
                </form>
            </div>
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>取色器</div>
            useEyeDropper()
        </div>
        <div>
            <button @click="open">开始取色</button>
            结果：{{sRGBHex}}
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>全屏</div>
            useFullscreen()
        </div>
        <div ref="fullscreenRef">
            这里的内容会被全屏
            <button @click="enterFullscreen">全屏</button>
            <button @click="exitFullscreen">退出全屏</button>
        </div>
    </div>
    <div class="core_wrapper">
        <div class="span-api">
            <div>内存</div>
            useMemory()
        </div>
        <div>
            <div v-if="isSupportedMemory">
                <div v-if="memory" opacity="50">
                    已使用：{{ size(memory.usedJSHeapSize) }}，分配：{{ size(memory.totalJSHeapSize)
                    }}，限制：{{ size(memory.jsHeapSizeLimit) }}
                </div>
                <div v-else>
                    收集中
                </div>
            </div>
            <div v-else>
                您的设备不支持此API
            </div>
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>屏幕锁</div>
            useWakeLock()
        </div>
        <div>
            页面可见的情况下,阻止屏幕锁定 {{wakeLock.isActive ? '阻止中' : '未阻止'}}
            <button @click="clickWakeLock">{{wakeLock.isActive ? 'OFF' : 'ON'}}</button>
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>点击外部</div>
            onClickOutside()
        </div>
        <div>
            <button @click="dialogModal = true">
                Open Modal
            </button>
            <div v-if="dialogModal" ref="modalRef" class="modal">
                <div class="inner">
                    <button class="button small" title="Close" @click="dialogModal = false">
                        𝖷
                    </button>
                    <p class="heading">
                        Demo Modal
                    </p>
                    <p>Click outside of the modal to close it.</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>电池</div>
            useBattery()
        </div>
        <div>
            <div>
                <pre lang="yaml">{{ `电量：${battery.level * 100}%，是否充电：${battery.charging ? '是' : '否'}` }}</pre>
            </div>
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>元素边框</div>
            useElementBounding()
        </div>
        <div>
            点击右上角按钮体验效果
            <div class="useElementByPoint-control" @click="enableElementBounding = !enableElementBounding">
                {{enableElementBounding ? '关闭' : '开启元素边框'}}
            </div>
            <div class="useElementByPoint-box" :style="boxStyles"></div>
            <div class="useElementByPoint-point" :style="pointStyles"></div>
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>fps</div>
            useFps()
        </div>
        <div>
            fps: {{fps}}
        </div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>是否活跃</div>
            useIdle()
        </div>
        <div>{{idledFor < 0 ? '活跃' : `不活跃${idledFor}秒`}}</div>
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>拖动</div>
            useDraggable()
        </div>
        右上角，拖动他！！！
        <div
                ref="dragRef"
                class="drag"
                style="touch-action:none;"
                :style="dragStyle">
            👋👋👋 拖动我! 👋👋👋
            <div class="text-sm opacity-50">
                坐标 ({{ Math.round(dragX) }}, {{ Math.round(dragY) }})
            </div>
        </div>
    
    </div>
    
    <div class="core_wrapper">
        <div class="span-api">
            <div>操作历史记录</div>
            useManualRefHistory()
        </div>
        <div>
            <div>Count: {{ count }}</div>
            <button @click="inc()">
                加
            </button>
            <button @click="dec()">
                减
            </button>
            <span class="ml-2">/</span>
            <button @click="manualRefHistory.commit()">
                记录
            </button>
            <button :disabled="!manualRefHistory.canUndo" @click="manualRefHistory.undo()">
                撤销
            </button>
            <button :disabled="!manualRefHistory.canRedo" @click="manualRefHistory.redo()">
                重做
            </button>
            <br>
            <br>
            <div>历史记录最大容量10个</div>
            <div class="code-block mt-4">
                <div v-for="(i, index) in manualRefHistory.history.value" :key="index">
                    <span class="opacity-50 mr-2 font-mono">{{ formatDateHandle(i.timestamp) }}</span>
                    <span class="font-mono">{ value: {{ i.snapshot }} }</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="core_wrapper" ref="targetRef">
        <div class="span-api">
            <div>视差</div>
            useParallax()
        </div>
        
        <div>
            <pre style="width: 150px; height: 50px;">{{ parallax }}</pre>
            
            <div  :style="targetStyle">
                <div :style="containerStyle">
                    <div :style="cardStyle">
                        <div :style="cardWindowStyle">
                            <img :style="layer0"
                                 src="https://file.myprint.top/common/page2layer0.png"
                                 alt="">
                            <img :style="layer1"
                                 src="https://file.myprint.top/common/page2layer1.png"
                                 alt="">
                            <img :style="layer2"
                                 src="https://file.myprint.top/common/page2layer2.png"
                                 alt="">
                            <img :style="layer3"
                                 src="https://file.myprint.top/common/page2layer3.png"
                                 alt="">
                            <img :style="layer4"
                                 src="https://file.myprint.top/common/page2layer4.png"
                                 alt="">
                        </div>
                    </div>
                </div>
                <div class="note opacity-1">
                    图片来源
                    <a href="https://codepen.io/jaromvogel"
                       target="__blank"
                    >Jarom Vogel</a>
                </div>
            </div>
        
        </div>
    </div>
</div>

</body>
<script>
    const {createApp, ref, reactive, computed} = Vue
    const {
        useBroadcastChannel,
        usePreferredColorScheme,
        useMouse,
        useClipboard,
        useEyeDropper,
        useFullscreen,
        useMemory,
        useWakeLock,
        onClickOutside,
        useBattery,
        useElementBounding,
        useElementByPoint,
        useEventListener,
        useFps,
        useIdle,
        useTimestamp,
        useDraggable,
        useManualRefHistory,
        formatDate,
        useParallax,
        useMediaQuery
    } = VueUse
    
    createApp({
        setup() {
            const message = ref('Hello vue!')
            // console.log(VueUse)
            const mouseDefault = reactive(useMouse())
            // const {x, y, sourceType} = VueUse.useMouse()
            
            const preferredColor = usePreferredColorScheme()
            console.log(preferredColor.value)
            
            // 广播
            const {
                isSupported: isSupportedBroadcastChannel,
                data: receiveData,
                post,
                error,
            } = useBroadcastChannel({name: 'vueuse-demo-channel'});
            
            function postMsg(msg) {
                post(msg)
            }
            
            // 剪贴板
            const {text, copy, copied, isSupported: isSupportedClipboard} = useClipboard()
            
            // 颜色提取
            const {open, sRGBHex} = useEyeDropper()
            
            // 全屏
            const fullscreenRef = ref()
            const {isFullscreen, enter: enterFullscreen, exit: exitFullscreen, toggle} = useFullscreen(fullscreenRef)
            
            // 内存使用情况
            const {isSupported: isSupportedMemory, memory} = useMemory()
            
            function size(v) {
                const kb = v / 1024 / 1024
                return `${kb.toFixed(2)} MB`
            }
            
            // 页面可见的情况下,阻止屏幕锁定
            // const {isActive, forceRequest, request, release} = useWakeLock()
            const wakeLock = reactive(useWakeLock())
            
            function clickWakeLock() {
                return wakeLock.isActive ? wakeLock.release() : wakeLock.request('screen')
            }
            
            // onClickOutside
            const dialogModal = ref(false)
            const modalRef = ref(null)
            
            onClickOutside(
                    modalRef,
                    (event) => {
                        console.log(event)
                        dialogModal.value = false
                    },
            )
            
            const dropdown = ref(false)
            const dropdownHandler = (event) => {
                console.log(event)
                dropdown.value = false
            }
            
            // useBattery
            const battery = reactive(useBattery())
            
            // 获取鼠标所在的元素
            const {x, y} = useMouse({type: 'client'})
            const {element} = useElementByPoint({x, y})
            const enableElementBounding = ref(false)
            const bounding = reactive(useElementBounding(element))
            
            useEventListener('scroll', bounding.update, true)
            const boxStyles = computed(() => {
                if (element.value && enableElementBounding.value) {
                    return {
                        display: 'block',
                        width: `${bounding.width}px`,
                        height: `${bounding.height}px`,
                        left: `${bounding.left}px`,
                        top: `${bounding.top}px`,
                        backgroundColor: '#3eaf7c44',
                        transition: 'all 0.05s linear',
                    }
                }
                return {
                    display: 'none',
                }
            })
            
            const pointStyles = computed(() => {
                if (element.value && enableElementBounding.value) {
                    return {
                        transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
                    }
                }
                return {
                    display: 'none',
                }
            })
            
            const fps = useFps()
            
            const {idle, lastActive} = useIdle(5000)
            const now = useTimestamp({interval: 1000})
            
            const idledFor = computed(() =>
                    Math.floor((now.value - lastActive.value) / 1000))
            
            const dragRef = ref(null)
            
            const {x: dragX, y: dragY, style: dragStyle} = useDraggable(dragRef, {
                initialValue: {x: innerWidth - 300, y: 200},
                preventDefault: true,
                // disabled,
            })
            
            // 历史记录
            const count = ref(0)
            
            function formatDateHandle(ts) {
                return formatDate(new Date(ts), 'YYYY-MM-DD HH:mm:ss')
            }
            
            function inc() {
                count.value++
            }
            
            function dec() {
                count.value--
            }
            
            const manualRefHistory = useManualRefHistory(count, {capacity: 10})
            
            // 不明觉厉
            const targetRef = ref(null)
            const isMobile = useMediaQuery('(max-width: 700px)')
            
            const parallax = reactive(useParallax(targetRef))
            
            const targetStyle = {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '500px',
                transition: '.3s ease-out all',
            }
            const cardWindowStyle = {
                overflow: 'hidden',
                fontSize: '6rem',
                position: 'absolute',
                top: 'calc(50% - 1em)',
                left: 'calc(50% - 1em)',
                height: '2em',
                width: '2em',
                margin: 'auto',
            }
            const layerBase = {
                position: 'absolute',
                height: '100%',
                width: '100%',
                transition: '.3s ease-out all',
            }
            const containerStyle = {
                margin: '3em auto',
                perspective: '300px',
            }
            
            const infoStyle = computed(() => ({
                opacity: 0.4,
                // top: '20px',
                // left: '40px',
                position: inherit,
            }))
            
            const layer0 = computed(() => ({
                ...layerBase,
                transform: `translateX(${parallax.tilt * 10}px) translateY(${
                        parallax.roll * 10
                }px) scale(1.33)`,
            }))
            
            const layer1 = computed(() => ({
                ...layerBase,
                transform: `translateX(${parallax.tilt * 20}px) translateY(${
                        parallax.roll * 20
                }px) scale(1.33)`,
            }))
            
            const layer2 = computed(() => ({
                ...layerBase,
                transform: `translateX(${parallax.tilt * 30}px) translateY(${
                        parallax.roll * 30
                }px) scale(1.33)`,
            }))
            
            const layer3 = computed(() => ({
                ...layerBase,
                transform: `translateX(${parallax.tilt * 40}px) translateY(${
                        parallax.roll * 40
                }px) scale(1.33)`,
            }))
            
            const layer4 = layerBase
            
            const cardStyle = computed(() => ({
                background: '#fff',
                height: '20rem',
                width: '15rem',
                borderRadius: '5px',
                border: '1px solid #cdcdcd',
                overflow: 'hidden',
                transition: '.3s ease-out all',
                boxShadow: '0 0 20px 0 rgba(255, 255, 255, 0.25)',
                transform: `rotateX(${parallax.roll * 20}deg) rotateY(${
                        parallax.tilt * 20
                }deg)`,
            }))
            
            return {
                size,
                sRGBHex,
                open,
                copy,
                fullscreenRef,
                enterFullscreen,
                exitFullscreen,
                isSupportedMemory,
                memory,
                wakeLock,
                clickWakeLock,
                modalRef,
                dialogModal,
                dropdown,
                battery,
                boxStyles,
                pointStyles,
                enableElementBounding,
                fps,
                idle,
                idledFor,
                dragRef,
                dragX,
                dragY,
                dragStyle,
                inc,
                dec,
                manualRefHistory,
                count,
                formatDateHandle,
                message,
                postMsg,
                receiveData,
                mouseDefault,
                
                targetRef,
                targetStyle,
                cardWindowStyle,
                containerStyle,
                infoStyle,
                layer0,
                layer1,
                layer2,
                layer3,
                layer4,
                cardStyle,
                parallax
            }
        }
    }).mount('#app')
</script>

</html>

```

## 代码仓库

> [在线体验](https://codepen.io/chushenshen/pen/ExBENpq)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint-blogs/tree/main/vueuse-core)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint-blogs/tree/main/vueuse-core)

## 实战项目：MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器
>
> 体验地址：[前往](https://demo.myprint.top)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint)
