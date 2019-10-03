function stackedBarTemplate(data, targetElement){

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4;

     margin = {top: 20, right: 20, bottom: 30, left: 80};

     var svg = d3.select(targetElement).append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform",
             "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width - margin.left - margin.right]);

    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.2);

   var colorscale = d3.scaleOrdinal().range(colors.procon);

   var keys = [];
   for(key in data[0]){
      if(key == "negative" || key == "positive"){
         keys.push(key);
      }
   }

   data.forEach(function(d){
     d.total = 0;
     keys.forEach(function(k){
       d.total += d[k];
     })
   });

   data.sort(function(a, b) {
     return b.total - a.total;
   });

   x.domain([0, d3.max(data, function(d) {
        return d.total + 100;
   })]);

   y.domain(data.map(function(d) {
            return d.candidate;
        }));

    colorscale.domain(keys);

    var xAxis = d3.axisBottom(x)
        .tickSize(-height);

    var yAxis = d3.axisLeft(y)
        .ticks(7)
        .tickSize(0);
    // .ticks(7)
    // .tickSize(-width);
    // create container SVG


    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "14px")
        .call(customXAxis);

    svg.append("g")
        .attr("class", "yAxis")
        .style("font-size", "12px")
        .call(customYAxis);

    function customXAxis(g){
      var s = g.selection ? g.selection() : g;
      g.call(xAxis);
      s.select(".domain").remove();
      s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
      // s.selectAll(".tick text").attr("x", 10).attr("dy", -4);
    }

    function customYAxis(g) {
    g.call(yAxis);
    g.select(".domain").remove();
    }

    svg.append("g")
       .selectAll("g")
       .data(d3.stack().keys(keys)(data))
       .enter().append("g")
       .attr("fill", function(d){
          return colorscale(d.key);
       })
       .selectAll("rect")
       .data(function(d){
          // console.log(d);
          return d;
       })
      .enter().append("rect")
      .attr("x", function(d){
         return x(d[0]);
      })
      .attr("y", function(d){
         return y(d.data.candidate);
      })
      .attr("height", y.bandwidth())
      .attr("width", function(d){
         return x(d[1]) - x(d[0]);
      })
      .on("mouseover, mousemove", function(d) {

          var subgroupName = d3.select(this.parentNode).datum().key;
          // console.log(subgroupName);

          if(subgroupName == "negative"){
             // console.log("hello");
             d3.select(this).attr("fill", "#f08080");

          }
          else{
             // console.log("not");
             d3.select(this).attr("fill", "#c0c0c0");
          }


      })
      .on("mouseout", function(d){
         var subgroupName = d3.select(this.parentNode).datum().key;

         if(subgroupName == "negative"){
            // console.log("hello");
            d3.select(this).attr("fill", "#cc0000");
        }
         else{
            // console.log("not");
            d3.select(this).attr("fill", "#808080");
         }

      });

      svg.selectAll(".text")
         // .data(d3.stack().keys(keys)(data))
         .data(data)
         .enter().append("text")
         .attr("class", "label")
         .attr("fill", "#000")
         .attr("y", function(d,i){
            return y(d.candidate) + (y.bandwidth()/2);
         })
         .attr("x", function(d){
            return x(d.total) + 5;
         })
         .text(function(d){
            return d.total;
         });


         svg.selectAll(".text")
            // .data(d3.stack().keys(keys)(data))
            .data(data)
            .enter().append("text")
            .attr("class", "label")
            .attr("fill", "#e6e6e6")
            .attr("y", function(d,i){
               return y(d.candidate) + (y.bandwidth()/2);
            })
            .attr("x", function(d){
               return (x(d.negative) + x(0))/2;
            })
            .text(function(d){
               return d.negative;
            });

            svg.selectAll(".text")
               // .data(d3.stack().keys(keys)(data))
               .data(data)
               .enter().append("text")
               .attr("class", "label")
               .attr("fill", "#e6e6e6")
               .attr("y", function(d,i){
                  return y(d.candidate) + (y.bandwidth()/2 );
               })
               .attr("x", function(d){
                  // console.log(height - y(d.negative) );
                  return (x(d.total) +x(d.negative))/2  ;
               })
               .text(function(d){
                  return d.positive;
               });






}
