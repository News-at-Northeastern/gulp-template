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
    procon: ["#cc0000", "#808080", "#000"],
    political: ["#D41B2C", "#006EB5"]
}


d3.json('/interactive/2018/10/bubble/data/aggregated.json')
  .then(function(data) {

      waffleChart(data, ".waffle");



}).catch(function(error){
   // handle error
});

function waffleChart(data, targetElement){
    console.log(data);
    var waffle = d3.select('.waffle');

      // Create an array with numbers 0 - 99
      var numbers = d3.range(106);

      // For each item in the array, add a div element
      // if the number is < 5, color it red, otherwise gray
      waffle
      	.selectAll('.block')
      	.data(numbers)
      	.enter()
      	.append('div')
      	.attr('class', 'block')
        .style('background-color', function(d){

          if(d < 50){
            return "#FE4A49";
          }
          else{
            return "#CCCCCC";

          }
        });
}
