# MyPrint打印设计器（三）设置整个条码宽度,让条形码填充整个div

> 让条形码填充整个div

## 所需环境：

- 浏览器
- js

## 实现目标

- 设置整个元素的宽度，让条形码自适应填充整个宽度

JsBarcode 设置只支持设置每个条之间的宽度，并不支持设置整个条码的宽度，所以无法让条形码填充整个元素的宽度
如果想要设置整个条码的宽度，这个时候就需要手动通过条码的数值，
自动计算每个条之间的宽度,算法如下，根据每种条形码类型的不同逻辑，特殊处理

```js
try {
    const width = 200 // 更改宽度
    const height = 100
    const barCodeDisplayValIs = 1
    const fontSize = 13
    const barCodeType = 'CODE128'
    const data = 'Myprint-Barcode'
    const codeLength = data.length;
    let numBars;
    
    // 根据不同的条形码类型设置条数
    switch (barCodeType) {
        case 'EAN2':
            numBars = 20;
            break;
        case 'EAN5':
            numBars = 47;
            break;
        case 'EAN8':
            numBars = 67;
            break;
        case 'EAN13':
        case 'UPC':
            numBars = 95;
            break;
        case 'UPC_E':
            numBars = 57;
            break;
        case 'ITF':
            numBars = codeLength * 3;
            break;
        case 'ITF14':
            numBars = 94;
            break;
        case 'CODE39':
        case 'codabar':
            numBars = codeLength * 12;
            break;
        case 'CODE128':
        case 'CODE128A':
        case 'CODE128B':
        case 'CODE128C':
            numBars = codeLength * 11;
            break;
        case 'pharmacode':
            numBars = codeLength * 10;
            break;
        case 'MSI':
        case 'MSI10':
        case 'MSI11':
        case 'MSI1010':
        case 'MSI1110':
            numBars = codeLength * 2.5;
            break;
        default:
            numBars = codeLength * 7;  // 默认设置
    }
    
    const barWidth = width / numBars;
    
    JsBarcode('#code128', data, {
        format: barCodeType,//选择要使用的条形码类型
        width: barWidth, //设置条之间的宽度
        height: height - (barCodeDisplayValIs ? fontSize : 0),//高度
        displayValue: barCodeDisplayValIs,//是否在条形码下方显示文字
        //   text:"456",//覆盖显示的文本
        //   fontOptions:"bold italic",//使文字加粗体或变斜体
        //   font:"fantasy",//设置文本的字体
        //   textAlign:"left",//设置文本的水平对齐方式
        //   textPosition:"top",//设置文本的垂直位置
        textMargin: 0,//设置条形码和文本之间的间距
        fontSize: fontSize,//设置文本的大小
        background: 'white',//设置条形码的背景
        lineColor: 'black',//设置条和文本的颜色。
        margin: 0//设置条形码周围的空白边距
    });

} catch (e) {
    console.log('不支持的内容')
}

```


## 代码仓库

> [在线体验](https://codepen.io/chushenshen/pen/PorevWq)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint-blogs/tree/main/barcode-width)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint-blogs/tree/main/barcode-width)

## 实战项目：MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器
>
> 体验地址：[前往](https://demo.cfcss.top)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint)
