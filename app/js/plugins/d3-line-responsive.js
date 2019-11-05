function lineResponsiveTemplate(data, targetElement){

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4,
     margin = {top: 20, right: 40, bottom: 30, left: 40};

     var x = d3.scaleBand()
         .domain(data.map(function(d) { return d.candidate; }))
         .range([0, width - margin.left - margin.right])
         .padding(0.33);

     var y = d3.scaleLinear()
         .domain([0, d3.max(data, function(d) { return d.positive; })])
         .range([height, 0])
         .nice();

     var svg = d3.select(targetElement).append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")");

   var xAxis = d3.axisBottom(x)
                 .tickFormat(function(d,i){

                     if(width <= 250){
                          return i%4 !== 0 ? " ": d;
                     }
                     else if(width <= 500){
                          return i%2 !== 0 ? " ": d;
                     }
                     else{
                         return d;
                     }

                   })
                   // .tickFormat(function(d, i){
                   //       return i%4 !== 0 ? " ": d;
                   //   })
                   .tickSize(0);

   var yAxis = d3.axisLeft(y)
                 .ticks(7)
                 .tickSize(-width);

 svg.append("g")
     .attr("class", "xAxis");

 svg.append("g")
     .attr("class", "yAxis");


 function customXAxis(g) {
   g.call(xAxis);
   g.select(".domain").remove();
 }

 function customYAxis(g) {
   var s = g.selection ? g.selection() : g;
   g.call(yAxis);
   s.select(".domain").remove();
   s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
   s.selectAll(".tick text").attr("x", 10).attr("dy", -4);
   // if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
 }

   var line = d3.line()
     .x(function(d) { return x(d.candidate) + 50})
     .y(function(d) { return y(d.positive) });

     svg.append("path")
           .datum(data)
           .attr("class", "line")
           .attr("fill", "none")
           .attr("stroke", "#cc0000")
           .attr("stroke-width", 2)
           .attr("d", line) ;

           var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

     svg.selectAll(".dot")
         .data(data)
         .enter().append("circle")
         .attr("classs", "dot")
         .attr("cx", function(d, i){
           return x(d.candidate) + 50;
         })
         .attr("cy", function(d,i){
           return y(d.positive);
         })
         .attr("r", 3)
         .attr("fill", "#cc0000")
         .on('mouseover, mousemove', function(d){
             d3.select(this)
               .attr("fill", "#f08080")
               .attr("r", 5);

             // var target = d3.select(targetElement + ' .tiptarget')
             // .attr('dx', d3.event.pageX + "px")
             // .attr('dy', d3.event.pageY + "px") // 5 pixels above the cursor
             // .node();
             // tooltip.show(d, target);
             //
             // console.log(d.candidate + ":" + d.positive);

             div.transition().style("opacity", .7);

             div.html(d.candidate + ": " + d.positive)
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY -28) + "px");
         })
         .on('mouseout', function(d,i){
           d3.select(this)
           .attr("fill", "#cc0000")
           .attr("r", 3);
           div.transition().style("opacity", 0);

           // tooltip.hide();
         });


     function resize(){

         width = d3.select(targetElement).node().getBoundingClientRect().width,
         width = width - margin.left - margin.right;

         x.range([0, width]);
         y.range([height, 0]);

         svg.select(".xAxis")
             .attr("transform", "translate(10," + (height + 5) + ")")
             .style("font-size", "14px")
             .call(customXAxis);

             svg.select(".yAxis")
             .style("font-size", "12px")
             // .attr("stroke-opacity", 0.5)
             // .attr("stroke-dasharray", "2,2")
             .call(customYAxis);

         line
           .x(function(d) { return x(d.candidate) + 50})
           .y(function(d) { return y(d.positive) });

         // svg.append("path")
         //       .datum(data)
         //       .attr("fill", "none")
         //       .attr("stroke", "#cc0000")
         //       .attr("stroke-width", 2)
         //       .attr("d", line) ;

         svg.selectAll(".line")
            .attr("d", line);


        svg.selectAll("circle")
            .attr("cx", function(d, i){
              return x(d.candidate) + 50;
            })
            .attr("cy", function(d,i){
              return y(d.positive);
          })
          .on('mouseover, mousemove', function(d){
              d3.select(this)
                .attr("fill", "#f08080")
                .attr("r", 5);

              // var target = d3.select(targetElement + ' .tiptarget')
              // .attr('dx', d3.event.pageX + "px")
              // .attr('dy', d3.event.pageY + "px") // 5 pixels above the cursor
              // .node();
              // tooltip.show(d, target);
              //
              // console.log(d.candidate + ":" + d.positive);

              div.transition().style("opacity", 1.0);

              div.html(d.candidate + ": " + d.positive)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY -28) + "px");
          })
          .on('mouseout', function(d,i){
            d3.select(this)
            .attr("fill", "#cc0000")
            .attr("r", 3);
            div.transition().style("opacity", 0);

            // tooltip.hide();
          });


     }

     resize();
     d3.select(window).on('resize', resize);
}
