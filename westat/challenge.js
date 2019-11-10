if (!Math.round10) {
	Math.round10 = function(value, exp) {
		return decimalAdjust('round', value, exp);
	};
}


//Temp colors - todo - replace with requested colors or color scale
var colors = [
        "#117CAE",
        "#19BDCE",
        "#CEC919",
        "#CE7419",
        "#CE1949"
    ],
    colorScale = d3.scaleQuantize().range(colors);

var donutContainer = d3.select("#donut-chart-container"),
    donutWidth = donutContainer.node().getBoundingClientRect().width,
    donutHeight = donutContainer.node().getBoundingClientRect().height,
    maxRadius = d3.min([this.donutHeight, this.donutWidth]) / 2,
    donutOuterRadius = this.maxRadius * 0.8,
    donutInnerRadius = this.donutOuterRadius * 0.65,
    donutRadius = this.maxRadius * 0.9;

var arc = d3.arc()
	.innerRadius(donutInnerRadius)
	.outerRadius(donutOuterRadius);

var pie = d3.pie()
    .sort(null)
    .startAngle(-90 * Math.PI/180)
    .endAngle(-90 * Math.PI/180 + 2*Math.PI)
    // .padAngle(0.01)
    // .value(function(d){ return d.value });
    .value(function(d){ return d.value.val });
    

var donutSVG = d3.select("#donut-chart-container")
	.append("svg")
	.attr("class", "donut-svg")
	.attr("width", donutWidth)
	.attr("height", donutHeight);

var donutG = donutSVG.append("g")
    .attr('transform', 'translate(' + (donutWidth / 2) + ',' + (donutHeight / 2) + ')');

var donutCenterG = donutSVG.append("g")
	.attr('transform', 'translate(' + (donutWidth / 2) + 
        ',' + (donutHeight / 2) + ')');
        
var donutLabelsG = donutSVG.append("g")
    .attr('transform', 'translate(' + (donutWidth / 2) + ',' + (donutHeight / 2) + ')');
    

var donutData = [
        {cat: "e", val: 34}, 
        {cat: "vg", val: 38}, 
        {cat: "g", val:20}, 
        {cat: "f", val:7}, 
        {cat: "p", val:1}
    ],
    donutStartData =[
        {cat: "e", val: 0},
        {cat: "vg", val: 0},
        {cat: "g", val: 0},
        {cat: "f", val: 0},
        {cat: "p", val: 0}
    ]

// var pieData = pie(d3.entries(dummyData));
var pieData = pie(d3.entries(donutData));
// var pieStartData = pie(d3.entries(dummyStartData));
var pieStartData = pie(d3.entries(donutStartData));

// set the color scale
var color = d3.scaleOrdinal()
    .domain(["e", "vg", "g", "f", "p"])
    .range(colors);

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
    }

//todo - remove data types, implement color scale
//todo - change starting data to represent all values starting 0
function drawDonutChart(){

    donutPaths = donutG.selectAll('path')
        .data(pieStartData)
        .enter()
        .append('path')
        .attr("d", arc)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("id", function(d,i){return "donutArc"+i;})
        .each(function(d){ this._current = d});

    donutCenterG.append("text")
		.attr("id", "center-text")
		.attr("dy", ".35em").attr("class", "chartLabel")
		.attr("dx", "-.25em")
        .attr("text-anchor", "middle")
        .style("opacity", 0)
		.text("Teens' Health");

}

function updateDonutChart(newVal){
	var donutData = [
		{type: "state", val: newVal},
		{type: "empty", val: 100 - newVal}
	];

	donutPaths.data(pieData)
		.transition()
		.duration(750)
        .attrTween("d", arcTween);
        
    donutCenterG.select("text")
        .transition()
        .duration(750)
        .delay(300)
        .style("opacity", 1);

    addDonutLabels()
}

var key = function(d){ return d.data.cat; };

function addDonutLabels(){
    var outerArc = d3.arc()
        .innerRadius(donutRadius * 0.9)
        .outerRadius(donutRadius * 0.9);

    var labels = donutLabelsG
        .selectAll(".donut-label")
		// .data(pieData);
		.data(pieData)
	    .enter()
		.append("text")
        .attr("transform", function(d) {  
            var c = arc.centroid(d);
            return "translate(" + c[0]*1.37 +"," + c[1]*1.37 + ")";
         })
        .attr('text-anchor', "middle")
        .text(function(d) {
            return d.value + "%";
        })
        .style("opacity", 0)
        .transition()
        .delay(750)
        .duration(500)
        .style("opacity", 1);

	
	
}

function adl(){
    donutLabelsG.selectAll(".donutText")
			.data(pieData)
		   .enter().append("SVG:text")
			.attr("class", "donutText")
			//Move the labels below the arcs for those slices with an end angle greater than 90 degrees
			.attr("dy", function(d,i) { console.log("d.endAngle ", d.endAngle); return (d.endAngle > 90 * Math.PI/180 ? 18 : -11); })
		   .append("textPath")
			// .attr("startOffset","50%")
			.style("text-anchor","middle")
			.attr("xlink:href",function(d,i){return "#donutArc"+i;})
			// .text(function(d){return d.data.name;});
			.text("33");
}





var barData = [
        {qi: 0, q: "encourage you to be physically active", val1: 53, val2: 38, total: 91},
        {qi: 1, q: "engage in physical activities with you", val1: 31, val2: 51, total: 82},
        {qi: 2, q: "encourage exercise to lose or control weight", val1: 38, val2: 35, total: 73},
        {qi: 3, q: "talk about eating healthy foods", val1: 36, val2: 41, total: 77}
    ];

var stack = d3.stack()
    .keys(["val1", "val2"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
var series = stack(barData);

var barContainer = d3.select("#bar-chart-container"),
    barContainerWidth = barContainer.node().getBoundingClientRect().width,
    barContainerHeight = barContainer.node().getBoundingClientRect().height;

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 80},
    // width = 960 - margin.left - margin.right,
    width = barContainerWidth - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;
    height = barContainerHeight - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.4);

var x = d3.scaleLinear()
          .range([0, width]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var barSvg = barContainer.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// format the data
barData.forEach(function(d) {
    d.val1 = +d.val1;
    d.val2 = +d.val2;
});

// Scale the range of the data in the domains
x.domain([0, 100])
y.domain(barData.map(function(d) { return d.q; }));


function drawBarChart(){
    bars = barSvg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        // .attr("x", d => x(d[0]))
        .attr("x", 0)
        .attr("y", (d, i) => y(d.data.q))
        // .attr("width", d => x(d[1]) - x(d[0]))
        .attr("width", 0)
        .attr("height", y.bandwidth());
    
    
    // add the y Axis
    yAxis = barSvg.append("g").attr("class", "y-axis").style("opacity", 0)
        .call(
            d3.axisLeft(y)
              .tickSizeInner(0)
              .tickSizeOuter(-7)
        );

    yAxisLabels = yAxis.selectAll("text").style("opacity", 0);
}


function updateBarChart(){
    yAxis.transition().duration(500).style("opacity", 1);

    bars.transition()
        .duration(750)
        .delay(250)
        .attr("x",  d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]));

    yAxisLabels.transition()
        .delay(750)
        .duration(750)
        .style("opacity", 1);

    addBarLabels();
}

function addBarLabels(){
    var labelsData1 = bars.data().slice(0, 4),
        labelsData2 = bars.data().slice(4);

    barLabels = barSvg.selectAll(".label1")  		
	  .data(labelsData1)
	  .enter()
	  .append("text")
	  .attr("class","label")
	  .attr("x", (function(d) { return x(d[1]) / 2 }  ))
      .attr("y", (d, i) => {return y(d.data.q) + y.bandwidth() * 1.4 })
      .text(function(d) { return d.data.val1 + "%" })
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);  
      

    barLabels2 = barSvg.selectAll("label2")  		
        .data(labelsData2)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", function(d) { 
            var diff = d[1] - d[0];

            return x( d[1] - diff / 2 ); 
        }  )
        .attr("y", (d, i) => {return y(d.data.q) + y.bandwidth() * 1.4 })
        .text(function(d) { return d.data.val2 + "%" })
        .style("opacity", 0)
        .transition()
        .delay(1000)
        .duration(500)
        .style("opacity", 1);



    barLabels = barSvg.selectAll(".label3")  		
        .data(labelsData2)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", (function(d)  { return x(d[1]) + 10 }  ))
        .attr("y", (d, i) => {return y(d.data.q) + y.bandwidth() * .6 })
        .text(function(d) { return d.data.total + "%"})
        .style("opacity", 0)
        .transition()
        .delay(1000)
        .duration(500)
        .style("opacity", 1);
}



window.addEventListener('load', function () {
    drawDonutChart();
    drawBarChart();
    updateDonutChart();
    updateBarChart();
})