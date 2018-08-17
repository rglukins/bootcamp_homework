// Make the browser responsive if/when resized
d3.select(window).on("resize", makeResponsive);

// make the browser responsive when it loads
makeResponsive();

// create the makeResponsive function
function makeResponsive(){

    // Set up the chart parameters

    let svgWidth = window.innerWidth;
    let svgHeight = window.innerHeight;

    var margin = {
        top: 40,
        right: 100,
        bottom: 120,
        left: 110
    };
  
  
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin["top"] - margin["bottom"];

    // Append the svg element

    let svg = d3.select("body")
            .append("svg")
            .attr('width', svgWidth)
            .attr('height', svgHeight)


    let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

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
            .attr("y", 0 - margin.left + 60)
            .attr("x", 0 - (height / 2) - 10)
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Smokes (%)");

        let incomeAxis = chartGroup.append("text")
            .attr("transform", `translate(${width/2 - 40}, ${height + margin.top + 10})`)
            .attr("class", "axisText")
            .text("Household Income ($)");

        // Initialize the Tooltip
        let toolTip = d3.tip()
            .attr("class", 'd3-tip')
            .offset([80, -60])
            .html( d => `<h5>${d.state}:</h5><p>Income: ${d.income}</p><p>Smokes: ${d.smokes}%</p>`);

        // Create the toolTip in the chartgroup
        node.call(toolTip);

        // Create the mouseover listener for the tooltip
        node.on('mouseover', function(d) { toolTip.show(d, this); });

        // Create mouseout event to close/hide the tooltip
        node.on('mouseout', function(d) { toolTip.hide(d, this); });
    });

}