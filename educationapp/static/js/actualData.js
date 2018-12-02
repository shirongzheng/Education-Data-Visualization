var margin = { left:60, right:0, top:0, bottom:60 };

var select = $("#var-select").val();

drawHeatmap(select);

$("#var-select").change(function() {
	select = $(this).val();
	
	drawHeatmap(select);
})

function drawHeatmap(s) {
	d3.json("./static/data/attend_grade_all_model.json").then(function(data){
		// Remove existing SVG.
		d3.select("#chart-area svg").remove();

		// Clean data
	    data.forEach(function(d) {
	        d.Attendence = +d.Attendence;
	    });

	    // Calculating Maximum number for X axis.
		var maxAttendance;
		var index;
		for (var i = 0; i < data.length; ++i) 
		{
			if (data[i]["Subject"] === s) 
			{
				maxAttendance = data[i]["Attendence"];
				index = i;
				break;
			}
		}
		
		for (var i = index + 1; i < data.length; ++i)
		{
			if (data[i]["Subject"] === s)
			{
				if (data[i]["Attendence"] > maxAttendance)
				{
					maxAttendance = data[i]["Attendence"];
				} 
			}
		}

		var gradeRange = 11;
		var maxAbsence = maxAttendance;
		var matrix = new Array(gradeRange);

		// Declare the columns
			for (var i = 0; i < matrix.length; ++i)
				matrix[i] = new Array(maxAbsence);

		// Initialize matrix to 0.
		for (var i = 0; i < gradeRange; ++i)
			for (var j = 0; j < maxAbsence; ++j)
				matrix[i][j] = 0;

		// Initialize matrix to comply to heatmap.
		var total_students = 0;
		for (var i = 0; i < data.length; ++i)
		{
			if (data[i]["Subject"] === s)
			{
				var column = data[i]["Attendence"];
				var row = 10 - ((Math.round(data[i]["Grade"]) - (Math.round(data[i]["Grade"]) % 10)) / 10);
				if (data[i]["Grade"] <= 0) row = 0;
				matrix[row][column]++;
				total_students++;
			}
		}

		// Convert from number of students to percentage of students.
		for (var i = 0; i < gradeRange; ++i)
		{
			for (var j = 0; j < maxAbsence; ++j)
			{
				matrix[i][j] = (matrix[i][j] / total_students) * 100;
			}
		}

		var colorDomain = [0, 100];
		var colorScale = d3.scaleLinear()
			.domain(colorDomain)
			.range(["white", "red"]);
		
		var svg = d3.select("#chart-area")
			.append("svg")
				.attr("width", maxAbsence * 10 + margin.left + margin.right)
				.attr("height", 100 + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

		// Tooltip test.
		var div = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);

		// Manually Loop through Matrix and Append Rectangles.
		for (var i = 0; i < gradeRange; ++i)
		{
			for (var j = 0; j < maxAbsence; ++j)
			{
				var rectangle = svg.append("rect");

				rectangle.attr("y", i * 10);
				rectangle.attr("x", j * 10);
				rectangle.attr("width", 10);
				rectangle.attr("height", 10);
				rectangle.attr("fill", colorScale(matrix[i][j]));
				rectangle.on("mouseover", function(d) {
					var row = d3.select(this).attr("y");
					var column = d3.select(this).attr("x");
					row = row / 10;
					column = column / 10;

					d3.select(this).style("stroke","yellow").style("stroke-width","1px");

					console.log(matrix[row][column]);

					div.transition()		
		                .duration(200)		
		                .style("opacity", .9);

		            div.html(matrix[row][column])
		            	.style("left", (d3.event.pageX) + "px")		
                		.style("top", (d3.event.pageY - 28) + "px");

				});
				rectangle.on("mouseout", function() {
					d3.select(this).style("stroke","none");

					div.transition()		
		                .duration(500)		
		                .style("opacity", 0);
				});
			}
		}

		// Stuff for y-axis.
			var y = d3.scaleLinear()
				.domain([0, 100])
				.range([100, 0]);

			var yAxisCall = d3.axisLeft(y);

			// Stuff for x-axis
			var absences = [];
			for (var i = 0; i <= maxAbsence; ++i)
			{
				absences.push(i);
			}

			var x = d3.scaleBand()
				.domain(absences)
				.range([0, maxAbsence * 10]);

			var xAxisCall = d3.axisBottom(x);

			// Y axis
				svg.append("g")
					.attr("transform", "translate(-2, 5)")
					.call(yAxisCall);

			// X axis
			var height = 100 + margin.top;
			svg.append("g")
				.attr("transform", "translate(0," + 110 +")")
				.call(xAxisCall)
				.selectAll("text")
					.style("text-anchor", "middle")
					.attr("transform", "rotate(90)translate(13, -13)");

			// X Label
			svg.append("text")
			    .attr("y", 100 + 50)
			    .attr("x", (maxAbsence * 10) / 2)
			    .attr("font-size", "20px")
			    .attr("text-anchor", "middle")
			    .text("Absences");

			// Y Label
			svg.append("text")
			    .attr("y", -30)
			    .attr("x", -(100 / 2))
			    .attr("font-size", "20px")
			    .attr("text-anchor", "middle")
			    .attr("transform", "rotate(-90)")
			    .text("Grade");
	}); // End d3.json()
} // End drawHeatmap()

function mouseoverTooltip(m_div, m_data)
{
	m_div.transition()		
	    .duration(200)		
	    .style("opacity", .9);

    m_div.html(m_data)
    	.style("left", (d3.event.pageX) + "px")		
		.style("top", (d3.event.pageY - 28) + "px");
}