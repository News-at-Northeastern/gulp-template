function groupedResponsiveColumnTemplate(data, targetElement) {

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4;

    // this is to ensure that charts with fewer variables have extra breathing space between groups, instead of comically wide data bars
    // var groupPadScale = d3.scaleLinear()
    //     .domain([7,2])
    //     .range([0.2, 0.35]);

    // set the ranges
    var xGrouping = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.candidate;
        }))
        .rangeRound([0, width])
        .paddingInner(0.25)
        .paddingOuter(0.25);

    var xBar = d3.scaleBand()
        .domain(["negative", "positive"])
        .rangeRound([0, xGrouping.bandwidth()])
        .padding(0);


    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.positive;
        })])
        .range([height, 0])
        .nice();

    var xAxis = d3.axisBottom(xGrouping)
        .tickFormat(function(d) {
            return d;
        })
        .tickSize(0);

    var yAxis = d3.axisLeft(y)
        .ticks(7)
        .tickSize(-width);

    var colorscale = d3.scaleOrdinal()
        .domain(["negative", "positive"])
        .range(colors.procon);


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
        // .call(d3.axisBottom(xGrouping));
        .call(customXAxis);

    svg.append("g")
        // .call(d3.axisLeft(y));
        .attr("class", "yAxis")
        .style("font-size", "12px")
        .call(customYAxis);


    // legend
    // svg.append("g")
    //       .attr("class", "legendOrdinalGroup")
    //       .attr("transform", "translate(" + ((width < 768) ? (width-225) : (width-350)) + ",0)");
    //
    // var legendOrdinalGroup = d3.legendColor()
    //   .shapeWidth((width < 768) ? 50 : 90)
    //   .shapeHeight(10)
    //   .shapePadding(15)
    //   .orient('horizontal')
    //   .scale(countrycolors)
    //   .labels(spellout.range())
    //   .labelWrap((width < 768) ? 50 : 90);
    //
    // svg.select(".legendOrdinalGroup")
    //   .call(legendOrdinalGroup);

    // create tooltip using d3-tip library
    // var tooltip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-10,0])
    //     .html(function(d) {
    //         return d.candidate + ": " + d.negative+ ", " + d.positive;
    //       });
    //
    // svg.append('circle').attr('class', 'tiptarget');
    // svg.call(tooltip);

    var div = d3.select("body").append("div")
   .attr("class", "tooltip")
   .style("opacity", 0);

    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
         .attr("class", "g")
        .attr("transform", function(d){
            return 'translate(' +xGrouping(d.candidate) + ',0)';
        })
        .selectAll("rect")
        .data(function(d) {

            // console.log(d3.entries(d).filter(function(dd) {
            //     return dd.key == "negative" || dd.key == "positive" || dd.key == "percent_positive";
            // }));

            return d3.entries(d).filter(function(dd) {
                return dd.key == "negative" || dd.key == "positive";
            });
        })
        .enter().append("rect")
        .attr("width", xBar.bandwidth())
        .attr("height", function(d){
            return y(0) - y(d.value);
        })
        .attr("x", function(d,i) {
            return xBar(d.key);
        })
        .attr("y", function(d) {

            return y(d.value);
        })
        .attr("fill",
            function(d) {
                return colorscale(d.key);
            })
        .on('mouseover, mousemove', function(d){

            div.transition().style("opacity", 1.0);
            div.html(d.key + ": " + d.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -28) + "px")
                .style("font-size", "15px");

            if(d.key == "negative"){
                d3.select(this).attr("fill", "#f08080");
            }
            else{
                d3.select(this).attr("fill", "#c0c0c0")
            }

        })
        .on('mouseout', function(d,i){

            div.transition().style("opacity", 0);

            if(d.key == "negative"){
                d3.select(this).attr("fill", "#cc0000");
            }
            else{
                d3.select(this).attr("fill", "#808080")
            }
        });

        function resizeGroupColumn(){

            width = d3.select(targetElement).node().getBoundingClientRect().width,
            width = width - margin.left - margin.right;

            console.log(width);

            xGrouping.rangeRound([0, width]);
            xBar.rangeRound([0, xGrouping.bandwidth()])
            y.range([height, 0]);

            svg.select(".xAxis")
                .attr("transform", "translate(0," + (height + 5) + ")")
                .style("font-size", "14px")
                .call(customXAxis);

                svg.select(".yAxis")
                .style("font-size", "12px")
                // .attr("stroke-opacity", 0.5)
                // .attr("stroke-dasharray", "2,2")
                .call(customYAxis);

                svg.selectAll(".g")
                .attr("transform", function(d){
                    return 'translate(' +xGrouping(d.candidate) + ',0)';
                });

                svg.selectAll("rect")
                    .attr("width", xBar.bandwidth())
                    .attr("x", function(d,i) {
                        return xBar(d.key);
                    });

        }

        resizeGroupColumn();
             d3.select(window).on('resize.three', resizeGroupColumn);
}



// function groupedResponsiveColumnTemplate(data, targetElement) {
//
//     var width = d3.select(targetElement).node().getBoundingClientRect().width;
//     var height = width * 0.4;
//
//      margin = {top: 20, right: 20, bottom: 55, left: 80};
//
//      // set the ranges
//      var xGrouping = d3.scaleBand()
//          .domain(data.map(function(d) {
//              return d.candidate;
//          }))
//          .rangeRound([0, ((width < 768) ?
//              (height + 175 + ((newdata.length - 3) * 40)) :
//              (width - margin.right))])
//          .paddingInner(0.25)
//          .paddingOuter(0.25);
//
//      var xBar = d3.scaleBand()
//          .domain(["negative", "positive"])
//          .rangeRound([0, xGrouping.bandwidth()])
//          .padding(0);
//
//          var y = d3.scaleLinear()
//              .domain([0, d3.max(data, function(d) {
//                  return d.positive;
//              })])
//              .range([height, 0])
//              .nice();
//
//          var xAxis = d3.axisBottom(xGrouping)
//              .tickFormat(function(d) {
//                  return d;
//              })
//              .tickSize(0);
//
//          var yAxis = d3.axisLeft(y)
//              .ticks(7)
//              .tickSize(-width);
//
//          var colorscale = d3.scaleOrdinal()
//              .domain(["negative", "positive"])
//              .range(colors.procon);
//
//
//          function customXAxis(g) {
//              g.call(xAxis);
//              g.select(".domain").remove();
//          }
//
//          function customYAxis(g) {
//              var s = g.selection ? g.selection() : g;
//              g.call(yAxis);
//              s.select(".domain").remove();
//              s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
//              s.selectAll(".tick text").attr("x", 10).attr("dy", -4);
//              // if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
//          }
//
//          // create container SVG
//          var svg = d3.select(targetElement).append("svg")
//              .attr("width", width + margin.left + margin.right)
//              .attr("height", height + margin.top + margin.bottom)
//              .append("g")
//              .attr("transform",
//                  "translate(" + margin.left + "," + margin.top + ")");
//
//                  svg.append("g")
//                      .attr("class", "xAxis");
//                      // .attr("transform", "translate(0," + height + ")")
//                      // .style("font-size", "14px")
//                      // // .call(d3.axisBottom(xGrouping));
//                      // .call(customXAxis);
//
//                  svg.append("g")
//                      // .call(d3.axisLeft(y));
//                      .attr("class", "yAxis");
//                      // .style("font-size", "12px")
//                      // .call(customYAxis);
//              svg.append("g")
//                  .selectAll("g")
//                  .data(data)
//                  .enter().append("g")
//                  .attr("transform", function(d){
//                      return 'translate(' + xGrouping(d.candidate) + ',0)';
//                  })
//                  .selectAll("rect")
//                  .data(function(d) {
//
//                      // console.log(d3.entries(d).filter(function(dd) {
//                      //     return dd.key == "negative" || dd.key == "positive" || dd.key == "percent_positive";
//                      // }));
//
//                      return d3.entries(d).filter(function(dd) {
//                          return dd.key == "negative" || dd.key == "positive";
//                      });
//                  })
//                  .enter().append("rect")
//                  .attr("width", xBar.bandwidth())
//                  .attr("height", function(d){
//                      return y(0) - y(d.value);
//                  })
//                  .attr("x", function(d,i) {
//                      return xBar(d.key);
//                  })
//                  .attr("y", function(d) {
//
//                      return y(d.value);
//                  })
//                  .attr("fill",
//                      function(d) {
//                          return colorscale(d.key);
//                      })
//                  .on('mouseover, mousemove', function(d){
//                      if(d.key == "negative"){
//                          d3.select(this).attr("fill", "#f08080");
//                      }
//                      else{
//                          d3.select(this).attr("fill", "#c0c0c0")
//                      }
//
//                  })
//                  .on('mouseout', function(d,i){
//                      if(d.key == "negative"){
//                          d3.select(this).attr("fill", "#cc0000");
//                      }
//                      else{
//                          d3.select(this).attr("fill", "#808080")
//                      }
//                  });
//
//
//      function resizeGroupColumn(){
//          width = d3.select(targetElement).node().getBoundingClientRect().width,
//          width = width - margin.left - margin.right;
//
//
//          xGrouping.rangeRound([0, width]);
//         xBar.rangeRound([0, xGrouping.bandwidth()]);
//          y.range([height, 0]);
//
//
//          svg.select(".xAxis")
//          .attr("transform", "translate(0," + height + ")")
//          .style("font-size", "14px")
//          // .call(d3.axisBottom(xGrouping));
//          .call(customXAxis);
//
//              svg.select(".yAxis")
//              .style("font-size", "12px")
//              .call(customYAxis);
//
//
//              // svg.selectAll("rect")
//              // .attr("transform", function(d){
//              //     return 'translate(' + xGrouping(d.candidate) + ',0)';
//              // })
//              // .attr("width", xBar.bandwidth())
//              // .attr("height", function(d){
//              //     return y(0) - y(d.value);
//              // })
//              // .attr("x", function(d,i) {
//              //     return xBar(d.key);
//              // })
//              // .attr("y", function(d) {
//              //
//              //     return y(d.value);
//              // });
//              // svg.selectAll("g")
//              // .attr("transform", function(d){
//              //     return 'translate(' + xGrouping(d.candidate) + ',0)';
//              // });
//              svg.selectAll("rect")
//                  .attr("width", xBar.bandwidth())
//                  .attr("height", function(d){
//                      return y(0) - y(d.value);
//                  })
//                  .attr("x", function(d,i) {
//                      return xBar(d.key);
//                  })
//                  .attr("y", function(d) {
//
//                      return y(d.value);
//                  })
//                  .attr("fill",
//                      function(d) {
//                          return colorscale(d.key);
//                      })
//                  .on('mouseover, mousemove', function(d){
//                      if(d.key == "negative"){
//                          d3.select(this).attr("fill", "#f08080");
//                      }
//                      else{
//                          d3.select(this).attr("fill", "#c0c0c0")
//                      }
//
//                  })
//                  .on('mouseout', function(d,i){
//                      if(d.key == "negative"){
//                          d3.select(this).attr("fill", "#cc0000");
//                      }
//                      else{
//                          d3.select(this).attr("fill", "#808080")
//                      }
//                  });
//      }
//
//      resizeGroupColumn();
//      d3.select(window).on('resize.three', resizeGroupColumn);
//
// }