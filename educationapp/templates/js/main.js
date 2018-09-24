var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

/*
    Flag:
        True = Average Grade
        False = Total Number of Students Passed
*/
var flag = true;

// Transition. *Try to keep the number lower than loops delayed.*
var t = d3.transition().duration(750);
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")

var yAxisGroup = g.append("g")
    .attr("class", "y axis")

// X Scale
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

// Y Scale
var y = d3.scaleLinear()
    .range([height, 0]);

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Subjects");

// Y Label
var yLabel = g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Average Grade");

d3.json("data/data.json").then(function(data){
    // Clean data
    data.forEach(function(d) {
        d.grade = +d.grade;
        d.passed = +d.passed;
    });

    d3.interval(function(){
        update(data);
        flag = !flag;
    }, 2000);

    // Initial run.
    update(data);
});

// Update Method
function update(data) {
    var value = flag? "grade" : "passed";

    x.domain(data.map(function(d){ return d.subject }));
    y.domain([0, d3.max(data, function(d) { return d[value]; })]);

    // X Axis
    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return d; });
    yAxisGroup.transition(t).call(yAxisCall);


    // JOIN new data with old elements.
    var rects = g.selectAll("rect")
        .data(data, function(d){
            return d.subject;
        })

    // EXIT old elements not present in new data.
    rects.exit()
        .attr("fill", "red")
    .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

    // UPDATE old elements present in new data.
    rects.transition(t)
        .attr("y", function(d){ return y(d[value]); })
        .attr("x", function(d){ return x(d.subject) })
        .attr("height", function(d){ return height - y(d[value]); })
        .attr("width", x.bandwidth)

    // ENTER new elements present in new data.
    rects.enter()
        .append("rect")
            .attr("x", function(d){ return x(d.subject) })
            .attr("width", x.bandwidth)
            .attr("fill", "grey")
            .attr("y", y(0))
            .attr("height", 0)
        // AND UPDATE old elements present in new data.
        .merge(rects)
        .transition(t)
            .attr("y", function(d){ return y(d[value]); })
            .attr("height", function(d){ return height - y(d[value]); });

    var label = flag? "Average Grade" : "Total Students Passed";
    yLabel.text(label);
}
