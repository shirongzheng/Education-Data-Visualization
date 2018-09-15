var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Subject");

// Y Label
g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Average Grade");

d3.json("data/students.json").then(function(data){
    // Print
    // console.log(data[0].Subject);


    // Source: https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
    var flags = [], output = [], l = data.length, i;
    for (i = 0; i < l; i++) {
        if( flags[data[i].Subject]) continue;
        flags[data[i].Subject] = true;
        output.push(data[i].Subject);
    }

    // var subject_label = [];
    // for (i = 0; i < output.length; i++) {
    //     subject_label.push("Subject");
    // }

    // var grade_label = [];
    // for (i = 0; i < output.length; i++) {
    //     grade_label.push("Grade");
    // }    
    // console.log(subject_label);

    // Example for testing:
    var grades = [10, 20, 30, 40, 50, 60, 70, 80, 90];

    // Source: https://stackoverflow.com/questions/24148726/combine-two-array-into-json
    // var obj = {};
    // for (i = 0; i < output.length; i++) {
    //    obj[output[i]] = grades[i];
    // }

    // var testdata = JSON.stringify(obj);

    // console.log(testdata);

    // X Scale
    var x = d3.scaleBand()
        .domain(output)
        .range([0, width])
        .padding(0.2);

    // Y Scale
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // X Axis
    var xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height +")")
        .call(xAxisCall);

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return d; });
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    // Bars
    var rects = g.selectAll("rect")
        .data(data)

    rects.enter()
        .append("rect")
        .attr("y", function(d){ return y(d.Grade); })
        .attr("x", function(d){ return x(d.Subject) })
        .attr("height", function(d){ return height - y(d.Grade); })
        .attr("width", x.bandwidth)
        .attr("fill", "grey");

})