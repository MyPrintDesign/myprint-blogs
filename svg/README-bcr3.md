# svg-三阶贝塞尔曲线

介绍一款强大的svg操作库，能够通过简单的代码，实现svg绘制与操纵，实现拖拽等功能

本文将通过一个简单的示例，介绍如何在SVG中绘制一条可拖拽的三次贝塞尔曲线

## 正文
### 基础HTML结构
首先，我们需要在HTML中设置基本的SVG元素，以便绘制图形。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPrint|打印设计|SVG|三阶贝塞尔曲线</title>
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
在这个HTML结构中，`<svg>`元素用于承载我们即将绘制的二次贝塞尔曲线和相关的辅助线。id="chartRef" 使我们能够在JavaScript中轻松获取到这个元素。

### 定义初始点和绘制曲线
接下来，我们通过 JavaScript 和 D3.js 来绘制贝塞尔曲线。首先定义起点、终点和两个控制点的坐标：
```js
const chartElement = document.getElementById('chartRef')
const x0 = 100,
    y0 = 300,
    cpx1 = 250,
    cpy1 = 400,
    cpx2 = 400,
    cpy2 = 100,
    x = 600,
    y = 300;
```
然后，我们使用 d3.path() 来定义路径，并绘制贝塞尔曲线：
```js
function freshSvg() {
    const path = d3.path();
    path.moveTo(x0, y0);
    path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);

    const points = [[x0, y0], [cpx1, cpy1], [cpx2, cpy2], [x, y]],
        labels = ["开始", "控制点1", "控制点2", "结束"],
        lines = [[points[0], points[1]], [points[2], points[3]]],
        draw = () => {
            const path = d3.path();
            path.moveTo(...points[0]);
            path.bezierCurveTo(...points[1], ...points[2], ...points[3]);
            return path;
        };

    draggable(chartElement, points, labels, lines, draw);
}

freshSvg();
```

### 可拖拽的实现
为了使这条曲线更加动态，我们通过 draggable 函数将曲线的控制点、起点和终点设置为可拖拽的。这意味着用户可以拖动这些点，实时改变贝塞尔曲线的形状。
```js
function draggable(chartElement, points, labels, lines, draw) {
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
draggable 函数的实现需要处理鼠标或触摸事件，在用户拖拽时动态更新曲线。这部分代码较为复杂，但其核心思想是监听并更新各个点的坐标，然后重新绘制曲线。
### 更新曲线和辅助线
每次用户拖拽控制点时，我们都需要更新曲线和辅助线。这是通过 update 函数完成的：
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
    <title>MyPrint|打印设计|SVG|三阶贝塞尔曲线</title>
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
            y0 = 300,
            cpx1 = 250,
            cpy1 = 400,
            cpx2 = 400,
            cpy2 = 100,
            x = 600,
            y = 300;
    
    function freshSvg() {
        const path = d3.path();
        path.moveTo(x0, y0);
        path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);
        
        // 控制点
        const points = [[x0, y0], [cpx1, cpy1], [cpx2, cpy2], [x, y]],
                // 标题
                labels = ["开始", "控制点1", "控制点2", "结束"],
                // 辅助线
                lines = [[points[0], points[1]], [points[2], points[3]]],
                // 绘制方法
                draw = () => {
                    const path = d3.path();
                    path.moveTo(...points[0]);
                    path.bezierCurveTo(...points[1], ...points[2], ...points[3]);
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

> [在线体验](https://codepen.io/chushenshen/pen/PordxgW)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint-blogs/tree/main/svg/README-bcr3.md)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint-blogs/tree/main/svg/README-bcr3.md)

## 实战项目：MyPrint

> 操作简单，组件丰富的一站式打印解决方案打印设计器
>
> 体验地址：[前往](https://demo.myprint.top)
>
> 代码仓库：[github](https://github.com/MyPrintDesign/myprint)
>
> 代码仓库：[gitee](https://gitee.com/MyPrintDesign/myprint)
