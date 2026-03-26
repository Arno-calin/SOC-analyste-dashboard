const spec = "{{ url_for('static', filename='specTest.json') }}"; // fichier JSON

vegaEmbed("#vis", spec)
  .then((result) => console.log("Graphique chargé"))
  .catch(console.error);

fetch(spec)
  .then((res) => res.json())
  .then((json) => {
    document.getElementById("editor").value = JSON.stringify(json, null, 2);
  });
function updateVis() {
  const text = document.getElementById("editor").value;

  try {
    const spec = JSON.parse(text);
    vegaEmbed("#vis", spec).then((result) =>
      console.log("Graphique mis à jour")
    );
  } catch (e) {
    alert("JSON invalide !");
  }
}
