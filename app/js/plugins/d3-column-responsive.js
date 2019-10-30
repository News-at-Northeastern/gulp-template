function columnResponsiveTemplate(data, targetElement){
    var width = d3.select(targetElement).node().getBoundingClientRect().width;
        var height = width * 0.4,
         margin = {top: 20, right: 40, bottom: 30, left: 40};



        // set the ranges
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
                    // .attr("transform", "translate(0," + height + ")")

                    // .selectAll(".tick:not(:first-of-type) line")
                    // .attr("stroke-opacity", 0);

                svg.append("g")
                    .attr("class", "yAxis");
                    // .style("font-size", "12px")
                    // .call(yAxis);

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

            svg.selectAll(".bar")
                .data(data)
              .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.candidate);})
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(d.positive); })
                .attr("height", function(d) { return height - y(d.positive); })
                .attr("fill", function(d,i) { return "#cc0000"; })
                .on('mouseover, mousemove', function(d){
                    // console.log("hover");
                    var target = d3.select(targetElement + ' .tiptarget');
                    d3.select(this)
                        .attr("fill", "#f08080");
                    // d3.select(".label").attr("fill", "#777");
                })
                .on("mouseout", function(d, i) {
                 d3.select(this).attr("fill", function() {
                     return "#cc0000";
                     d3.select(".label").attr("fill", "#e6e6e6");
                 });
             });

            svg.selectAll(".text")
               .data(data)
               .enter()
               .append("text")
               .attr("class", "label")
               .attr("fill", "#e6e6e6")
               .attr("font-size", "14px")
               .attr("x", function(d,i){
                   return x(d.candidate) + (x.bandwidth()/2 - 10);
                   // return i * (width/data.length);
               })
               .attr("y", function(d){
                    return y(d.positive) + 25;
                   // height - (d * 4);
               })
               // .attr("dy", ".75em")
               .text(function(d,i){

                    return d.positive;

               });



        function resizeColumn(){

            width = d3.select(targetElement).node().getBoundingClientRect().width,
            width = width - margin.left - margin.right;

            // console.log("width: " + width);

            x.range([0, width]);
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
                // append the rectangles for the bar chart


             svg.selectAll(".bar")
             .attr("x", function(d) { return x(d.candidate);})
             .attr("width", x.bandwidth())
             .attr("y", function(d) { return y(d.positive); })
             .attr("height", function(d) { return height - y(d.positive); });

                      //
                      // svg.selectAll(".text")
                      //    .data(data)
                      //    .enter()
                      //    .append("text")
                      //    .attr("class", "label")
                      //    .attr("fill", "#e6e6e6")
                      //    .attr("x", function(d,i){
                      //        return x(d.candidate) + (x.bandwidth()/2 - 10);
                      //        // return i * (width/data.length);
                      //    })
                      //    .attr("y", function(d){
                      //         return y(d.positive) + 25;
                      //        // height - (d * 4);
                      //    });
                        svg.selectAll("text")
                        .attr("x", function(d){
                            return x(d.candidate) + (x.bandwidth()/2 - 10);
                            // return i * (width/data.length);
                        })
                        .attr("y", function(d){
                             return y(d.positive) + 25;
                            // height - (d * 4);
                        });


                        // svg.select('.xAxis').selectAll("text").attr("y",10).call(wrap, x.bandwidth());
        }

        resizeColumn();
        d3.select(window).on('resize.one', resizeColumn);
}

// function wrap(text, width) {
//   text.each(function() {
//     var text = d3.select(this),
//         words = text.text().split(/\s+/).reverse(),
//         word,
//         line = [],
//         lineNumber = 0,
//         lineHeight = 1.1, // ems
//         y = text.attr("y"),
//         dy = parseFloat(text.attr("dy")),
//         tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
//     while (word = words.pop()) {
//       line.push(word);
//       tspan.text(line.join(" "));
//       if (tspan.node().getComputedTextLength() > width) {
//         line.pop();
//         tspan.text(line.join(" "));
//         line = [word];
//         tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
//       }
//     }
//   });
// }
// // function columnResponsiveTemplate(data, targetElement) {
//
//     var width = d3.select(targetElement).node().getBoundingClientRect().width;
//     var height = width * 0.4;
//
//     // set the ranges
//     var x = d3.scaleBand()
//         .domain(data.map(function(d) { return d.candidate; }))
//         .range([0, width - margin.left - margin.right])
//         .padding(0.33);
//
//     var y = d3.scaleLinear()
//         .domain([0, d3.max(data, function(d) { return d.positive; })])
//         .range([height, 0])
//         .nice();
//
//     var xAxis = d3.axisBottom(x)
//                   .tickFormat(function(d){
//                         return d;
//                     })
//                     .tickSize(0);
//
//     var yAxis = d3.axisLeft(y)
//                   .ticks(7)
//                   .tickSize(-width);
//
//     // create container SVG
//     var svg = d3.select(targetElement).append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
//     svg.append("g")
//         .attr("class", "xAxis")
//         .attr("transform", "translate(0," + height + ")")
//         .style("font-size", "14px")
//         .call(customXAxis);
//         // .selectAll(".tick:not(:first-of-type) line")
//         // .attr("stroke-opacity", 0);
//
//     svg.append("g")
//         .attr("class", "yAxis")
//         .style("font-size", "12px")
//         .call(customYAxis);
//         // .selectAll(".tick:not(:first-of-type) line")
//         // .attr("stroke", "gray")
//         // .attr("stroke-dasharray", "2,2")
//         // .attr("stroke-opacity", 0.5);
//
//
//     // create tooltip using d3-tip library
//     // var tooltip = d3.tip()
//     //     .attr('class', 'd3-tip')
//     //     .offset([-10,0])
//     //     .html(function(d) {
//     //         return d.candidate + ": " + d.positive;
//     //       });
//     //
//     // svg.append('circle')
//     //     .attr('class', 'tiptarget');
//     // svg.call(tooltip);
//
//     function customXAxis(g) {
//       g.call(xAxis);
//       g.select(".domain").remove();
//     }
//
//     function customYAxis(g) {
//       var s = g.selection ? g.selection() : g;
//       g.call(yAxis);
//       s.select(".domain").remove();
//       s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
//       s.selectAll(".tick text").attr("x", 10).attr("dy", -4);
//       // if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
//     }
//
//     // append the rectangles for the bar chart
//     svg.selectAll(".bar")
//         .data(data)
//       .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) { return x(d.candidate);})
//         .attr("width", x.bandwidth())
//         .attr("y", function(d) { return y(d.positive); })
//         .attr("height", function(d) { return height - y(d.positive); })
//         .attr("fill", function(d,i) { return "#cc0000"; })
//         .on('mouseover, mousemove', function(d){
//             // console.log("hover");
//             var target = d3.select(targetElement + ' .tiptarget');
//             d3.select(this)
//                 .attr("fill", "#f08080");
//             // d3.select(".label").attr("fill", "#777");
//         })
//         .on("mouseout", function(d, i) {
//          d3.select(this).attr("fill", function() {
//              return "#cc0000";
//              d3.select(".label").attr("fill", "#e6e6e6");
//          });
//      });
//
//      svg.selectAll(".text")
//         .data(data)
//         .enter()
//         .append("text")
//         .attr("class", "label")
//         .attr("fill", "#e6e6e6")
//         .attr("x", function(d,i){
//             return x(d.candidate) + (x.bandwidth()/2 - 10);
//             // return i * (width/data.length);
//         })
//         .attr("y", function(d){
//              return y(d.positive) + 25;
//             // height - (d * 4);
//         })
//         // .attr("dy", ".75em")
//         .text(function(d){
//             return d.positive;
//         });
//
//
//
//     // svg.append("text")
//     //     .attr("class", "label")
//     //     .attr("y", function(d){
//     //         return y(d.positive) + 3;
//     //     })
//     //     .text(function(d){
//     //         return d.positive;
//     //     });
//     // add the x Axis
//     // svg.append("g")
//     //     .attr("transform", "translate(0," + height + ")")
//     //     .call(d3.axisBottom(x));
//
//     // add the y Axis
//     // svg.append("g")
//     //     .call(d3.axisLeft(y));
// }
