var period = $("input[name=isomap]:checked").val();
var subject = $("input[name=subject]:checked").val();
var gender = $("input[name=gender]:checked").val();

var filename = "./static/data/iso_" + subject + "AgeFailuresAbsences" + period +".json";

drawIsomap2(period, filename, gender);

$("input[type=radio][name=subject]").change(function() {
	subject = $(this).val();
	filename = "./static/data/iso_" + subject + "AgeFailuresAbsences" + period +".json";

	drawIsomap2(period, filename, gender);
});

$("input[type=radio][name=isomap]").change(function() {
	period = $(this).val();
	filename = "./static/data/iso_" + subject + "AgeFailuresAbsences" + period +".json";

	drawIsomap2(period, filename, gender);
});

$("input[type=radio][name=gender]").change(function() {
	gender = $(this).val();
	filename = "./static/data/iso_" + subject + "AgeFailuresAbsences" + period +".json";

	drawIsomap2(period, filename, gender);
});

function drawIsomap2(p, f, g)
{
	d3.json(/*"data/iso_matAgeFailuresAbsencesG1.json"*/f).then(function(data)
	{
		d3.select("#chart-area svg").remove();

		var minX = d3.min(data, function(d) { return d.X; });
		if (minX < 0) minX = -1 * minX;
		var maxX = d3.max(data, function(d) { return d.X; });
		
		var minY = d3.min(data, function(d) { return d.Y; });
		if (minY < 0) minY = -1 * minY;

		var maxY = d3.max(data, function(d) { return d.Y; });

		var width = (minX + maxX) * 20 + 20;
		var height = (minY + maxY) * 20 + 20;

		var svg = d3.select("#chart-area")
				.append("svg")
					.attr("width", width)
					.attr("height", height);

		// Legend stuff.
		var meow = ["black", "red", "orange", "green", "blue"];
		var legendRectSize = 18;
		var legendSpacing = 4;
		var y_pos = Math.round(legendRectSize / 2);
		var legend = svg.selectAll('.legend')
			.data(meow)
			.enter()
			.append("g")
			.attr("class", "legend");

		legend.append("rect")
			.attr("width", legendRectSize)
			.attr("height", legendRectSize)
			.attr("fill", function(d, i) {
				return d;
			})
			.attr("y", function(d, i) {
				return i * legendRectSize;
			});
		legend.append("text")
			.attr("x", legendRectSize + legendSpacing)
			.attr("y", function(d, i) { 
				y_pos = y_pos + legendRectSize + 2; 
				return y_pos - legendRectSize - 2; 
			})
			.text(function(d,i) {
				if (i == 0) return "None (note: stroke = Fedu, fill = Medu)";
				else if (i == 1) return "Initial Education";
				else if (i == 2) return "Primary Education";
				else if (i == 3) return "Secondary Education";
				else if (i == 4) return "Higher Education";
			});

		var centerX = d3.select("svg").attr("width") / 2;
		var centerY = d3.select("svg").attr("height") / 2;

		// Tooltip
		var div = d3.select("body").append("div")	
			    .attr("class", "tooltip")				
			    .style("opacity", 0);

		if (g == "M")
		{
			var circles = svg.selectAll("circle")
				.data(data.filter(function(d) { return d.sex == "M"; }))
				.enter()
					.append("circle")
					.attr("cx", function(d) { return (d.X + minX) * 20 + 10; })
					.attr("cy", function(d) { return (d.Y + minY) * 20 + 10; })
					.attr("r", 5)
					.attr("fill", function(d) {
						if (d.Medu == 0) return "black";
						else if (d.Medu == 1) return "red";
						else if (d.Medu == 2) return "orange";
						else if (d.Medu == 3) return "green";
						else return "blue";
					})
					.attr("stroke", function(d) {
						if (d.Fedu == 0) return "black";
						else if (d.Fedu == 1) return "red";
						else if (d.Fedu == 2) return "orange";
						else if (d.Fedu == 3) return "green";
						else return "blue";
					})
					.attr("stroke-width", 2)
					.on("mouseover", function(d) {
							var display = "Grade: " + d[p]
								+ "</br>Fails: " + d["failures"]
								+ "</br>Absences: " + d["absences"]
								+ "</br>Mjob: " + d["Mjob"]
								+ "</br>Fjob: " + d["Fjob"];

							div.transition()		
				                .duration(200)		
				                .style("opacity", .9);

				            div.html(display)
				            	.style("left", (d3.event.pageX) + "px")		
		                		.style("top", (d3.event.pageY - 28) + "px");
						})
						.on("mouseout", function(d) {
							div.transition()		
				                .duration(500)		
				                .style("opacity", 0);
						});
			}
		if (g == "F")
		{
			var rectangles = svg.selectAll("rect")
				.data(data.filter(function(d) { return d.sex == "F"; }))
				.enter()
					.append("rect")
					.attr("x", function(d) { return (d.X + minX) * 20 + 10 - 5; })
					.attr("y", function(d) { return (d.Y + minY) * 20 + 10 - 5; })
					.attr("width", 10)
					.attr("height", 10)
					.attr("fill", function(d) {
						if (d.Medu == 0) return "black";
						else if (d.Medu == 1) return "red";
						else if (d.Medu == 2) return "orange";
						else if (d.Medu == 3) return "green";
						else return "blue";
					})
					.attr("stroke", function(d) {
						if (d.Fedu == 0) return "black";
						else if (d.Fedu == 1) return "red";
						else if (d.Fedu == 2) return "orange";
						else if (d.Fedu == 3) return "green";
						else return "blue";
					})
					.attr("stroke-width", 2)
					.on("mouseover", function(d) {
							var display = "Grade: " + d[p]
								+ "</br>Fails: " + d["failures"]
								+ "</br>Absences: " + d["absences"]
								+ "</br>Mjob: " + d["Mjob"]
								+ "</br>Fjob: " + d["Fjob"];

							div.transition()		
				                .duration(200)		
				                .style("opacity", .9);

				            div.html(display)
				            	.style("left", (d3.event.pageX) + "px")		
		                		.style("top", (d3.event.pageY - 28) + "px");
						})
						.on("mouseout", function(d) {
							div.transition()		
				                .duration(500)		
				                .style("opacity", 0);
						});
		}
		if (g == "both")
		{
			var circles = svg.selectAll("circle")
				.data(data.filter(function(d) { return d.sex == "M"; }))
				.enter()
					.append("circle")
					.attr("cx", function(d) { return (d.X + minX) * 20 + 10; })
					.attr("cy", function(d) { return (d.Y + minY) * 20 + 10; })
					.attr("r", 5)
					.attr("fill", function(d) {
						if (d.Medu == 0) return "black";
						else if (d.Medu == 1) return "red";
						else if (d.Medu == 2) return "orange";
						else if (d.Medu == 3) return "green";
						else return "blue";
					})
					.attr("stroke", function(d) {
						if (d.Fedu == 0) return "black";
						else if (d.Fedu == 1) return "red";
						else if (d.Fedu == 2) return "orange";
						else if (d.Fedu == 3) return "green";
						else return "blue";
					})
					.attr("stroke-width", 2)
					.on("mouseover", function(d) {
							var display = "Grade: " + d[p]
								+ "</br>Fails: " + d["failures"]
								+ "</br>Absences: " + d["absences"]
								+ "</br>Mjob: " + d["Mjob"]
								+ "</br>Fjob: " + d["Fjob"];

							div.transition()		
				                .duration(200)		
				                .style("opacity", .9);

				            div.html(display)
				            	.style("left", (d3.event.pageX) + "px")		
		                		.style("top", (d3.event.pageY - 28) + "px");
						})
						.on("mouseout", function(d) {
							div.transition()		
				                .duration(500)		
				                .style("opacity", 0);
						});

			var rectangles = svg.selectAll("rect")
				.data(data.filter(function(d) { return d.sex == "F"; }))
				.enter()
					.append("rect")
					.attr("x", function(d) { return (d.X + minX) * 20 + 10 - 5; })
					.attr("y", function(d) { return (d.Y + minY) * 20 + 10 - 5; })
					.attr("width", 10)
					.attr("height", 10)
					.attr("fill", function(d) {
						if (d.Medu == 0) return "black";
						else if (d.Medu == 1) return "red";
						else if (d.Medu == 2) return "orange";
						else if (d.Medu == 3) return "green";
						else return "blue";
					})
					.attr("stroke", function(d) {
						if (d.Fedu == 0) return "black";
						else if (d.Fedu == 1) return "red";
						else if (d.Fedu == 2) return "orange";
						else if (d.Fedu == 3) return "green";
						else return "blue";
					})
					.attr("stroke-width", 2)
					.on("mouseover", function(d) {
							var display = "Grade: " + d[p]
								+ "</br>Fails: " + d["failures"]
								+ "</br>Absences: " + d["absences"]
								+ "</br>Mjob: " + d["Mjob"]
								+ "</br>Fjob: " + d["Fjob"];

							div.transition()		
				                .duration(200)		
				                .style("opacity", .9);

				            div.html(display)
				            	.style("left", (d3.event.pageX) + "px")		
		                		.style("top", (d3.event.pageY - 28) + "px");
						})
						.on("mouseout", function(d) {
							div.transition()		
				                .duration(500)		
				                .style("opacity", 0);
						});
		}
	});
}