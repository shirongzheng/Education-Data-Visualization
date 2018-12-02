var course = $("input[name=course]:checked").val();
var model = $("input[name=ml]:checked").val();

drawIsomap(course, model);

$("input[type=radio][name=course]").change(function() {
	course = $(this).val();
	
	drawIsomap(course, model);
});

$("input[type=radio][name=ml]").change(function() {
	model = $(this).val();
	
	drawIsomap(course, model);
});

// Argument c stands for 'course'.
// Argument m stands for 'model'.
function drawIsomap(c, m)
{
	d3.json("data/attend_grade_all_model.json").then(function(data)
	{
		d3.select("#chart-area svg").remove();

		console.log(d3.max(data, function(d) {
			return d[model] * 10 + 10;
		}));

		var width = d3.max(data.filter(function(d) { return d.Subject == c; }), 
			function(d) { return d[m] * 10 + 20; });
		var height = d3.max(data.filter(function(d) { return d.Subject == c; }), 
			function(d) { return d.Attendence * 10 + 40; });

		var svg = d3.select("#chart-area")
				.append("svg")
					.attr("width", width)
					.attr("height", height);

		var centerX = d3.select("svg").attr("width") / 2;
		var centerY = d3.select("svg").attr("height") / 2;

		var div = d3.select("body").append("div")	
		    .attr("class", "tooltip")				
		    .style("opacity", 0);

		var circles = svg.selectAll("circle")
			.data(data.filter(function(d) { return d.Subject == c; }))
			.enter()
				.append("circle")
				.attr("cx", function(d) { return d[m] * 10 + 10; })
				.attr("cy", function(d) { return d.Attendence * 10 + 20; })
				.attr("r", 5)
				.attr("fill", function(d) {
					if (d.Sex == "M") return "blue";
					else return "red";
				})
				.on("mouseover", function(d) {
					var display = "Grade: " + d.Grade + "<br/>Absences: " + d.Attendence
					+ "</br>Gender: " + d.Sex;

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
	});
}