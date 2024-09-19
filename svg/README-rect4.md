# svg-多边形

介绍一款强大的svg操作库，能够通过简单的代码，实现svg绘制与操纵，实现拖拽等功能

本文将通过一个简单的示例，介绍如何在SVG中绘制一条可拖拽的多边形

## 正文
### 基础HTML结构
首先，我们需要在HTML中设置基本的SVG元素，以便绘制图形。
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint | 打印设计 | SVG | 多边形</title>
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
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
        <path class="u-path"/>
        <line class="u-line"/>
        <line class="u-line"/>
    </svg>
</div>
</body>
</html>
```

###  绘制 SVG 矩形
接下来，我们使用 D3.js 创建一个简单的矩形，并通过 JavaScript 函数 freshSvg 进行渲染。代码如下：
```js
const chartElement = document.getElementById('chartRef');

function freshSvg() {
    const x0 = 100, y0 = 200,
        x1 = 500, y1 = 100,
        x2 = 500, y2 = 500,
        x3 = 200, y3 = 500;

    const points = [[x0, y0], [x1, y1], [x2, y2], [x3, y3]];

    const draw = () => {
        const path = d3.path();
        path.moveTo(...points[0]);
        path.lineTo(...points[1]);
        path.lineTo(...points[2]);
        path.lineTo(...points[3]);
        path.closePath();
        return path;
    };

    draggable(chartElement, points, [], [], draw, {fill: 'orange'});
}
freshSvg();
```
这里，我们定义了矩形的四个顶点，并通过 d3.path() 方法绘制了这个矩形。

### 实现拖拽功能
为了让用户可以拖动矩形的顶点，我们使用 D3.js 的 drag 功能，并结合 draggable 函数实现这一功能：
```js
function draggable(chart, points, labels, lines, draw, options) {
    update(chart, points, labels, lines, draw, options);

    const dist = (p, m) => Math.sqrt((p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2);
    let subject, dx, dy;

    function dragSubject(event) {
        const p = d3.pointer(event.sourceEvent, chart);
        subject = d3.least(points, (a, b) => dist(p, a) - dist(p, b));
        return subject && dist(p, subject) <= 48 ? subject : null;
    }

    d3.select(chart)
        .on("mousemove", event => dragSubject({sourceEvent: event}))
        .call(
            d3.drag()
                .subject(dragSubject)
                .on("start", event => {
                    if (subject) {
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
```
在 draggable 函数中，我们为每个顶点设置了拖拽行为，当用户拖动顶点时，矩形会相应地更新其形状。


## 完整实现
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint|打印设计|SVG|矩形</title>
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
        const x0 = 100,
                y0 = 200,
                
                x1 = 500,
                y1 = 100,
                x2 = 500,
                y2 = 500,
                x3 = 200,
                y3 = 500;
        
        const path = d3.path();
        path.moveTo(x0, y0);
        path.moveTo(x1, y1);
        path.moveTo(y2, y2);
        path.moveTo(x3, y3);
        
        /**
         *  控制点
         */
        const points = [[x0, y0], [x1, y1], [x2, y2], [x3, y3]],
                // labels = ["Start", "Control", "End", '123'],
                labels = [],
                // lines = [[points[0], points[1]], [points[1], points[2]]],
                lines = [],
                draw = () => {
                    const path = d3.path();
                    path.moveTo(...points[0]);
                    path.lineTo(...points[1]);
                    path.lineTo(...points[2]);
                    path.lineTo(...points[3]);
                    // path.moveTo(...points[0]);
                    // path.rect(...points[1], ...points[2]);
                    path.closePath()
                    
                    return path;
                };
        
        draggable(chartElement, points, labels, lines, draw, {fill: 'orange'});
    }
    
    function drag() {
        
        function dragstarted(event, d) {
            // console.log(d)
            // d3Selection.select(this).raise().attr("stroke", "black");
        }
        
        function dragged(event, d) {
            // console.log(d)
            // d3Selection.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
        }
        
        function dragended(event, d) {
            // d3Selection.select(this).attr("stroke", null);
        }
        
        return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
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

> [在线体验](https://codepen.io/chushenshen/pen/QWXZYdP)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint-blogs/tree/main/svg/rect4.html)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint-blogs/tree/main/svg/README-rect4.md)

## 实战项目：MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器
>
> 体验地址：[前往](https://demo.cfcss.top)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint)
