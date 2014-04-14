/* 
 *
 * CHOROPLETH HEAT MAP DIAGRAM 
 * just becuase...
 * 
 */

// Pre-Load the json data using the queue library
queue()
    .defer(d3.json, "data/uscounties.json")
    .defer(d3.json, "data/AHPdata.json")
    .await(ready);

function ready(error, us, AHP) {

    var h = 220, w = 300, centered; 

    var projection = d3.geo.albersUsa().scale(1750).translate([w/2, h*1.2]);

    var path = d3.geo.path().projection(projection);

    var svg = d3.select("#choro").append("svg")
                .attr("width", w)
                .attr("height", h);

        svg.append("rect")
                .attr("class", "background")
                .attr("width", w)
                .attr("height", h);

    var g = svg.append("g");

// Setup a gradiated color scale from bg color to dark green
    var color = d3.scale.linear()
                .domain([0, 1, 10, 50, 1500])
                .range(["#D0D0DB", "#57C279", "#48A164", "#10702E"]);
    
// Setup the rollover tooltips to show a city value
    var tip = d3.tip() 
                .attr('class', 'd3-tip')
                .html(function (d) { 
                    
                    var members = "City" ;
                    AHP.forEach(function(e) {
                        if (+e.FIPS == d.id) { members = e.City} ;
                    })
                    return members; 
                });

// Draw County Borders
        g.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.counties).features)
                .enter()
                .append("path")
                .attr("d", path)
                .call(tip)
// Fill Color Counties
                .attr("fill", function(d) {
                                var sum = 0;
                                AHP.forEach(function (e) { e.FIPS == d.id ? sum += +e.data : sum += 0; });
                                return color(sum);
                                })
// Mouse events            
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);
                
// Draw State Borders
        g.append("path")
                .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
                .attr("id", "state-borders")
                .attr("d", path);

}; // END CHOROPLETH WORKER FUNCTION

