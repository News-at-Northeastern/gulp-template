function stackedColumnTemplate(data, targetElement){

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4;

    var svg = d3.select(targetElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleBand()
              // .domain(data.map(function(d) {
              //     return d.candidate;
              // }))
              .range([0, width - margin.left - margin.right])
              .padding(0.33);

    var y = d3.scaleLinear()
              .range([height, 0])
              .nice();

   // var colorscale = d3.scaleOrdinal()
   //                   .range(colors.procon);
   var colorscale = d3.scaleOrdinal()
    .range(colors.procon);

    var keys = [];
    for(key in data[0]){
        if(key == "negative" || key == "positive"){
            keys.push(key);
        }
    }

    // console.log(keys);

    data.forEach(function(d){
      d.total = 0;
      keys.forEach(function(k){
        d.total += d[k];
      })
    });


    data.sort(function(a, b) {
      return b.total - a.total;
    });

    x.domain(data.map(function(d){
        // console.log(d.candidate);
        return d.candidate;
    }));

    y.domain([0, d3.max(data, function(d){
      // console.log(d.total);
        return d.total;
    })]);



    var xAxis = d3.axisBottom(x)
                  .tickSize(0);
        // .tickSize(-height);

    var yAxis = d3.axisLeft(y)
             .ticks(10)
             .tickSize(-width);
                  // .ticks(7)
                  // .tickSize(-width);
                  // var colorscale = d3.scaleOrdinal()
                  //     .domain(["negative", "positive"])
                  //     .range(["red", "#8a89a6"]);
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

      svg.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
          .style("font-size", "14px")
          .call(customXAxis);
          // .selectAll(".tick:not(:first-of-type) line")
          // .attr("stroke-opacity", 0);

      svg.append("g")
          .attr("class", "yAxis")
          .style("font-size", "12px")
          .call(customYAxis);

// colorscale.domain(keys);
   svg.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
      .attr("fill", function(d) {
     return colorscale(d.key);
     })
      .selectAll("rect")
      .data(function(d){
         // console.log(d);
         return d;
      })
      .enter().append("rect")
      .attr("x", function(d){
         return x(d.data.candidate);
      })
      .attr("y", function(d){
         // console.log(y(d[0]) -y(d[1]));
         return y(d[1]);
      })
      .attr("height", function(d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth())
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
        // console.log(keys[0]);
        // console.log(d.data);
        // console.log(keys);
        // console.log(this);
        // console.log(d3.select(event.currentTarget));

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
    // var

   svg.selectAll(".text")
      // .data(d3.stack().keys(keys)(data))
      .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("fill", "#000")
      .attr("x", function(d,i){
         return x(d.candidate) + (x.bandwidth()/2 - 10);
      })
      .attr("y", function(d){
         return y(d.total) -5;
      })
      .text(function(d){
         return d.total;
      });


      // svg.selectAll(".text")
      //    // .data(d3.stack().keys(keys)(data))
      //    .data(data)
      //    .enter().append("text")
      //    .attr("class", "label")
      //    .attr("fill", "#000")
      //    .attr("x", function(d,i){
      //       return x(d.candidate) + (x.bandwidth()/2 - 10);
      //    })
      //    .attr("y", function(d){
      //       return y(d.negative) - y(d.negative)/4;
      //    })
      //    .text(function(d){
      //       return d.negative;
      //    });

      // console.log(keys[0]);

         svg.selectAll(".text")
            // .data(d3.stack().keys(keys)(data))
            .data(data)
            .enter().append("text")
            .attr("class", "label")
            .attr("fill", "#e6e6e6")
            .attr("x", function(d,i){
               return x(d.candidate) + (x.bandwidth()/2 - 10);
            })
            .attr("y", function(d){
               // console.log(height - y(d.negative) );
               return y(d.negative) - ((height - y(d.positive))/2);
            })
            .text(function(d){
               return d.positive;
            });


            svg.selectAll(".text")
               // .data(d3.stack().keys(keys)(data))
               .data(data)
               .enter().append("text")
               .attr("class", "label")
               .attr("fill", "#e6e6e6")
               .attr("x", function(d,i){
                  return x(d.candidate) + (x.bandwidth()/2 - 10);
               })
               .attr("y", function(d){

                  return (y(d.negative) + y(0))/2;
               })
               .text(function(d){
                  return d.negative;
               });


}
