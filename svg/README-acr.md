# svg-圆

介绍一款强大的svg操作库，能够通过简单的代码，实现svg绘制与操纵，实现拖拽等功能

本文将通过一个简单的示例，介绍如何在SVG中绘制一条可拖拽的圆

## 正文
### 基础HTML结构
首先，我们需要在HTML中设置基本的SVG元素，以便绘制图形。
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint|打印设计|SVG|圆</title>
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
    <script src="./d3-utils.js"></script>
    <style>
        body {
            width: 100vw;
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .chart {
            width: 100%;
            height: 100%;
            overflow: visible;
        }
        
        .chart_wrapper {
            width: 700px;
            height: 700px;
            box-shadow: 2px 2px 10px rgba(10, 10, 10, 0.1);
            border-radius: 10px;
        }
    </style>
</head>
<body>
<div class="chart_wrapper">
    <svg id="chartRef" class="chart">
        <path class="u-path" :d="path"/>
        <line class="u-line"/>
        <line class="u-line"/>
    </svg>
</div>
</body>
</html>
```

### 初始化图形
我们定义了一个freshSvg函数来初始化SVG图形。这个函数定义了一些基本的变量，如圆心坐标、半径、起始角度和结束角度等。
```js
function freshSvg() {
    const x0 = 310,
        y0 = 130,
        x = 320,
        y = 320,
        radius = 100,
        startAngle = 0,
        endAngle = 2 * Math.PI - 1,
        moveto00 = false,
        anticlockwise = true;

    // ...
}
```
### 绘制圆弧
接下来，我们定义了一个draw函数，用于绘制圆弧。我们使用D3.js的path.arc方法，根据圆心、半径、起始角度和结束角度绘制圆弧。
const path = d3.path();
path.arc(x, y, radius, startAngle, endAngle, anticlockwise);

### 实现拖拽功能
我们实现了一个draggable函数，用于为圆弧图形添加拖拽功能。这个函数允许用户通过拖动控制点来动态调整圆弧的大小和位置。
```js
function draggable(chart, points, labels, lines, draw, options) {
    // 实现拖拽逻辑
    update(chart, points, labels, lines, draw, options);

    d3.select(chart)
        .call(
            d3.drag()
                .on("start", event => { /* 处理拖拽开始 */ })
                .on("drag", event => { /* 处理拖拽进行中 */ })
                .on("end", () => { /* 处理拖拽结束 */ })
                .on("start.render drag.render end.render", () =>
                    update(chart, points, labels, lines, draw, options)
                )
        );
}
```
### 更新图形
最后，我们定义了一个update函数，用于在拖拽过程中更新图形的显示。这确保了当用户拖动控制点时，SVG图形会实时更新并反映变化。
```js
function update(chart, points, labels, lines, draw, options) {
// 更新图形显示
}
```


## 完整实现
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint|打印设计|SVG|圆</title>
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
    <script src="./d3-utils.js"></script>
    <style>
        body {
            width: 100vw;
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .chart {
            width: 100%;
            height: 100%;
            overflow: visible;
        }
        
        .chart_wrapper {
            width: 700px;
            height: 700px;
            box-shadow: 2px 2px 10px rgba(10, 10, 10, 0.1);
            border-radius: 10px;
        }
    </style>
</head>

<body>
<div class="chart_wrapper">
    <svg id="chartRef" class="chart">
        <path class="u-path" :d="path"/>
        <line class="u-line"/>
        <line class="u-line"/>
    </svg>
</div>
</body>

<script>
    const chartElement = document.getElementById('chartRef')
    const path = d3.path();
    
    function freshSvg() {
        const x0 = 310,
                y0 = 130,
                x = 320,
                y = 320,
                radius = 100,
                startAngle = 0,
                endAngle = 2 * Math.PI - 1,
                moveto00 = false,
                anticlockwise = true;
        
        const points = [
                    [x + radius * Math.cos(startAngle), y + radius * Math.sin(startAngle)],
                    [+radius * Math.cos(endAngle), y + radius * Math.sin(endAngle)]
                ],
                labels = ["开始角度", ""],
                lines = [],
                draw = () => {
                    const startAngle = Math.atan2(points[0][1] - x, points[0][0] - y),
                            endAngle = 2 * Math.PI,
                            radius = Math.sqrt((points[0][1] - x) ** 2 + (points[0][0] - y) ** 2);
                    points[0][0] = x + radius * Math.cos(startAngle);
                    points[0][1] = x + radius * Math.sin(startAngle);
                    points[1][0] = x + radius * Math.cos(endAngle);
                    points[1][1] = x + radius * Math.sin(endAngle);
                    
                    const path = d3.path();
                    if (moveto00) path.moveTo(...points[2]);
                    path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
                    return path;
                };
        
        if (moveto00) {
            points.push([x0, y0]);
            labels.push("⟨x0, y0⟩");
        }
        
        draggable(chartElement, points, labels, lines, draw);
    }
    
    freshSvg()
    
    function update(chart, points, labels, lines, draw, options) {
        d3.select(chart)
                .select(".u-path")
                .style("stroke", "orange")
                .style("fill", options ? (options.fill ? options.fill : "none") : "none")
                .attr("d", draw());
        
        d3.select(chart)
                .selectAll(".u-point")
                .style("stroke", "orange")
                .style("fill", "orange")
                
                .data(points)
                .join(enter =>
                        enter
                                .append("g")
                                .classed("u-point", true)
                                .call(g => {
                                    g.append("circle").attr("r", 3);
                                    g.append("text")
                                            .text((d, i) => labels[i])
                                            .attr("dy", d => (d[1] > 100 ? 15 : -5));
                                })
                )
                .attr("transform", d => `translate(${d})`);
        
        d3.select(chart)
                .selectAll(".u-line")
                .style("stroke", "#aaa")
                .style("stroke-dasharray", "2 2")
                .data(lines)
                .join("line")
                .attr("x1", d => d[0][0])
                .attr("y1", d => d[0][1])
                .attr("x2", d => d[1][0])
                .attr("y2", d => d[1][1])
                .classed("u-line", true);
    }
    
    function draggable(chart, points, labels, lines, draw, options) {
        update(chart, points, labels, lines, draw, options);
        
        const dist = (p, m) => {
            return Math.sqrt((p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2);
        };
        
        var subject, dx, dy;
        
        function dragSubject(event) {
            const p = d3.pointer(event.sourceEvent, chart);
            subject = d3.least(points, (a, b) => dist(p, a) - dist(p, b));
            if (dist(p, subject) > 48) subject = null;
            if (subject)
                d3.select(chart)
                        .style("cursor", "hand")
                        .style("cursor", "grab");
            else d3.select(chart).style("cursor", null);
            return subject;
        }
        
        d3.select(chart)
                .on("mousemove", event => dragSubject({sourceEvent: event}))
                .call(
                        d3.drag()
                                .subject(dragSubject)
                                .on("start", event => {
                                    if (subject) {
                                        d3.select(chart).style("cursor", "grabbing");
                                        dx = subject[0] - event.x;
                                        dy = subject[1] - event.y;
                                    }
                                })
                                .on("drag", event => {
                                    if (subject) {
                                        subject[0] = event.x + dx;
                                        subject[1] = event.y + dy;
                                    }
                                })
                                .on("end", () => {
                                    d3.select(chart).style("cursor", "grab");
                                })
                                .on("start.render drag.render end.render", () =>
                                        update(chart, points, labels, lines, draw, options)
                                )
                );
    }

</script>
</html>

```

## 代码仓库

> [在线体验](https://codepen.io/chushenshen/pen/vYqVbNe)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint-blogs/tree/main/svg/acr.html)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint-blogs/tree/main/svg/README-acr.md)

## 实战项目：MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器
>
> 体验地址：[前往](https://demo.myprint.top)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint)
