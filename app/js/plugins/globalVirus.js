function globalCoronavirus(data_global, targetElement, targetSlider, targetButton) {

    var margin = {
        top: 100,
        right: 50,
        bottom: 100,
        left: 50
    };
    var width = d3.select(targetElement).node().getBoundingClientRect().width - margin.left - margin.right;
    var height = width * 0.4;

    var moving = false;
    var currentValue = 0;
    var targetValue = width;
    var playButton = d3.select(targetButton);

    var svg = d3.select(targetElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    //-----------------------------DATA------------------------------//
    var parseDate = d3.timeParse("%Y-%m-%d");

    //X AXIS
    var xScale = d3.scaleTime()
        .range([0, width]);

        xScale.domain(d3.extent(data_global, function(d) {
             return parseDate(d.date);
         }));

        var xAxis = d3.axisBottom(xScale)
                        .tickSize(0)
                        .ticks(10);

        function customXAxis(g) {
            g.call(xAxis);
            g.select(".domain").remove();
        }

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (height) + ")")
            .style("attr", "red")
            .call(customXAxis);

       var y = d3.scaleLinear()
           .domain([0, d3.max(data_global, function(d) {
               return d.total_confirmed + 1000;
           })])
           .range([height, 0])
           .nice();


       var yAxis = d3.axisLeft(y)
           .ticks(5)
           .tickSize(-width)
           .tickFormat(function (d) {
                    return y.tickFormat(4,d3.format(",d"))(d)
            });

           function customYAxis(g) {
               var s = g.selection ? g.selection() : g;
               g.call(yAxis);
               s.select(".domain").remove();
               s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
               s.selectAll(".tick text").attr("x", 10).attr("dy", -4);
               // if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
           }

           svg.append("g")
               // .call(d3.axisLeft(y));
               .attr("class", "yAxis")
               .style("font-size", "12px")
               .call(customYAxis);
    //----------------------------LINES------------------------------//
    var line = d3.line()
        .x(function(d) { return xScale(parseDate(d.date)); })
        .y(function(d) { return y(d.total_confirmed); });

        svg.append("path")
            .datum(data_global)
            .attr("fill", "none")
            .attr("stroke", "#a50f15")
            .attr("stroke-width", 4)
            .attr("opacity", 0.1)
            .attr("d", line);

     var line3 = d3.line()
         .x(function(d) { return xScale(parseDate(d.date)); })
         .y(function(d) { return y(d.total_death); });

         svg.append("path")
             .datum(data_global.filter(function(d){
                return d.total_death > 0;
             }))
             .attr("fill", "none")
             .attr("stroke", "#00008B")
             .attr("stroke-width", 4)
             .attr("opacity", 0.1)
             .attr("d", line3);

    //----------------------------SLIDER------------------------------//
    var heightSlider = 50;

    var startDate = a,
        endDate = b;

    var xSlider = d3.scaleTime()
       .domain(d3.extent(data_global, function(d) {
          return parseDate(d.date);
        }))
        .range([0, targetValue])
        .clamp(true);

        var formatTime = d3.timeFormat("%m/%d/%Y");


    var svgSlider = d3.select(targetSlider)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", heightSlider );

    var slider = svgSlider.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + heightSlider / 5 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", xSlider.range()[0])
        .attr("x2", xSlider.range()[1])
        .select(function() {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-inset")
        .select(function() {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .call(d3.drag()
    .on("start.interrupt", function() {
        slider.interrupt();
    })
    .on("start drag", function() { moveSlider(xSlider.invert(d3.event.x)); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(xSlider.ticks(15))
        .enter()
        .append("text")
        .attr("x", xSlider)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function(d) {
            return formatTime(d);
        });

        console.log(xScale.domain())
        console.log(xSlider.domain())


    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    function drawData(data_test, yearLimit){
        // var line = d3.line()
        //     .x(function(d) { return xScale(parseDate(d.date)); })
        //     .y(function(d) { return y(d.total_confirmed); });

            svg.append("path")
                .datum(data_test.filter(function(d){
                    if(parseDate(d.date) <= yearLimit){
                        return d;
                    }

                }))
                .attr("class", "slide_line")
                .attr("fill", "none")
                .attr("stroke", "#a50f15")
                .attr("stroke-width", 4)
                // .attr("opacity", 0.2)
                .attr("d", line);


                        svg.append("path")
                        .datum(data_test.filter(function(d){
                            if(parseDate(d.date) <= yearLimit){
                                return d;
                            }

                        }))
                        .attr("class", "slide_line")
                            .attr("fill", "none")
                            .attr("stroke", "#00008B")
                            .attr("stroke-width", 4)
                            // .attr("opacity", 0.1)
                            .attr("d", line3);

    }

    //----------------------------BUTTON------------------------------//


    playButton.on("click", function(){
        // console.log("hey we clicking!");
        var button = d3.select(this);
        if (button.text() == "Pause") {
            button.text("Play");
            moving = false;
            clearInterval(timer);
        }
        else{
            button.text("Pause");
            moving = true;
            timer= setInterval(step, 100);

        }
    });

    function step(){
        moveSlider(xSlider.invert(currentValue));
        currentValue = currentValue + (targetValue/151);
          if (currentValue > targetValue) {
        moving = false;
        currentValue = 0;
        clearInterval(timer);
        playButton.text("Play");
            // console.log("Slider moving: " + moving);
            }
    }


    function moveSlider(h) {

        // console.log(h);
        handle.attr("cx", xSlider(h));

        svg.selectAll(".slide_line").remove();

        // console.log(formatTime(h));

        drawData(data_global, h);



    }
    //----------------------------LABELS------------------------------//



}
