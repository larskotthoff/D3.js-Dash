/* 
 *
 * 7 DAY EMERGENCY DEPT ADMISSION ACUITY
 *
 */

// Set the acuity categories we want. Somewhat arbitrary based on the dataset
var myset = ["emergency","trauma","urgent","newborn","elective"];

// Cycle through each acuity category and draw a histogram
myset.forEach(function(divid) {
    
// Load the dataset for the acuity category
    //d3.json("data/" + divid + ".php", function(dataset) {
    d3.json("data/" + divid + ".json", function(dataset) {

// Set the histogram dimensions
    var h=29, w=295, barPadding = 2;

// Scale the x-axis to 7 days and align it to the right    
    var xScale = d3.scale.linear()
                    .domain([0, 7])
                    .range([w-(w/2), w]); // align bars right
    
// Attach an SVG to a div with the same name as the acuity category
    var svg = d3.select("#" + divid )
                    .append("svg") 
                    .attr({width: w, height: h});

// Calculate a 7 day grand total for the acuity category
    var Sum = d3.sum(dataset, function(d) {return d.Total;});

// Scale the y-axis to the maximum value of the dataset
    var yScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function(d) { return d.Total; })])
                    .range([0, h]);

// Setup some fancy gradient shading of bars. Eye candy only.
    var gradient = svg.append("svg:defs")
                    .append("svg:linearGradient")
                    .attr("id", "gradient")
                    .attr("x1", "0%")
                    .attr("y1", "100%")
                    .attr("x2", "0%")
                    .attr("y2", "0%");

        gradient.append("svg:stop")
                    .attr("offset", "0%")
                    .attr("stop-color", "#D0D0DB")
                    .attr("stop-opacity", 1);

        gradient.append("svg:stop")
                    .attr("offset", "100%")
                    .attr("stop-color", "steelblue")
                    .attr("stop-opacity", 1);
        
// Setup the rollover tooltips to show a date value
    var tip = d3.tip() 
                    .attr('class', 'd3-tip') // style in the CSS file 
                    .html(function(d) { return d.Date; });
    
// Instantiate the rollover tooltip in the context of the svg container.
        svg.call(tip);

        svg.append("text") // ACUITY CATEGORY TITLE //
                    .attr("class", "li")
                    .attr("x", 1)
                    .attr("y", h -3 )
                    .text(divid.toUpperCase() + " (" + Sum + ")");

        svg.selectAll("rect") // HISTOGRAM BARS //
                    .data(dataset)
                    .enter().append("rect")
                    .attr({ class: "bar",
                            x: function(d, i) { return xScale(i) - barPadding; },
                            y: function(d) { return h - yScale(d.Total); },
                            height: function(d) { return yScale(d.Total); },
                            width: (w / 7 - barPadding) / 2
                            })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

        svg.selectAll("text.bar") // HISTOGRAM BAR LABELS //
                    .data(dataset)
                    .enter().append("text")
                    .attr({ class: "barvals",
                            x: function(d, i) { return xScale(i) +7 },
                            y: function(d) { return h - yScale(d.Total) + 10},
                            })
                    .text(function(d) { return d.Total ; });

    }); // END D3 CALLBACK FUNCTION

}); // END FUNCTION ACUITY CATEGORY

