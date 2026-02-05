// Import the graphic library to draw chart
//import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const tpl = document.getElementById("chart-template");
const clone = tpl.content.cloneNode(true);
const container = document.querySelector("main");
container.appendChild(clone);
const data = [
  /*

  { date: new Date("2024-01-01"), value: 10 },
  { date: new Date("2024-01-05"), value: 40 },
  { date: new Date("2024-01-10"), value: 25 },
  { date: new Date("2024-01-20"), value: 60 },
  { date: new Date("2024-02-01"), value: 35 },
  */
];

// Declare the chart dimensions and margins.
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;
const padding = 40;

const xScale = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d.date))
  .range([padding, width - padding]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.value)])
  .range([height - padding, padding]);

// Create the SVG container.
const svg = d3
  .select("svg")
  .datum(data)
  .attr("width", width)
  .attr("height", height);

// Add the x-axis.
svg
  .append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(xScale));

// Add the y-axis.
svg
  .append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(yScale));
svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d.date))
  .attr("cy", (d) => yScale(d.value))
  .attr("r", 4)
  .attr("fill", "tomato");
