// let svgWidth = 960;
let svgWidth = parseInt(d3.select('#scatter').style('width'));
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 40
};
  
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;;

// create and svg wrapper and append the svg element

let svg = d3.select("#scatter")
    .append("svg")
    .attr('width', svgWidth)
    .attr('height', svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let chosenXAxis = "Household Income ($)";

//create function to shift axis scale when label upon click of label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
}


    // Setup data import

    d3.csv('data.csv', function(error, healthData) {
        if(error) throw error; 


        // Format the data
        healthData.forEach(function(data) {
            data.obesity = parseFloat(data.obesity);
            data.poverty = parseFloat(data.poverty);
            data.income = parseInt(data.income);
            data.age = parseFloat(data.age);
            data.healthcare = parseFloat(data.healthcare);
            data.smokes = parseFloat(data.smokes);
            });
            

        // Create scale functions
        let xLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.income) - 5000, d3.max(healthData, d => d.income)])
            .range([0, width]);

        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(healthData, d => d.smokes)])
            .range([height, 0]);

        // Create axis functions
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        // Append Axes to the chart
    
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // Create Circles
            
        let node = chartGroup.selectAll('.node')
            .data(healthData)
            .enter()
            .append('g')
            .classed('node', true);
        
        node.append("circle")
            .attr("cx", d => xLinearScale(d.income))
            .attr("cy", d => yLinearScale(d.smokes))
            .attr("r", 15)
            .style("fill", 'blue')
            .attr('opacity', '.5')
            .append("title")
            .text(d => d.state);

        node.append("text")
            .attr('font-size', 12)
            .attr('fill', '#d3e2e2')
            .attr('x',d => xLinearScale(d.income))
            .attr('y',  d => yLinearScale(d.smokes) + 5)
            .attr('text-anchor', 'middle')
            .text(d => d.abbr);

        // Create axes labels
        let smokersAxis = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left - 5)
            .attr("x", 0 - (height / 2) - 10)
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Smokers (%)");

        let incomeAxis = chartGroup.append("text")
            .attr("transform", `translate(${width/2 - 40}, ${height + margin.top + 15})`)
            .attr("class", "axisText")
            .text("Household Income (Median)");

        // Initialize the Tooltip
        let toolTip = d3.tip()
            .attr("class", 'd3-tip')
            .offset([80, -60])
            .html( d => `<h5>${d.state}:</h5><p>Income: $${d.income}</p><p>Smokers: ${d.smokes}%</p>`);

        // Create the toolTip in the chartgroup
        node.call(toolTip);

        // Create the mouseover listener for the tooltip
        node.on('mouseover', function(d) { toolTip.show(d, this); });

        // Create mouseout event to close/hide the tooltip
        node.on('mouseout', function(d) { toolTip.hide(d, this); });
    });

