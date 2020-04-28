function columnTemplate(data, targetElement) {

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4,

        margin = {
            top: 20,
            right: 40,
            bottom: 30,
            left: 40
        };


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // set the ranges
    var x = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.candidate;
        }))
        .range([0, width - margin.left - margin.right])
        .padding(0.33);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.positive;
        })])
        .range([height, 0])
        .nice();

    var svg = d3.select(targetElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.axisBottom(x)
        .tickFormat(function(d, i) {

            if (width <= 250) {
                return i % 4 !== 0 ? " " : d;
            } else if (width <= 500) {
                return i % 2 !== 0 ? " " : d;
            } else {
                return d;
            }

        })
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
        .attr("x", function(d) {
            return x(d.candidate);
        })
        .attr("width", x.bandwidth())
        .attr("y", function(d) {
            return y(d.positive);
        })
        .attr("height", function(d) {
            return height - y(d.positive);
        })
        .attr("fill", function(d, i) {
            return "#cc0000";
        })
        .on('mouseover, mousemove', function(d) {
            // console.log("hover");
            var target = d3.select(targetElement + ' .tiptarget');
            d3.select(this)
                .attr("fill", "#f08080");

            div.transition().style("opacity", .7);
            div.html(d.candidate + ": " + d.negative)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            // d3.select(".label").attr("fill", "#777");
        })
        .on("mouseout", function(d, i) {
            div.transition().style("opacity", 0);

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
        .attr("x", function(d, i) {
            return x(d.candidate) + (x.bandwidth() / 2 - 10);
            // return i * (width/data.length);
        })
        .attr("y", function(d) {
            return y(d.positive) + 25;
            // height - (d * 4);
        })
        // .attr("dy", ".75em")
        .text(function(d, i) {

            return d.positive;

        });

    function resizeColumn() {

        width = d3.select(targetElement).node().getBoundingClientRect().width,
            width = width - margin.left - margin.right;


        x.range([0, width]);
        y.range([height, 0]);

        svg.select(".xAxis")
            .attr("transform", "translate(0," + (height + 5) + ")")
            .style("font-size", "14px")
            .call(customXAxis);

        svg.select(".yAxis")
            .style("font-size", "12px")
            .call(customYAxis);


        svg.selectAll(".bar")
            .attr("x", function(d) {
                return x(d.candidate);
            })
            .attr("width", x.bandwidth())
            .attr("y", function(d) {
                return y(d.positive);
            })
            .attr("height", function(d) {
                return height - y(d.positive);
            });


        svg.selectAll(".label")
            .attr("x", function(d) {

                return x(d.candidate) + (x.bandwidth() / 2 - 10);
            })
            .attr("y", function(d) {
                return y(d.positive) + 20;
            });


    }

    resizeColumn();
    d3.select(window).on('resize.one', resizeColumn);



}
