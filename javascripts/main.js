console.log('This would be the main JS file.');

var svg = d3.select("#force").append("svg"),
    width = 604,
    height = 649;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var mb = d3.forceManyBody();

mb.strength([-250])

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", mb)
    .force("center", d3.forceCenter(width / 2, height / 2));


d3.json("artists.json", function(error, graph) {
    if (error) throw error;

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start",dragstarted)
            .on("drag",dragged)
            .on("end",dragended));

    var circle = node.append("circle")
        .attr("r", 5)
        .attr("fill","#4a9e48");

   // circle.attr("fill", function(d) { return color(d.group)});

    var label = node.append("text")
        .attr("dy", ".35em")
        .attr("fill","lightgrey")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        circle
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        label
            .attr("x", function(d) { return d.x + 8; })
            .attr("y", function(d) { return d.y; });
    }
});

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

/* SVG STUFF FOR CLASS PROBABILITY CHART */

var margin = {top: 10, right: 10, bottom: 100, left: 10};

var width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg2 = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class","probsvg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

$("#songselect tr").click(function(e) {
    $("#songselect tr").removeClass("highlight");
    $(this).addClass("highlight");
});

$("#methodselect tr").click(function(e) {
    $("#methodselect tr").removeClass("highlight");
    $(this).addClass("highlight");
});
