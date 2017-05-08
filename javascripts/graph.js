/**
 * Created by omarabboud1 on 2017-05-08.
 */


/* SVG STUFF FOR CLASS PROBABILITY CHART */

var margin_g = {top: 30, right: 30, bottom: 40, left: 48};

var width_g = 600 - margin_g.left - margin_g.right,
    height_g = 200 - margin_g.top - margin_g.bottom;

var svg2 = d3.select("#chart-area").append("svg")
    .attr("width", width_g + margin_g.left + margin_g.right)
    .attr("height", height_g + margin_g.top + margin_g.bottom)
    .attr("class","probsvg")
    .append("g")
    .attr("transform", "translate(" + margin_g.left + "," + margin_g.top + ")");

var x = d3.scaleBand().rangeRound([0, width_g]).padding(0.1);
var y = d3.scaleLinear().range([height_g,0]);

x.domain([1,2,3,4,5]);
y.domain([0,1]);

svg2.append("g")
    .attr("transform","translate(0,0)")
    .attr("class", "y-axis axis")
    .call(d3.axisLeft(y));

svg2.append("g")
    .attr("transform", "translate(0," + height_g + ")")
    .attr("class", "x-axis axis")
    .call(d3.axisBottom(x));

svg2.append("text")
    .attr("transform", "translate(200,160)")
    .text("Popularity Class");

svg2.append("text")
    .attr("transform", "translate(-35,100)rotate(-90)")
    .text("Probability");

/*var yAxis = d3.svg.axisLeft().scale(y);

var yAxisGroup = svg2.append("g")
    .attr("class", "y-axis axis");

var xAxis = d3.svg.axisBottom(x);

var xAxisGroup = svg2.append("g")
    .attr("transform", "translate(0," + height_g + ")")
    .attr("class", "x-axis axis");


svg2.select(".y-axis")
    .transition().duration(800)
    .call(yAxis);

svg2.select(".x-axis")
    .transition().duration(800)
    .call(xAxis);*/



var xlabel = svg2.append("text");

Graph = function(_data){

    _data.forEach(function(d){
        d.class = +d.class;
        d.probabilities = +d.probabilities
    });

    this.data = _data;
    this.displaydata = _data;
    /*

     _data[2].forEach(function(d, i){
     d.index = i});
     this.parentElement = _parentElement;
     this.countries = _data[0];
     this.nodes = _data[1];
     this.flows = _data[2];
     this.displayFlows =_data[2];
     // console.log(this.displayFlows)
     this.selection = "None";
     this.initVis();*/

}
Graph.prototype.wrangleData = function(selectSong, selectBucket){
    var vis = this;
    vis.selectedSong = selectSong;
    vis.selectedBucket = selectBucket;
    console.log("about to loop through data");

    /*console.log(vis.data);*/

    var filteredData = vis.data.filter(function(d){
        if((d.bucket_name == selectBucket) & (d.seed_id == selectSong)){ return d; }
    });

    console.log(filteredData)

    var bars = svg2.selectAll(".bar")
        .remove()
        .exit()
        .data(filteredData);

    bars
        .enter().append("rect")
        .attr("class","bar")
        .attr("x",function(d){console.log(d.class); return x(d.class);})
        .attr("width",x.bandwidth())
        .attr("height",function(d){ return height_g - y(d.probabilities);})
        .attr("y",function(d){return y(+d.probabilities);});

    /*bars
        .attr("x", function(d){console.log(d.class); return x(d.class);})
        .attr("y", function(d){return y(+d.probabilities);})
        .attr("width", 10)
        .attr("height", function(d){ return height_g - y(d.probabilities);});*/





}