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

function drawIsomap2(pd, f, g)
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
							var display = "Grade: " + d[pd]
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
							var display = "Grade: " + d[pd]
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
					.attr("class", "students")
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
							var display = "Grade: " + d[pd]
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
					.attr("class", "students")
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
							var display = "Grade: " + d[pd]
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

			// Selection Frame
			var barchart_data = [];

			svg.on("mousedown", function() {
				// Close stuff
				closeNav();
				d3.selectAll(".axis").remove();
				d3.selectAll(".bars").remove();
				d3.selectAll("circle").attr("opacity", 1.0);
				d3.selectAll("rect").attr("opacity", 1.0);
				d3.selectAll(".labels").remove();

				var p = d3.mouse(this);

				svg.append("rect")
				.attr("rx", 6)
				.attr("ry", 6)
				.attr("class", "selection")
				.attr("x", p[0])
				.attr("y", p[1])
				.attr("width", 0)
				.attr("height", 0);
			})	
			.on("mousemove", function() {
				var s = svg.select("rect.selection");
				
				if (!s.empty()) {
					var p = d3.mouse(this);
		            var d = {
		                x       : parseInt( s.attr( "x"), 10),
		                y       : parseInt( s.attr( "y"), 10),
		                width   : parseInt( s.attr( "width"), 10),
		                height  : parseInt( s.attr( "height"), 10)
		            };
		            var move = {
		                x : p[0] - d.x,
		                y : p[1] - d.y
		            };

		            if( move.x < 1 || (move.x*2<d.width)) {
			            d.x = p[0];
			            d.width -= move.x;
			        } else {
			            d.width = move.x;       
			        }

			        if( move.y < 1 || (move.y*2<d.height)) {
			            d.y = p[1];
			            d.height -= move.y;
			        } else {
			            d.height = move.y;       
			        }

			        s.attr("x", d["x"])
			        .attr("y", d["y"])
			        .attr("width", d["width"])
			        .attr("height", d["height"]);
				}
			})
			.on("mouseup", function() {
				// d3.event.stopPropagation();
				var s = svg.select("rect.selection");

				var x = parseInt(s.attr("x"), 10);
				var y = parseInt(s.attr("y"), 10);
				var width = parseInt(s.attr("width"), 10);
				var height = parseInt(s.attr("height"), 10);

				var male_grade1 = 0;
				var male_grade2 = 0;
				var male_grade3 = 0;
				var mcounter1 = 0;
				var mcounter2 = 0;
				var mcounter3 = 0;
				var female_grade1 = 0;
				var female_grade2 = 0;
				var female_grade3 = 0;
				var fcounter1 = 0;
				var fcounter2 = 0;
				var fcounter3 = 0;
				
				// Select all the males.
				d3.selectAll("circle").each(function(d, i) {
					if (d3.select(this).attr("cx") - 5 >= x &&
						d3.select(this).attr("cx") + 5 <= x + width &&
						d3.select(this).attr("cy") - 5 >= y &&
						d3.select(this).attr("cy") + 5 <= y + height) {

						if (pd == "G1")
						{
							mcounter1++;
							male_grade1 += d.G1;
						}
						
						if (pd == "G2")
						{
							mcounter2++;
							male_grade2 += d.G2;
						}

						if (pd == "G3")
						{
							mcounter3++;
							male_grade3 += d.G3;
						}

						if (pd == "G123")
						{
							mcounter1++;
							male_grade1 += d.G1;

							mcounter2++;
							male_grade2 += d.G2;

							mcounter3++;
							male_grade3 += d.G3;
						}
					}
				});
				
				// Select all the females.
				d3.selectAll("rect").each(function(d, i) {
					if (d3.select(this).attr("x")      >= x &&
						d3.select(this).attr("x") + 20 <= x + width &&
						d3.select(this).attr("y")      >= y &&
						d3.select(this).attr("y") + 20 <= y + height) {

						if (pd == "G1")
						{
							fcounter1++;
							female_grade1 += d.G1;
						}
						
						if (pd == "G2")
						{
							fcounter2++;
							female_grade2 += d.G2;
						}

						if (pd == "G3")
						{
							fcounter3++;
							female_grade3 += d.G3;
						}

						if (pd == "G123")
						{
							fcounter1++;
							female_grade1 += d.G1;

							fcounter2++;
							female_grade2 += d.G2;

							fcounter3++;
							female_grade3 += d.G3;
						}
					}
				});

				// Period 1
				if (mcounter1 > 0)
				{
					male_grade1 = male_grade1 / mcounter1;
					barchart_data.push({gender: "M1", grade: male_grade1});

					mcounter1 = 0;
					male_grade1 = 0;
				}

				if (fcounter1 > 0)
				{
					female_grade1 = female_grade1 / fcounter1;
					barchart_data.push({gender: "F1", grade: female_grade1});

					fcounter1 = 0;
					female_grade1 = 0;
				}

				// Period 2
				if (mcounter2 > 0)
				{
					male_grade2 = male_grade2 / mcounter2;
					barchart_data.push({gender: "M2", grade: male_grade2});

					mcounter2 = 0;
					male_grade2 = 0;
				}

				if (fcounter2 > 0)
				{
					female_grade2 = female_grade2 / fcounter2;
					barchart_data.push({gender: "F2", grade: female_grade2});

					fcounter2 = 0;
					female_grade2 = 0;
				}

				// Period 3
				if (mcounter3 > 0)
				{
					male_grade3 = male_grade3 / mcounter3;
					barchart_data.push({gender: "M3", grade: male_grade3});

					mcounter3 = 0;
					male_grade3 = 0;
				}

				if (fcounter3 > 0)
				{
					female_grade3 = female_grade3 / fcounter3;
					barchart_data.push({gender: "F3", grade: female_grade3});

					fcounter3 = 0;
					female_grade3 = 0;
				}

				// Create barchart.
				

				var margin = { left:400, right:20, top:150, bottom:100 };

				var width = 1000 - margin.left - margin.right,
    			   height = 600 - margin.top - margin.bottom;

			    // Draw the barchart
			    if (barchart_data.length != 0)
			    {
			    	d3.selectAll("circle.students").attr("opacity", .25);
					d3.selectAll("rect.students").attr("opacity", .25);

			    var g = svg.append("svg")
			    	.attr("width", width + margin.left + margin.right)
        			.attr("height", height + margin.top + margin.bottom)
    				.append("g")
    				.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    				.on("mousedown", function() {
    					d3.event.stopPropagation();
    				});

				// Y Label
				g.append("text")
				    .attr("y", -60)
				    .attr("x", -(height / 2))
				    .attr("font-size", "20px")
				    .attr("text-anchor", "middle")
				    .attr("transform", "rotate(-90)")
				    .attr("class", "labels")
				    .text("Average Grade");

			    // X Label
				g.append("text")
				    .attr("y", height + 50)
				    .attr("x", width / 2)
				    .attr("font-size", "20px")
				    .attr("text-anchor", "middle")
				    .attr("class", "labels")
				    .text("Periods");

				var x = d3.scaleBand()
					.domain(barchart_data.map(function(d) { return d.gender; }))
					.range([0, width])
					.padding(0.2);

				var y = d3.scaleLinear()
					.domain([0, /*(d3.max(barchart_data, function(d) {
						return d.grade;
					})*/20])
					.range([height, 0]);

				var xAxisCall = d3.axisBottom(x);
				    g.append("g")
				        .attr("class", "axis")
				        .attr("transform", "translate(0," + height +")")
				        .call(xAxisCall);

		        var yAxisCall = d3.axisLeft(y)
				    .tickFormat(function(d){ return d; });
				g.append("g")
				    .attr("class", "axis")
				    .call(yAxisCall);

				var rects = /*svg*/g.selectAll("rect.bars")
					.data(barchart_data);

				rects.enter()
					.append("rect")
						.attr("y", function(d) { return y(d.grade); })
						.attr("x", function(d) { return x(d.gender); })
						.attr("height", function(d) { return height - y(d.grade); })
						.attr("width", x.bandwidth)
						.attr("fill", "red")
						.on("mouseover", function(d) {
							var display = "Grade: " + d.grade;

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
						})
						.attr("class", "bars");
				
				barchart_data = [];
			}
				// console.log(barchart_data.length == 0);
				// Remove selection frame.
				svg.selectAll("rect.selection").remove();
			});
		}
	});
}