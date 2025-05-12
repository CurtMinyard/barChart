 const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const svgWidth = 1000;
const svgHeight = 600;
const padding = 60;

const svg = d3.select("#chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

d3.json(url).then(data => {
  const dataset = data.data;

  const xScale = d3.scaleTime()
    .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
    .range([padding, svgWidth - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([svgHeight - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${svgHeight - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  // Tooltip setup
  const tooltip = d3.select("#tooltip");

  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("width", (svgWidth - 2 * padding) / dataset.length)
    .attr("height", d => svgHeight - padding - yScale(d[1]))
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .on("mouseover", (event, d) => {
      tooltip
        .style("display", "block")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 40 + "px")
        .attr("data-date", d[0])
        .html(`${d[0]}<br>$${d[1]} Billion`);
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });
})
