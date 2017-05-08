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

Playlist.prototype.wrangleData = function(selectSong, selectBucket){
    var vis = this;
    vis.selectedSong = selectSong;
    vis.selectedBucket = selectBucket;
    //vis.displayFlows = vis.flows.filter(function(d){return d.Origin==selectCountry});
    $( ".play" ).empty();
    vis.displaydata.forEach(function(d) {
        // console.log([flow.Origin, flow.Dest]);
        if (d.seed_id==vis.selectedSong & d.bucket_name==vis.selectedBucket){

            var outputFrame = '<tr><td class="playlist-col input-song"><iframe src="https://open.spotify.com/embed?uri=spotify:track:' + d.track_ids + '&theme=black&view=list" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe></td><td class="popularity-col">' + d.popularity + '</td></tr>'
            $( ".play" ).append(outputFrame);
            /*document.getElementById("playlist-gen").innerHTML = outputFrame;*/

        }
    });
}


