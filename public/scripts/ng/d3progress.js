
angular.module('myApp')
  .directive('d3progress', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="wow fadeIn progress-graph"></div>',
    scope: {
      // creates a scope variable in your directive
      // called `dataset` bound to whatever was passed
      // in via the `dataset` attribute in the DOM
      dataset: '=dataset'
    },
    link: function(scope, element, attrs) {


  // Set the dimensions of the canvas / graph
              var margin  = {top: 30, right: 20, bottom: 30, left: 100},
                  width   = 400 - margin.left - margin.right,
                  height  = 270 - margin.top - margin.bottom;

              
              // Set the ranges
              var x = d3.scale.linear().range([0, width]);
              var y = d3.scale.linear().range([height, 0]);

              // Define the axes
              var xAxis = d3.svg.axis().scale(x)
              .orient("bottom").ticks(5);

              var yAxis = d3.svg.axis().scale(y)
              .orient("left").ticks(5);

              // Define the line
              var valueline = d3.svg.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(d.tickets); });

              // Adds the svg canvas
              var svg = d3.select(".progress-graph")
              .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
              .append("g")
                  .attr("transform", 
                        "translate(" + margin.left + "," + margin.top + ")");

              // Get the data
              d3.csv("statis.mostaza.csv", function(error, data) {
              data.forEach(function(d) {
                  
                  d.year = parseInt(d.years);
                  d.tickets = parseInt(d.tickets);
              });

              // Scale the range of the data
              x.domain(d3.extent(data, function(d) { return d.year; }));
              y.domain([0, d3.max(data, function(d) { return d.tickets; })]);

              // Add the valueline path.
              svg.append("path")
                  .attr("class", "line")
                  .attr("d", valueline(data));

              // Add the X Axis
              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

              // Add the Y Axis
              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis);

              });

            }

          




}
  


});




