// Set up the chart parameters

let svgWidth = 960
let svgHeight = 500

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
  };
  
  
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin["top"] - margin["bottom"];

// Append the svg group

let svg = d3.select("body")
          .append("svg")
          .attr('width', svgWidth)
          .attr('height', svgHeight)


let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Setup data import

d3.csv('data.csv', function(error, healthData) {
    if(error) throw error; 
    console.log(healthData)

    // Format the data
    healthData.forEach(function(data) {
        console.log(data.abbr)
        data.obesity = parseFloat(data.obesity);
        console.log(data.obesity);
        data.poverty = parseFloat(data.poverty);
        console.log(data.poverty);
        data.income = parseInt(data.income);
        console.log(data.income);
        data.age = parseFloat(data.age);
        console.log(data.age);
        data.healthcare = parseFloat(data.healthcare);
        console.log(data.healthcare);
        data.smokes = parseFloat(data.smokes);
        console.log(data.smokes);
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
        .enter().append('g')
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
        .attr('font-size', 15)
        .attr('fill', '#d3e2e2')
        .attr('x',d => xLinearScale(d.income))
        .attr('y',  d => yLinearScale(d.smokes) + 5)
        .attr('text-anchor', 'middle')
        
        .text(d => d.abbr)
        ;

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokers (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width/2 - 30}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Household Income ($)");

});

