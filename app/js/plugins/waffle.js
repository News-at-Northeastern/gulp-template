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
