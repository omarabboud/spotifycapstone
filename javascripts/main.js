
queue()
    .defer(d3.csv, "data/demo_playlists.csv")
    .defer(d3.csv, "data/demo_probabilities.csv")
    .await(ready);

function ready(error, playlists, probabilities) {
    if (error) throw error;
    playlistTable = new Playlist(playlists);
    graph = new Graph(probabilities);

}

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

var selectedSong = "";
var selectedBucket = "";

$("#songselect tr").click(function(e) {
    $("#songselect tr").removeClass("highlight");
    $(this).addClass("highlight");
    selectedSong=this.id;

    if (selectedSong!="" & selectedBucket!=""){
        playlistTable.wrangleData(selectedSong, selectedBucket);
        graph.wrangleData(selectedSong, selectedBucket);
        $(".play").addClass("play-disabled");


    }
});


$("#methodselect tr").click(function(e) {
    $("#methodselect tr").removeClass("highlight");
    $(this).addClass("highlight");
    selectedBucket=this.id;
    if (selectedSong!="" & selectedBucket!=""){
        playlistTable.wrangleData(selectedSong, selectedBucket);
        graph.wrangleData(selectedSong, selectedBucket);
        $(".play").addClass("play-disabled");

    }

});

/*
function printOutRides() {
    var printOut = ""

    attractions.forEach(function(ride) {
            printOut += ride.name + ", $" + ride.price + "<br/>";
        }
    );
    return printOut
}


document.getElementById("themePark2").innerHTML = printOutRides()
*/
