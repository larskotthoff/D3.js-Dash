/* 
 *
 * 48HR PATIENT FLOW SANKEY DIAGRAM 
 * Lots of wierd funcky stuff in the
 * sankey.js plugin I still don't understand
 *
 */

// Pre-Load the json data using the queue library
queue()
    //.defer(d3.json, "data/sankeyLinks.php")
    //.defer(d3.json, "data/sankeyNodes.php")
    .defer(d3.json, "data/sankeyLinks.json")
    .defer(d3.json, "data/sankeyNodes.json")
    .await(ready);

function ready(error, sankeyLinks, sankeyNodes) {
// Set SVG Container dimensions in px
    var h = 220, w = 620; 

    var formatNumber = d3.format(",.0f");

    var format = function(d) { return formatNumber(d) + " TWh"; };
    
// Establish the color pallet
    var color = d3.scale.category20b();

    var svg = d3.select("#sankey")
                    .append("svg")
                    .attr("width", w )
                    .attr("height", h) 
                    .append("g")
                    .attr("transform", "translate(" + 5 + "," + 5 + ")");

    var sankey = d3.sankey()
                    .nodeWidth(15)
                    .nodePadding(10)
                    .size([w, h]);

    var path = sankey.link();

// Cast everything in this dataset to INTs
    sankeyLinks.forEach(function(d) {
                    d.source = +d.source;
                    d.target = +d.target;
                    d.value = +d.value;
                    });

    sankey.nodes(sankeyNodes)
                    .links(sankeyLinks)
                    .layout(32);

    var link = svg.append("g").selectAll(".link")
                    .data(sankeyLinks)
                    .enter()
                    .append("path")
                    .attr("class", "sankeylink")
                    .attr("d", path)
                    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
                    .sort(function(a, b) { return b.dy - a.dy; });

    link.append("title")
                    .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    var node = svg.append("g")
                    .selectAll(".node")
                    .data(sankeyNodes)
                    .enter()
                    .append("g")
                    .attr("class", "sankeynode")
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .call(d3.behavior.drag()
                    .origin(function(d) { return d; })
                    .on("dragstart", function() { this.parentNode.appendChild(this); })
                    .on("drag", dragmove));

    node.append("rect")
                    .attr("height", function(d) { return d.dy; })
                    .attr("width", sankey.nodeWidth())
                    .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
                    .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
                    .append("title")
                    .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
                    .attr("x", -6)
                    .attr("y", function(d) { return d.dy / 2; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "end")
                    .attr("transform", null)
                    .text(function(d) { return d.name + " (" + d.value + ")"; })
                    .filter(function(d) { return d.x < w / 2; })
                    .attr("x", 6 + sankey.nodeWidth())
                    .attr("text-anchor", "start");

function dragmove(d) {
    d3.select(this)
        .attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(h - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  } // END DRAG BEHAVIOR FUNCTION

}; // END SANKEY CALLBACK FUNCTION

