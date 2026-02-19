const data = [];
const tip = [];
// Je récupère les données contenues dans le html
d3.selectAll("#data tbody tr").each(function () {
  const cells = d3.select(this).selectAll("td");
  data.push({
    date: parseInt(cells.nodes()[0].textContent), // l'axes des x
    protocol: cells.nodes()[1].textContent.trim(), // la couleur de la ligne
    value: cells.nodes()[2].textContent.trim(), // l'axe des y
  });
});

d3.selectAll("#tip tbody tr").each(function () {
  const cells = d3.select(this).selectAll("td");
  tip.push({
    date: parseInt(cells.nodes()[0].textContent), // l'axes des x
    name: cells.nodes()[1].textContent.trim(), // la couleur de la ligne
    classification: cells.nodes()[2].textContent.trim(), // l'axe des y
  });
});
// Je supprimer ces données je n'en ai plus besoin
d3.select("#data").remove();
d3.select("#tip").remove();

console.log("Les données ont été chargées : ");
console.log(data);
console.log(tip);

// Variable utiles
const width = 1500;
const height = 900;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };

// On ajoute une balise svg dans la <div id=tab> </div>
const svg = d3
  .select("div#tab")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("class", "chart");

// attr = défini une propriété de la balise

const x = d3
  .scaleLinear()
  .domain(d3.extent(data, (d) => d.date))
  .range([margin.left, width - margin.right]);

const y = d3.scaleLinear(
  [0, d3.max(data, (d) => d.value)],
  //[0, 30],
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
      .attr("y", 40)
      .text("temps écoulé depuis le début (en jours)")
      .attr("class", "axis")
  );

// Add the y-axis, remove the domain line, add grid lines and a label.
svg
  .append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(height / 40))
  .call((g) =>
    g
      .append("text")
      .attr("x", -margin.left)
      .attr("y", 10)
      .attr("text-anchor", "start")
      .attr("class", "axis")
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

/*
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
*/
const t = 5;

tip.forEach((element) => {
  svg
    .append("line")
    .attr("x1", x(element.date))
    .attr("x2", x(element.date))
    .attr("y1", y(0)) // bas du graphique
    .attr("y2", y(100)) // haut du graphique
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4 2"); // optionnel pour un style pointillé
  svg
    .append("text")
    .attr("x", x(element.date)) // même x que la barre
    .attr("y", y(100)) // légèrement au-dessus de la barre
    .attr("text-anchor", "middle") // centrer le texte sur la barre
    .attr("fill", "black")
    .text(element.classification);
});
