/**
 * Created by lware on 5/7/17.
 */

// Note: code was adapted from http://bl.ocks.org/ilyabo/2209220


Playlist = function(_data){
    console.log(_data);
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

Playlist.prototype.initVis = function(){
    var vis = this;


    vis.margin = {top: 0, right: 0, bottom: 0, left: 0},
        vis.w = 830 - vis.margin.right - vis.margin.left,
        vis.h = 500 - vis.margin.top - vis.margin.bottom;


    vis.useGreatCircles = true;


    d3.loadData = function() {
        var loadedCallback = null;
        var toload = {};
        var data = {};
        var loaded = function(name, d) {
            delete toload[name];
            data[name] = d;
            return notifyIfAll();
        };
        var notifyIfAll = function() {
            if ((loadedCallback != null) && d3.keys(toload).length === 0) {
                loadedCallback(data);
            }
        };
        var loader = {
            json: function(name, url) {
                toload[name] = url;
                d3.json(url, function(d) {
                    return loaded(name, d);
                });
                return loader;
            },
            csv: function(name, url) {
                toload[name] = url;
                d3.csv(url, function(d) {
                    return loaded(name, d);
                });
                return loader;
            },
            onload: function(callback) {
                loadedCallback = callback;
                notifyIfAll();
            }
        };
        return loader;
    };



    vis.projection = d3.geo.mercator()
        .translate([380, 300])
        .scale(150);

    vis.path = d3.geo.path()
        .projection(vis.projection);

    vis.arc = d3.geo.greatArc().precision(3) //3);

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.w + vis.margin.right + vis.margin.left)
        .attr("height", vis.h + vis.margin.top + vis.margin.bottom);

    vis.country_paths = vis.svg.append("g").attr("id", "countries1");
    vis.centroids = vis.svg.append("g").attr("id", "centroids");
    vis.arcs = vis.svg.append("g").attr("id", "arcs");

    vis.svg.append("text")
        .attr("id", "loading")
        .attr("x", 5)
        .attr("y", 17)
        .attr("font-size", "9pt")
        .attr("font-family", "arial")
        .text("Loading...");


    vis.updateVis();
}

Playlist.prototype.wrangleData = function(selectSong, selectBucket){
    var vis = this;
    vis.selectedSong = selectSong;
    vis.selectedBucket = selectBucket;
    console.log("about to loop through data");
    //vis.displayFlows = vis.flows.filter(function(d){return d.Origin==selectCountry});
    $( ".play" ).empty();
    vis.displaydata.forEach(function(d) {
        // console.log([flow.Origin, flow.Dest]);
        if (d.seed_id==vis.selectedSong & d.bucket_name==vis.selectedBucket){
            console.log(vis.selectedBucket, d.bucket_name, vis.selectedBucket==d.bucket_name);

            var outputFrame = '<iframe src="https://open.spotify.com/embed?uri=spotify:track:' + d.track_ids + '&theme=black&view=list" width="98%" height="80" frameborder="0" allowtransparency="true"></iframe></td>'
            $( ".play" ).append(outputFrame);
            /*document.getElementById("playlist-gen").innerHTML = outputFrame;*/

        }
    });
}

Playlist.prototype.updateVis = function(){
    var vis = this;

    d3.select("#loading").attr("visibility", "hidden");

    var nodeDataByCode = {}, links = [];
    var year = '2008';
    var maxMagnitude =
        d3.max(vis.displayFlows, function(d) { return parseFloat(d[year])});
    var magnitudeFormat = d3.format(",.0f");

    var arcWidth = d3.scale.linear().domain([1, maxMagnitude]).range([.1, 7]);
    var minColor = 'rgba(240, 240, 240, 0.23)', maxColor = 'white';
    var arcColor = d3.scale.log().domain([1, maxMagnitude]).range([minColor, maxColor]);
    var arcOpacity = d3.scale.log().domain([1, maxMagnitude]).range([0.3, 1]);
    var world = topojson.feature(vis.countries, vis.countries.objects.countries).features;

    vis.country_paths.selectAll("path")
        .data(world)
        .enter().append("path")
        .attr("d", vis.path);


    function nodeCoords(node) {
        var lon = parseFloat(node.Lon), lat = parseFloat(node.Lat);
        if (isNaN(lon) || isNaN(lat)) return null;
        return [lon, lat];
    }

    vis.nodes.forEach(function(node) {
        node.coords = nodeCoords(node);
        node.projection = node.coords ? vis.projection(node.coords) : undefined;
        nodeDataByCode[node.Name] = node;
    });

    //data.flows = data.flows.filter(function(d) { return (d.Origin == 'IDN' && d.Dest == 'USA') ||  (d.Origin == 'LBR'  &&  d.Dest == 'NZL' );  });

    vis.displayFlows.forEach(function(flow) {
        // console.log(vis.selection);
        // console.log([flow.Origin, flow.Dest]);
        if (vis.selection=="All"||flow.Origin==vis.selection||flow.Dest==vis.selection){
            // console.log(vis.selection);
            var o = nodeDataByCode[flow.Origin], co = o.coords, po = o.projection;
            var d = nodeDataByCode[flow.Dest], cd = d.coords, pd = d.projection;
            var magnitude = 3.75;
            //var magnitude = parseFloat(flow[year]);
            if (co && cd && !isNaN(magnitude)) {
                links.push({
                    index: flow.index, source: co, target: cd,
                    magnitude: magnitude,
                    origin: o, dest: d,
                    originp: po, destp: pd
                });
            }
        }
    });


    vis.centroids.selectAll("circle")
        .data(vis.nodes.filter(function(node) { return node.projection ? true : false }))
        .enter().append("circle")
        .attr("cx", function(d) { return d.projection[0] } )
        .attr("cy", function(d) { return d.projection[1] } )
        .attr("r", 1)
        .attr("fill", "#000")
        .attr("opacity", 0.5)
    ;



    var strokeFun = function(d) { return arcColor(d.magnitude); };

    function splitPath(path) {
        var avgd = 0, i, d;
        var c, pc, dx, dy;
        var points = path.split("L");
        if (points.length < 2) return path;
        var newpath = [ points[0] ];
        var coords = points.map(function(d, i) {
            return d.substr(i > 0 ? 0 : 1).split(","); // remove M and split
        });

        // calc avg dist between points
        for (i = 1; i < coords.length; i++) {
            pc = coords[i-1]; c = coords[i];
            dx = c[0] - pc[0]; dy = c[1] - pc[1];
            d = Math.sqrt(dx*dx + dy*dy);
            c.push(d);  // push dist as last elem of c
            avgd += d;
        }
        avgd /= coords.length - 1;

        // for points with long dist from prev use M instead of L
        for (i = 1; i < coords.length; i++) {
            c = coords[i];
            newpath.push((c[2] > 5 * avgd ? "M" : "L") + points[i]);
        }
        return newpath.join("");
    }

    var gradientNameFun = function(d) { return "grd"+d.origin.Code+d.dest.Code; };
    var gradientRefNameFun = function(d) { return "url(#"+gradientNameFun(d)+")"; };

    var defs = vis.svg.append("svg:defs");

    // see http://apike.ca/prog_svg_patterns.html
    defs.append("marker")
        .attr("id", "arrowHead")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 10)
        .attr("refY", 5)
        .attr("orient", "auto")
        //.attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("markerWidth", 4*6)
        .attr("markerHeight", 3*6)
        .append("polyline")
        .attr("points", "0,0 14,5 0,10 3,5")
        .attr("fill", '#982a23')
        .attr("opacity", 0.95)
    //.attr("fill", '#919191')

    ;


    var gradientSelection = defs.selectAll("linearGradient")
        .data(links, function(d){return d.index});

    var gradient = gradientSelection.enter()
        .append("svg:linearGradient")
        .attr("id", gradientNameFun)
        .attr("gradientUnits", "userSpaceOnUse");

    var gradientUpdate = gradient.transition()
            .duration(5000)
            .attr("x1", function(d) {
                return d.originp[0]; })
            .attr("y1", function(d) { return d.originp[1]; })
            .attr("x2", function(d) { return d.destp[0]; })
            .attr("y2", function(d) { return d.destp[1]; })
        ;

    gradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", minColor)
        .attr("stop-opacity", .0);
    gradient.append("svg:stop")
        .attr("offset", "80%")
        .attr("stop-color", strokeFun)
        .attr("stop-opacity", 1.0);
    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", strokeFun)
        .attr("stop-opacity", 1.0);

    gradientSelection.exit().remove();

    var arcSelection = vis.arcs.selectAll("path")
        .data(links, function(d){return d.index});
    var arcNodes =
        arcSelection.enter().append("path")
        //.attr("visibility", function(d) { return d.magnitude > 500 ? "visible" : "hidden"})
            .attr("stroke", gradientRefNameFun)
            //.attr("stroke", "red")
            //.attr("opacity", function(d) { return arcOpacity(d.magnitude); })
            //.attr("stroke", strokeFun)
            .attr("stroke-linecap", "round")
            .attr("stroke-width", function(d) { return arcWidth(d.magnitude); })
            .transition()
            .attr("d", function(d) {
                if (vis.useGreatCircles)
                    return splitPath(vis.path(vis.arc(d)));
                else
                    return vis.path({
                        type: "LineString",
                        coordinates: [d.source, d.target]
                    });
            })
            .sort(function(a, b) {
                var a = a.magnitude, b = b.magnitude;
                if (isNaN(a)) if (isNaN(b)) return 0; else return -1; if (isNaN(b)) return 1;
                return d3.ascending(a, b);
            });
    arcSelection.on("mouseover", function(d) {
        d3.select(this)
            .attr("stroke", "#762a23");
        //  .attr("marker-end", "url(#arrowHead)");

    });
    arcSelection.on("mouseout", function(d) {
        d3.select(this)
        //  .attr("marker-end", "none")
            .attr("stroke", gradientRefNameFun); })
    ;


    arcSelection.attr("marker-end", "url(#arrowHead)");

    arcSelection.append("svg:title")
        .text(function(d) {
            return d.origin.Name+" -> "+d.dest.Name
            //+"Refugees in " +year+": " +magnitudeFormat(d.magnitude);
        })
    ;
    arcSelection.exit().remove();



}

