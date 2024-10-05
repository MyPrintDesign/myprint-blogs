# svg-二阶贝塞尔曲线

介绍一款强大的svg操作库，能够通过简单的代码，实现svg绘制与操纵，实现拖拽等功能

> 官方文档：[前往](https://vueuse.org/core/useLocalStorage/)

本文将通过一个简单的示例，介绍如何在SVG中绘制一条可拖拽的直线

## 正文
### 基础HTML结构
首先，我们需要在HTML中设置基本的SVG元素，以便绘制图形。
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint|打印设计|SVG|直线</title>
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
        <path class="u-path" :d="path"/>
        <line class="u-line"/>
        <line class="u-line"/>
    </svg>
</div>
</body>
</html>
```

### 初始化SVG和绘制直线
我们使用D3.js的d3.path()方法来创建一条直线，并将其绘制到SVG中。起始点和终点的坐标分别为`[100, 200]`和`[600, 400]`。
```js
const chartElement = document.getElementById('chartRef')
const x0 = 100, y0 = 200, x = 600, y = 400;

function freshSvg() {
    const path = d3.path();
    path.moveTo(x0, y0);
    path.lineTo(x, y);

    const points = [[x0, y0], [x, y]];
    const labels = ["开始", "结束"];
    const lines = [];
    const draw = () => {
        const path = d3.path();
        path.moveTo(...points[0]);
        path.lineTo(...points[1]);
        return path;
    };

    draggable(chartElement, points, labels, lines, draw);
}

freshSvg()
```

### 实现拖拽功能
为了让直线的起点和终点可以被拖动，我们需要使用D3.js的拖拽交互模块d3.drag()。通过计算拖拽距离，我们可以实时更新直线的位置：
```js
function draggable(chart, points, labels, lines, draw) {
    update(chart, points, labels, lines, draw);

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
                    update(chart, points, labels, lines, draw)
                )
        );
}
```
### 更新SVG内容
每次拖拽时，我们都需要更新SVG的内容，以反映新的直线位置。这通过update()函数实现，该函数更新路径、控制点和辅助线：
```js
function update(chart, points, labels, lines, draw) {
    d3.select(chart)
        .select(".u-path")
        .style("stroke", "orange")
        .style("fill", "none")
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
```

## 完整实现
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint|打印设计|SVG|直线</title>
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
    const x0 = 100,
            y0 = 200,
            x = 600,
            y = 400;
    
    function freshSvg() {
        const path = d3.path();
        path.moveTo(x0, y0);
        path.lineTo(x, y);
        
        // 控制点
        const points = [[x0, y0], [x, y]],
                // 标题
                labels = ["开始", "结束"],
                // 辅助线
                lines = [],
                // 绘制方法
                draw = () => {
                    const path = d3.path();
                    path.moveTo(...points[0]);
                    path.lineTo(...points[1]);
                    return path;
                };
        
        draggable(chartElement, points, labels, lines, draw);
    }
    
    freshSvg()
    
    function update(chart, points, labels, lines, draw) {
        d3.select(chart)
                .select(".u-path")
                .style("stroke", "orange")
                .style("fill", "none")
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
    
    function draggable(chart, points, labels, lines, draw) {
        update(chart, points, labels, lines, draw);
        
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
                                        update(chart, points, labels, lines, draw)
                                )
                );
    }

</script>
</html>
```

## 代码仓库

> [在线体验](https://codepen.io/chushenshen/pen/oNraBWm)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint-blogs/tree/main/svg/line.html)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint-blogs/tree/main/svg/README-line.md)

## 实战项目：MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器
>
> 体验地址：[前往](https://demo.myprint.top)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint)
