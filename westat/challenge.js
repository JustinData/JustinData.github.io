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
    donutOuterRadius = d3.min([this.donutHeight, this.donutWidth]) / 2 * 0.9,
    donutInnerRadius = this.donutOuterRadius * 0.7;

var arc = d3.arc()
	.innerRadius(donutInnerRadius)
	.outerRadius(donutOuterRadius);

var pie = d3.pie()
    .sort(null)
    // .value(function(d){ return d.value });
    .value(function(d){ console.log("pie d ", d); return d.value.val });
    

var donutSVG = d3.select("#donut-chart-container")
	.append("svg")
	.attr("class", "donut-svg")
	.attr("width", donutWidth)
	.attr("height", donutHeight);

var donutG = donutSVG.append("g")
    .attr('transform', 'translate(' + (donutWidth / 2) + ',' + (donutHeight / 2) + ')');

  
// Create dummy data
var dummyData = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14};
var dummyStartData = {a: 0, b: 0, c:0, d:0, e:0, f:0, g:0, h:0};
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
    var initialData = [
        {type: "state", val: 0},
        {type: "empty", val: 100}
    ];

    donutPaths = donutG.selectAll('path')
        // .data(pie(initialData))
        // .data(pieData)
        .data(pieStartData)
        .enter()
        .append('path')
        .attr("d", arc)
        .attr('fill', function(d){ return(color(d.data.key)) })
        // .attr("stroke", "white")
        // .style("stroke-width", "2px")
        // .style("opacity", 0.7)
        // .attr("class", function(d){ return "arc " + d.data.type })
        .each(function(d){ this._current = d});

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

}









var tempBarData = [{"salesperson":"Bob","sales":33},{"salesperson":"Robin","sales":12},{"salesperson":"Anne","sales":41},{"salesperson":"Mark","sales":16},{"salesperson":"Joe","sales":59},{"salesperson":"Eve","sales":38},{"salesperson":"Karen","sales":21},{"salesperson":"Kirsty","sales":25},{"salesperson":"Chris","sales":30},{"salesperson":"Lisa","sales":47},{"salesperson":"Tom","sales":5},{"salesperson":"Stacy","sales":20},{"salesperson":"Charles","sales":13},{"salesperson":"Mary","sales":29}],
    barData = [
        {qi: 0, q: "question 1 text", val1: 53, val2: 38, total: 91},
        {qi: 1, q: "question 2 text", val1: 31, val2: 51, total: 82},
        {qi: 2, q: "question 3 text", val1: 38, val2: 35, total: 73},
        {qi: 3, q: "question 4 text", val1: 36, val2: 41, total: 77}
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
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    // width = 960 - margin.left - margin.right,
    width = barContainerWidth - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;
    height = barContainerHeight - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.3);

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
  tempBarData.forEach(function(d) {
    d.sales = +d.sales;
  });
  barData.forEach(function(d) {
    d.val1 = +d.val1;
    d.val2 = +d.val2;
  });

  // Scale the range of the data in the domains
//   x.domain([0, d3.max(tempBarData, function(d){ return d.sales; })]);
  x.domain([0, 100])
//   y.domain(tempBarData.map(function(d) { return d.salesperson; }));
  y.domain(barData.map(function(d) { return d.qi; }));
  //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

//   // append the rectangles for the bar chart
//   barSvg.selectAll(".bar")
//     //   .data(tempBarData)
//       .data(barData)
//     .enter().append("rect")
//       .attr("class", "bar")
//       //.attr("x", function(d) { return x(d.sales); })
//     //   .attr("width", function(d) {return x(d.sales); } )
//       .attr("width", function(d) {return x(d.val1); } )
//     //   .attr("y", function(d) { return y(d.salesperson); })
//       .attr("y", function(d) { return y(d.q); })
//       .attr("height", y.bandwidth());


    barSvg.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
        .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", (d, i) => y(d.data.qi))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth());

  // add the x Axis
//   barSvg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

  // add the y Axis
  barSvg.append("g")
      .call(d3.axisLeft(y));






window.addEventListener('load', function () {
    drawDonutChart();
    // drawBarChart();
    updateDonutChart();
    // updateBarChart();
})