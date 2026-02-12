const data = [];

d3.selectAll("#data tbody tr").each(function () {
  const cells = d3.select(this).selectAll("td");
  data.push({
    date: parseInt(cells.nodes()[0].textContent),
    //  date: new Date(cells.nodes()[0].textContent),
    value: cells.nodes()[1].textContent,
  });
});

if (data) console.log("Les données on été chargées");

const width = 500;
const height = 300;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };

//  d3.select("table#data").remove();

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

console.log(x.domain());

const y = d3.scaleLinear(
  [0, d3.max(data, (d) => d.value)],
  [height - margin.bottom, margin.top]
);

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
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", line(data));
