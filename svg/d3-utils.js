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
