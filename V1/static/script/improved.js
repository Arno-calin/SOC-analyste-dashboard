import { pointColors, lineColors } from "./utils.js";

const data = [];
const tipU = [];
const tipL = [];
// Je récupère les données contenues dans le html
d3.selectAll("#data tbody tr").each(function () {
  const cells = d3.select(this).selectAll("td");
  data.push({
    date: new Date(cells.nodes()[0].textContent), // L'axe des x
    alert: cells.nodes()[1].textContent.trim(), // la couleur de la ligne
    number: parseInt(cells.nodes()[2].textContent.trim()), // l'axe des y
  });
});

d3.selectAll("#tipUnique tbody tr").each(function () {
  const cells = d3.select(this).selectAll("td");
  tipU.push({
    date: new Date(cells.nodes()[0].textContent),
    name: cells.nodes()[1].textContent.trim(),
    type: cells.nodes()[2].textContent.trim(),
    isDefault: cells.nodes()[3].textContent.trim(),
  });
});

d3.selectAll("#tipLongue tbody tr").each(function () {
  const cells = d3.select(this).selectAll("td");
  tipL.push({
    start: new Date(cells.nodes()[0].textContent),
    end: new Date(cells.nodes()[1].textContent),
    name: cells.nodes()[2].textContent.trim(),
    type: cells.nodes()[3].textContent.trim(),
    isDefault: cells.nodes()[4].textContent.trim(),
  });
});
console.log(tipU);
// On supprime ces données je n'en ai plus besoin
d3.select("#data").remove();
d3.select("#startDate").attr("value", data[0].date.toISOString().slice(0, 10));
d3.select("#endDate").attr(
  "value",
  data[data.length - 1].date.toISOString().slice(0, 10)
);
d3.select("#tipUnique").remove();
d3.select("#tipLongue").remove();

console.log("Les données ont été chargées");
//console.log(data);

// Variable utiles
const width = 1500;
const height = 900;
const margin = { top: 20, right: 20, bottom: 80, left: 100 };

// On ajoute une balise svg dans la <div id=tab> </div>
const svg = d3
  .select("section#tab")
  .append("svg")
  // attr = défini une propriété de la balise
  .attr("width", width + 0)
  .attr("height", height + 200)
  .attr("viewBox", [0, 0, width, height])
  // Ici on définit la classe pour donner le relais au css
  .attr("class", "chart");

// On crée l'axe des X avec les dates
const x = d3.scaleUtc(
  d3.extent(data, (d) => d.date),
  [margin.left, width - margin.right]
);

// On crée l'axe des Y avec la quantité
const y = d3.scaleLinear(
  [0, d3.max(data, (d) => d.number)],
  //[0, 300],
  [height - margin.bottom, margin.top]
);

// Grouper par protocole
const groupedData = d3.group(data, (d) => d.alert);
const eventGrouped = d3.group([...tipU, ...tipL], (d) => d.type);

// Sélectionner la popup
const popup = d3.select("#popup");

// Ajouter un select
const select = popup
  .append("select")
  .attr("id", "myDropdown")
  .style("margin", "10px 0");

// Ajouter les options
select
  .selectAll("option")
  .data(eventGrouped.keys())
  .enter()
  .append("option")
  .attr("value", (d) => d)
  .text((d) => d);
// Créer le lien alert et couleur
const color = d3.scaleOrdinal(lineColors).domain([...groupedData.keys()]); // ici la clé est le type d'alerte

// Idem avec le type d'événement
const eventColor = d3
  .scaleOrdinal(pointColors)
  .domain([...eventGrouped.keys()]); // ici la clé est le type type

// Créer une fonction pour tracer les lignes du graphe
const line = d3
  .line()
  .x((d) => x(d.date))
  .y((d) => y(d.number));

// Add the x-axis.
svg
  .append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .attr("id", "x")
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
      .attr("y", margin.bottom)
      .text("temps écoulé")
      .attr("id", "x-name")
  );

// Add the y-axis
const yAxis = svg
  .append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .attr("id", "y")
  .call(
    d3
      .axisLeft(y)
      .ticks(height / 80)
      .tickFormat((d) => (d === 0 ? "" : d))
  );
yAxis
  .append("text")
  .attr("transform", "rotate(-90)") // rotation 90° vers la gauche
  .attr("x", -height / 2) // centré verticalement
  .attr("y", -margin.left / 2 - 10) // décalage depuis l’axe
  .attr("text-anchor", "middle") // texte centré
  .attr("id", "y-name")
  .text("Nombre d'alertes");

// Append a path for the line.
svg
  .selectAll(".line")
  .data(groupedData)
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", (d) => color(d[0])) // d[0] = protocol
  .attr("stroke-width", 1.5)
  .attr("id", (d) => d[0])
  .attr("d", (d) => line(d[1])); // d[1] = tableau des valeurs

// Création de la légende
// Conteneur de la légende
// SVG pour la légende
const legendEvent2 = d3
  .select("section#legends")
  .append("div")
  .attr("class", "legend");

// Titre
legendEvent2
  .append("div")
  .attr("class", "legend-title")
  .text("Légende des alertes");

const typeEvent2 = [...groupedData.keys()];

const legendItemsEvent2 = legendEvent2
  .selectAll(".legend-item")
  .data(typeEvent2)
  .enter()
  .append("div")
  .attr("class", "legend-item");

legendItemsEvent2
  .append("div")
  .attr("class", "legend-color")
  .style("background-color", (d) => color(d));

legendItemsEvent2
  .append("div")
  .attr("class", "legend-label")
  .text((d) => d);

// Conteneur de la légende
const legendEvent = d3
  .select("section#legends")
  .append("div")
  .attr("class", "legend");

// Titre
legendEvent
  .append("div")
  .attr("class", "legend-title")
  .text("Légende des événements");

const typeEvent = [...eventGrouped.keys()];

const legendItemsEvent = legendEvent
  .selectAll(".legend-item")
  .data(typeEvent)
  .enter()
  .append("div")
  .attr("class", "legend-item");

legendItemsEvent
  .append("div")
  .attr("class", "legend-color")
  .style("background-color", (d) => eventColor(d));

legendItemsEvent
  .append("div")
  .attr("class", "legend-label")
  .text((d) => d);

// Ligne verticale (cachée au départ)
const verticalLine = svg
  .append("line")
  .attr("y1", y(0))
  .attr("y2", y(d3.max(data, (d) => d.number)))
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .style("opacity", 0)
  .attr("stroke-dasharray", "4 2"); // optionnel pour un style pointillé
const unkown = svg
  .append("text")
  .attr("x", x)
  .attr("y", y(d3.max(data, (d) => d.number)) - 5)
  .style("opacity", 0)
  .attr("text-anchor", "middle") // centrer le texte sur la barre
  .text("?");

// Zone de capture des événements souris
let PosX;
let CurrentDate;
svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("fill", "none")
  .attr("pointer-events", "all")
  .on("mouseover", () => {
    verticalLine.style("opacity", 1);
    unkown.style("opacity", 1);
    d3.select("#alert").style("opacity", 1); // ou utiliser d pour contenu dynamique
  })
  .on("mouseout", () => {
    verticalLine.style("opacity", 0);
    unkown.style("opacity", 0);
    d3.select("#alert").style("opacity", 0);
  })
  .on("mousemove", function (event) {
    let [xClick] = d3.pointer(event);
    if (xClick < 0 + margin.left) xClick = 0 + margin.left;
    else if (xClick > width - margin.right) xClick = width - margin.right;
    verticalLine.attr("x1", xClick).attr("x2", xClick);
    unkown.attr("x", xClick);
    const text = x.invert(xClick).toISOString().slice(0, 10);
    d3.select("#alert")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px")
      .html(text);
  })
  .on("click", function (event) {
    let [xClick] = d3.pointer(event);
    d3.select("#alert").style("opacity", 0);
    xClick = Math.max(margin.left, Math.min(width - margin.right, xClick));
    PosX = xClick;
    const [xPop, yPop] = d3.pointer(event);
    CurrentDate = x.invert(xPop);
    d3.select("#popup")
      .style("display", "block")
      .style("left", xPop + 10 + "px")
      .style("top", yPop + 10 + "px");
    d3.select("#userInput").node().focus();
  });

d3.select("#saveBtn").on("click", function () {
  const textValue = d3.select("#userInput").property("value");
  const dropdownValue = d3.select("#myDropdown").property("value");
  if (textValue === "") {
    document.getElementById("popup").style.display = "none";

    return;
  }
  fetch("/new_event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: textValue.trim(),
      choice: dropdownValue,
      date: CurrentDate.toISOString().slice(0, 10),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("success");
        window.location.reload();
      } else {
        alert("Erreur : " + data.message);
      }
    });
  /*
  if (value.value !== "")
    svg
      .append("line")
      .attr("x1", PosX)
      .attr("x2", PosX)
      .attr("y1", y(0))
      .attr("y2", y(d3.max(data, (d) => d.number)))
      .attr("stroke", "black")
      .attr("stroke-dasharray", "4 2"); // optionnel pour un style pointillé

  value.value = "";
  document.getElementById("popup").style.display = "none";
  */
});
// Tip unique date
tipU.forEach((element) => {
  svg
    .append("line")
    .classed("tip", true)
    .classed(element.type, true)
    .classed(element.isDefault === "True" ? "default" : "perso", true)
    .attr("x1", x(element.date))
    .attr("x2", x(element.date))
    .attr("y1", y(0)) // bas du graphique
    .attr("y2", y(d3.max(data, (d) => d.number))) // haut du graphique
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4 2"); // optionnel pour un style pointillé

  svg
    .append("text")
    .classed("tip", true)
    .classed("tip-name", true)
    .classed(element.type, true)
    .classed(element.isDefault === "True" ? "default" : "perso", true)
    .attr("x1", x(element.date))
    .attr("x", x(element.date)) // même x que la barre
    .attr("y", y(d3.max(data, (d) => d.number)) - 5) // légèrement au-dessus de la barre
    .attr("text-anchor", "middle") // centrer le texte sur la barre
    .attr("fill", eventColor(element.type))
    .text(element.name);
});
const lineOffset = 20; // décalage vertical entre les lignes
const yBase = y(d3.max(data, (d) => d.number)); // hauteur de départ
let countOffset;
let lastEnd = [0];
let currentStart;
// Tip longue date
tipL.forEach((element) => {
  currentStart = element.start;
  const index = lastEnd.findIndex((valeur) => valeur < currentStart);
  if (index === -1) {
    lastEnd.push(element.end);
    countOffset += lastEnd.length - 1;
  } else {
    lastEnd[index] = element.end;
    countOffset = index;
  }
  let currentY = yBase - (countOffset + 1) * lineOffset;
  svg
    .append("line")
    .classed("tip", true)
    .classed(element.type, true)
    .classed(element.isDefault === "True" ? "default" : "perso", true)
    .attr("x1", x(element.start))
    .attr("x2", x(element.end))
    .attr("y1", currentY)
    .attr("y2", currentY)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4 2"); // optionnel pour un style pointillé

  svg
    .append("text")
    .classed("tip", true)
    .classed("tip-name", true)
    .classed(element.type, true)
    .classed(element.isDefault === "True" ? "default" : "perso", true)
    .data(typeEvent)
    .attr(
      "x",
      x(new Date((element.start.getTime() + element.end.getTime()) / 2))
    ) // même x que la barre
    .attr("y", currentY - 5) // légèrement au-dessus de la barre
    .attr("text-anchor", "middle") // centrer le texte sur la barre
    .attr("fill", eventColor(element.type))
    .text(element.name);
});

d3.select("#Total-check").on("change", function () {
  d3.select("#Total").style("display", this.checked ? null : "none");
});
d3.select("#EDR-check").on("change", function () {
  d3.select("#EDR").style("display", this.checked ? null : "none");
});
d3.select("#IDS-check").on("change", function () {
  d3.select("#IDS").style("display", this.checked ? null : "none");
});
d3.select("#recurrent").on("change", function () {
  d3.selectAll(".recurrent").style("display", this.checked ? null : "none");
});
d3.select("#interne").on("change", function () {
  d3.selectAll(".interne").style("display", this.checked ? null : "none");
});
d3.select("#scolaire").on("change", function () {
  d3.selectAll(".scolaire").style("display", this.checked ? null : "none");
});
d3.select("#legend-perso").on("change", function () {
  d3.selectAll(".perso").style("display", this.checked ? null : "none");
});
d3.select("#legend-default").on("change", function () {
  d3.selectAll(".default").style("display", this.checked ? null : "none");
});
const button = d3.select("#suppr-perso").on("click", () => {
  fetch("/suppr_perso", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.reload();
    })
    .catch((err) => {
      console.error("Erreur :", err);
    });
});
d3.selectAll(".tip-name")
  .on("mouseover", function (event, d) {
    const contenu = d3.select(this).html(); // ou .text() si tu veux juste le texte
    const obj = tipU.find((d) => d.name === contenu);
    if (obj) {
      const text = obj.name + "<br>" + obj.date.toISOString().slice(0, 10);
      d3.select("#event").style("opacity", 1).html(text); // ou utiliser d pour contenu dynamique
    } else {
      const obj = tipL.find((d) => d.name === contenu);
      const text =
        obj.name +
        "<br>" +
        obj.start.toISOString().slice(0, 10) +
        " -> " +
        obj.end.toISOString().slice(0, 10);
      d3.select("#event").style("opacity", 1).html(text); // ou utiliser d pour contenu dynamique
    }
  })
  .on("mousemove", function (event) {
    d3.select("#event")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px");
  })
  .on("mouseout", function () {
    d3.select("#event").style("opacity", 0);
  });
document.getElementById("startDate").addEventListener("change", () => {
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);

  let Dstart = new Date(start);
  let Dend = new Date(end);

  // Vérifier et corriger si start > end
  if (start > end) {
    // Option 1 : swapper automatiquement
    return;
  }
  updateChart(Dstart, Dend);
});

document.getElementById("endDate").addEventListener("change", () => {
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);

  let Dstart = new Date(start);
  let Dend = new Date(end);

  // Vérifier et corriger si start > end
  if (Dstart > Dend) {
    // Option 1 : swapper automatiquement
    return;
  }
  updateChart(start, end);
});
function updateChart(newStartDate, newEndDate) {
  // Filtrer les données
  const filtered = data.filter(
    (d) => d.date >= newStartDate && d.date <= newEndDate
  );
  const filteredData = d3.group(filtered, (d) => d.alert);
  x.domain([newStartDate, newEndDate]);

  svg
    .select("#x")
    .transition()
    .duration(750)
    .call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );

  d3.selectAll("path").remove();
  d3.selectAll(".tip").remove();

  svg
    .selectAll(".line")
    .data(filteredData)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", (d) => color(d[0])) // d[0] = protocol
    .attr("stroke-width", 1.5)
    .attr("id", (d) => d[0])
    .attr("d", (d) => line(d[1])); // d[1] = tableau des valeurs

  // Tip unique date
  tipU
    .filter((d) => d.date >= newStartDate && d.date <= newEndDate)
    .forEach((element) => {
      svg
        .append("line")
        .classed("tip", true)
        .classed(element.type, true)
        .classed(element.isDefault === "True" ? "default" : "perso", true)
        .attr("x1", x(element.date))
        .attr("x2", x(element.date))
        .attr("y1", y(0)) // bas du graphique
        .attr("y2", y(d3.max(data, (d) => d.number))) // haut du graphique
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 2"); // optionnel pour un style pointillé

      svg
        .append("text")
        .classed("tip", true)
        .classed("tip-name", true)
        .classed(element.type, true)
        .classed(element.isDefault === "True" ? "default" : "perso", true)
        .attr("x1", x(element.date))
        .attr("x", x(element.date)) // même x que la barre
        .attr("y", y(d3.max(data, (d) => d.number)) - 5) // légèrement au-dessus de la barre
        .attr("text-anchor", "middle") // centrer le texte sur la barre
        .attr("fill", eventColor(element.type))
        .text(element.name);
    });
  const lineOffset = 20; // décalage vertical entre les lignes
  const yBase = y(d3.max(data, (d) => d.number)); // hauteur de départ
  let countOffset;
  let lastEnd = [0];
  let currentStart;
  // Tip longue date
  tipL
    .filter((d) => d.start >= newStartDate && d.end <= newEndDate)
    .forEach((element) => {
      currentStart = element.start;
      const index = lastEnd.findIndex((valeur) => valeur < currentStart);
      if (index === -1) {
        lastEnd.push(element.end);
        countOffset = lastEnd.length - 1;
      } else {
        lastEnd[index] = element.end;
        countOffset = index;
      }
      let currentY = yBase - countOffset * lineOffset;
      svg
        .append("line")
        .classed("tip", true)
        .classed(element.type, true)
        .classed(element.isDefault === "True" ? "default" : "perso", true)
        .attr("x1", x(element.start))
        .attr("x2", x(element.end))
        .attr("y1", currentY)
        .attr("y2", currentY)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 2"); // optionnel pour un style pointillé

      svg
        .append("text")
        .classed("tip", true)
        .classed("tip-name", true)
        .classed(element.type, true)
        .classed(element.isDefault === "True" ? "default" : "perso", true)
        .data(typeEvent)
        .attr(
          "x",
          x(new Date((element.start.getTime() + element.end.getTime()) / 2))
        ) // même x que la barre
        .attr("y", currentY - 5) // légèrement au-dessus de la barre
        .attr("text-anchor", "middle") // centrer le texte sur la barre
        .attr("fill", eventColor(element.type))
        .text(element.name);
    });
}
