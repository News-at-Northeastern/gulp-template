function groupedColumnTemplate(data, targetElement) {

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4;



    // set the ranges
    var xGrouping = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.candidate;
        }))
        .rangeRound([0, ((width < 768) ?
            (height + 175 + ((newdata.length - 3) * 40)) :
            (width - margin.right))])
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
        .attr("class", "xAxis");
        // .attr("transform", "translate(0," + height + ")")
        // .style("font-size", "14px")
        // // .call(d3.axisBottom(xGrouping));
        // .call(customXAxis);

    svg.append("g")
        // .call(d3.axisLeft(y));
        .attr("class", "yAxis");
        // .style("font-size", "12px")
        // .call(customYAxis);



    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d){
            return 'translate(' + xGrouping(d.candidate) + ',0)';
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
        .attr("class", "bar")
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
            if(d.key == "negative"){
                d3.select(this).attr("fill", "#f08080");
            }
            else{
                d3.select(this).attr("fill", "#c0c0c0")
            }

        })
        .on('mouseout', function(d,i){
            if(d.key == "negative"){
                d3.select(this).attr("fill", "#cc0000");
            }
            else{
                d3.select(this).attr("fill", "#808080")
            }
        });



    svg.selectAll(".text")
       .data(data)
       .enter()
       .append("text")
       .attr("class", "label")
       .attr("x", function(d, i){

           return i * (width/(data.length));
       })
       .attr("y", function(d, i){
           return y(d.value);
           // return height * i/12 ;
       })
       .text(function(d){

           var values = Object.keys(d).map(function(key){
                  return d[key];
           });

           return "";


          });

          function resizeGroupColumn(){
              console.log("resize group");
              width = d3.select(targetElement).node().getBoundingClientRect().width,
                  width = width - margin.left - margin.right;

                  console.log(width);
            xBar.range([0,width]);
            y.range([height, 0]);

            svg.select(".xAxis")
            .attr("transform", "translate(0," + height + ")")
            .style("font-size", "14px")
            .call(customXAxis);

            svg.selectAll(".yAxis")
            .style("font-size", "12px")
            .call(customYAxis);

            svg.selectAll(".bar")
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

          }

        resizeGroupColumn();
         d3.select(window).on('resize.two', resizeGroupColumn);




}
