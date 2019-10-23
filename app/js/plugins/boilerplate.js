var margin = {top:25, right:0, bottom:25, left:25};

// var colors = {
//     bold: ["#d51e2d", "#52CFE5", "#385775", "#FFBF3D", "#6f2b6e", "#00CFB5"],
//     pastel: ["#e59097", "#c0adcc", "#b3cadd", "#a3ceaf", "lavender", "aquamarine", "gold"],
//     procon: ["#ce0201", "#a5d65a"],
//     political: ["#D41B2C", "#006EB5"]
// }

var colors = {
    bold: ["#d51e2d", "#52CFE5", "#385775", "#FFBF3D", "#6f2b6e", "#00CFB5"],
    pastel: ["#e59097", "#c0adcc", "#b3cadd", "#a3ceaf", "lavender", "aquamarine", "gold"],
    procon: ["#cc0000", "#808080"],
    political: ["#D41B2C", "#006EB5"]
}


d3.json('/interactive/2018/10/bubble/data/aggregated.json')
  .then(function(data) {

  columnTemplate(data, "#column");

  columnResponsiveTemplate(data, "#columnresponsive");

  groupedColumnTemplate(data, "#groupedcolumn");

  lineTemplate(data, "#line");

  lineResponsiveTemplate(data, "#lineresponsive");

  multiLineTemplate(data, "#multiline");

    barTemplate(data, "#bar");

   groupedBarTemplate(data, "#groupedbar");

   stackedColumnTemplate(data, "#stackedcolumn");

      stackedBarTemplate(data, "#stackedbar");

     scatterTemplate(data, "#scatter");

     dotTemplate(data, "#dot");

}).catch(function(error){
   // handle error
});
