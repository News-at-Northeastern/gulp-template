function groupedbarTemplate(data, targetElement) {
    var width = d3.select(targetElement).node().getBoundingClientRect().width;
        var height = width * 0.4;

         margin = {top: 20, right: 20, bottom: 30, left: 80};




        var yGrouping = d3.scaleBand()
            .domain(data.map(function(d) {
                return d.candidate;
            }))
            .range([height, 0])
            .padding(0.2);

        var yBar = d3.scaleBand()
            .domain(["negative", "positive"])
            .rangeRound([0, yGrouping.bandwidth()])
            .padding(0);

            var x = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) {
                    return d.positive ;
                })])
                .range([0, width - margin.left - margin.right])
                .nice();

        var xAxis = d3.axisBottom(x)
            .tickSize(-height);

        var yAxis = d3.axisLeft(yGrouping)
            // .ticks(7)
            .tickFormat(function(d) {
                return d;
            })
            .tickSize(0);

        var colorscale = d3.scaleOrdinal()
            .domain(["negative", "positive"])
            .range(colors.procon);

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

        // .ticks(7)
        // .tickSize(-width);
        // create container SVG
        var svg = d3.select(targetElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .style("font-size", "14px")
            .call(customXAxis);

        svg.append("g")
            .attr("class", "yAxis")
            .style("font-size", "12px")
            .call(customYAxis);


      svg.append("g")
         .selectAll("g")
         .data(data)
         .enter().append("g")
         .attr("transform", function(d){
             // return 'translate(' + yGrouping(d.candidate) + ',0)';
             return 'translate(0,' + yGrouping(d.candidate) +')';
         })
         .selectAll("rect")
         .data(function(d){

             return d3.entries(d).filter(function(dd) {
                 return dd.key == "negative" || dd.key == "positive";
             });
         })
         .enter().append("rect")
         .attr("width", function(d){
             return x(d.value) - x(0);
         })
         .attr("height", yBar.bandwidth())
         .attr("x", function(d,i){
             return x;
         })
         .attr("y", function(d){
             return yBar(d.key);
         })
         .attr("fill",
             function(d) {
                 return colorscale(d.key);
             })
         .on('mouseover, mousemove', function(d){
             if(d.key == "negative"){
                 d3.select(this).attr("fill", "#f08080");
             }
             else{
                 d3.select(this).attr("fill", "#c0c0c0");
             }

         })
         .on('mouseout', function(d,i){
             if(d.key == "negative"){
                 d3.select(this).attr("fill", "#cc0000");
             }
             else{
                 d3.select(this).attr("fill", "#808080");
             }
         });
         // var filtVal = d3.entries(d).filter(function(dd) {
         //     return dd.key == "negative" || dd.key == "positive";
         // })
      // svg.selectAll(".text")
      //     .data(data.filter(function(d){
      //         console.log(d3.entries(d).filter(function(dd) {
      //             return dd.key == "negative" || dd.key == "positive";
      //         }));
      //
      //         return d3.entries(d).filter(function(dd) {
      //             return dd.key == "negative" || dd.key == "positive";
      //         });
      //     }))
      //     .enter().append("text")
      //     .attr("class", "label")
      //      .attr("fill", "#000")
      //     .attr("x", function(d, i){
      //
      //         // return i * (width/(data.length));
      //         return x(d.positive);
      //     })
      //     .attr("y", function(d, i){
      //         // console.log(d);
      //         // return y(d.value);
      //         return yGrouping(d.candidate) + (yBar.bandwidth());
      //         // return height * i/12 ;
      //     })
      //     .text(function(d, i){
      //
      //         // console.log(d);
      //         var field = d3.entries(d).filter(function(dd) {
      //             return dd.key == "negative" || dd.key == "positive";
      //         });
      //         var values = Object.keys(field).map(function(key){
      //
      //
      //           console.log(key = "negative");
      //                return d[key];
      //
      //
      //         });
      //         console.log(values[0]);
      //
      //         // return d.positive + ":" + d.negative;
      //         return values;
      //     });
      svg.selectAll(".text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("fill", "#e6e6e6")
      .attr("x", function(d,i){
          return x(d.positive) - 50;
          // return i * (width/data.length);
      })
      .attr("y", function(d){
           // return (yGrouping(d.candidate) - yBar.bandwidth()/2)+ (yGrouping.bandwidth()) ;
           return yGrouping(d.candidate) + (yGrouping.bandwidth()- 7);
          // height - (d * 4);
      })
      // .attr("dy", ".75em")
      .text(function(d){
          return d.positive;
      });

      svg.selectAll(".text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("fill", "#e6e6e6")
      .attr("x", function(d,i){
          return x(d.negative) - 50;
          // return i * (width/data.length);
      })
      .attr("y", function(d){
        // return yGrouping(d.candidate) - (yGrouping.bandwidth() + 20);
           return (yGrouping(d.candidate) - yBar.bandwidth() ) + (yGrouping.bandwidth() - 5 ) ;
          // height - (d * 4);
      })
      // .attr("dy", ".75em")
      .text(function(d){
          return d.negative;
      });




}
