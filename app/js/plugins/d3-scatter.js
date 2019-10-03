function scatterTemplate(data, targetElement){

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4;

     margin = {top: 20, right: 20, bottom: 30, left: 80};

     var svg = d3.select(targetElement).append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform",
             "translate(" + margin.left + "," + margin.top + ")");

             // Add X axis
               var x = d3.scaleLinear()
                 .domain([0, d3.max(data, function(d) {

                     return d.negative + 100;

                 })])
                 .range([ 0, width ]);

                 // Add Y axis
                 var y = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) {
                       return d.positive + 100;
                   })])
                   .range([ height, 0]);

               svg.append("g")
                 .attr("transform", "translate(0," + height + ")")
                 .call(d3.axisBottom(x));


               svg.append("g")
                 .call(d3.axisLeft(y));


            svg.append("g")
               .selectAll("dot")
               .data(data)
               .enter().append("circle")
              .attr("cx", function(d){
                  return x(d.negative);
              })
              .attr("cy", function(d){
                  return y(d.positive);
              })
              .attr("r", 5)
              .style("fill", "#cc0000");



}
