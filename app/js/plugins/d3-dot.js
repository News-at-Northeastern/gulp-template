function dotTemplate(data, targetElement){

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
                .domain([0, d3.max(data, function(d) {
                    return d.positive + 100;
                })])
                .range([0, width - margin.left - margin.right]);

            var y = d3.scaleBand()
                .domain(data.map(function(d) {
                    return d.candidate;
                }))
                .range([height, 0])
                .padding(0.2);

            var xAxis = d3.axisBottom(x)
                .tickSize(-height);

            var yAxis = d3.axisLeft(y)
                .ticks(10)
                .tickSize(0);

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
              var div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

            svg.selectAll("myline")
                .data(data)
                .enter()
                .append("line")
                .attr("x1", function(d){
                    return x(d.negative);
                })
                .attr("x2", function(d){
                    return x(d.positive);
                })
                .attr("y1", function(d){
                    return y(d.candidate);
                })
                .attr("y2", function(d){
                    return y(d.candidate);
                })
                .attr("stroke", "grey")
                .attr("stroke-width", "1px");

                svg.selectAll("mycircle")
                    .data(data)
                    .enter().append("circle")
                    .attr("cx", function(d){
                        return x(d.negative);
                    })
                    .attr("cy", function(d){
                        return y(d.candidate);
                    })
                    .attr("r", 6)
                    .attr("fill", "#cc0000")
                    .on('mouseover, mousemove', function(d){

                            d3.select(this).attr("fill", "#f08080");
                             div.transition().style("opacity", .7);
                            div.html(d.candidate + ": " + d.negative)
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY -28) + "px");


                    })
                    .on("mouseout", function(d){
                             div.transition().style("opacity", 0);
                        d3.select(this).attr("fill", "#cc0000");

                    });

                    svg.selectAll("mycircle")
                        .data(data)
                        .enter().append("circle")
                        .attr("cx", function(d){
                            return x(d.positive);
                        })
                        .attr("cy", function(d){
                            return y(d.candidate);
                        })
                        .attr("r", 6)
                        .attr("fill", "#808080")
                        .on('mouseover, mousemove', function(d){

                                d3.select(this).attr("fill", "#c0c0c0");
                                div.html(d.candidate + ": " + d.positive)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY -28) + "px");


                        })
                        .on("mouseout", function(d){
                            d3.select(this).attr("fill", "#808080");

                        });
}
