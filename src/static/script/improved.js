const data = [];
data.push({ date: 7, protocol: "DNS", value: "0" });

d3.selectAll("#data tbody tr").each(function () {
  const cells = d3.select(this).selectAll("td");
  data.push({
    date: parseInt(cells.nodes()[0].textContent),
    protocol: cells.nodes()[1].textContent.trim(),
    //  date: new Date(cells.nodes()[0].textContent),
    value: cells.nodes()[2].textContent.trim(),
  });
});

data.push({ date: 9, protocol: "DNS", value: "0" });
console.log(data);

const width = 500;
const height = 300;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };

d3.select("table#data").remove();

const svg = d3
  .select("div#tab")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
/*
const x = d3.scaleUtc(
  d3.extent(data, (d) => d.date),
  [margin.left, width - margin.right]
);*/
const x = d3
  .scaleLinear()
  .domain(d3.extent(data, (d) => d.date))
  .range([margin.left, width - margin.right]);

const y = d3.scaleLinear(
  //[0, d3.max(data, (d) => d.value)],
  [0, 30],
  [height - margin.bottom, margin.top]
);

// Grouper par protocole
const groupedData = d3.group(data, (d) => d.protocol);

const color = d3
  .scaleOrdinal(d3.schemeCategory10)
  .domain([...groupedData.keys()]);

const line = d3
  .line()
  .x((d) => x(d.date))
  .y((d) => y(d.value));

// Add the x-axis.
svg
  .append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(
    d3
      .axisBottom(x)
      .ticks(width / 80)
      .tickSizeOuter(0)
  )
  .call((g) =>
    g
      .append("text")

      .attr("x", width / 2)
      .attr("y", 30)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("temps écoulé depuis le début (en s)")
  );

// Add the y-axis, remove the domain line, add grid lines and a label.
svg
  .append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(height / 40))
  .call((g) => g.select(".domain").remove())
  .call((g) =>
    g
      .selectAll(".tick line")
      .clone()
      .attr("x2", width - margin.left - margin.right)
      .attr("stroke-opacity", 0.1)
  )
  .call((g) =>
    g
      .append("text")
      .attr("x", -margin.left)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("Nombre de requêtes")
  );

// Append a path for the line.
svg
  .selectAll(".line")
  .data(groupedData)
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", (d) => color(d[0])) // d[0] = protocol
  .attr("stroke-width", 1.5)
  .attr("d", (d) => line(d[1])); // d[1] = tableau des valeurs

const legend = svg
  .append("g")
  .attr("transform", `translate(${width - margin.left - 10}, 20)`);

const protocols = [...groupedData.keys()];

const legendItems = legend
  .selectAll(".legend-item")
  .data(protocols)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);

legendItems
  .append("rect")
  .attr("width", 12)
  .attr("height", 12)
  .attr("fill", (d) => color(d));

legendItems
  .append("text")
  .attr("x", 18)
  .attr("y", 6)
  .attr("dy", "0.35em")
  .text((d) => d)
  .style("font-size", "12px");
