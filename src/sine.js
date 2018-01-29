import {
  axisBottom  as d3_axisBottom,
  axisLeft    as d3_axisLeft,
  curveBasis  as d3_curveBasis,
  extent      as d3_extent,
  line        as d3_line,
  scaleLinear as d3_scaleLinear,
  select      as d3_select,
  transition  as d3_transition
} from "d3";

const margin      = { top: 10, right: 10, bottom: 20, left: 30 };
const outerWidth  = 800;
const outerHeight = 300;
const innerHeight = outerHeight - margin.top - margin.bottom;
const innerWidth  = outerWidth - margin.left - margin.right;
const parentNode  = d3_select('#example-sine');

// Generates x value with specified increment.
function xValues (incr) {
  let values = [];
  let i = -2;
  while (i <= 2) {
    values.push(i * Math.PI);
    i = Number((i + incr).toFixed(1));
  }
  return values;
}

// Create data set and initial x point for marker.
const data = xValues(0.1).map( d => [d, Math.sin(d)] );
let point  = -2*Math.PI;

// Create checkbox to show or hide line segment path.
parentNode.append('input')
  .attr('type', 'checkbox')
  .on('change', function () {
    d3_select('#path-seg-sine').attr('stroke', this.checked ? '#b44' : 'none');
  });
parentNode.append('span').text('Show segment');

// Create button to update on click.
parentNode.append('button')
  .text('Update')
  .on('click', update);

// Text to show current x value.
const text = parentNode.append('span');

// Main svg element.
const svg = parentNode.append('svg')
  .attr('width', outerWidth)
  .attr('height', outerHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Scales and axes.
const x     = d3_scaleLinear().domain(d3_extent(data, d => d[0])).range([0, innerWidth]);
const y     = d3_scaleLinear().domain([-1.5, 1.5]).range([innerHeight, 0]).nice();
const xAxis = d3_axisBottom(x).tickFormat(d => (d / Math.PI) + 'π').tickValues(xValues(0.5));;
const yAxis = d3_axisLeft(y);

svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + innerHeight + ')')
  .call(xAxis);

svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);

const line = d3_line()
  .curve(d3_curveBasis)
  .x(d => x(d[0]))
  .y(d => y(d[1]));

svg.append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke-width', 2)
  .attr('stroke', 'steelblue')
  .attr('d', line);

const lineSeg = d3_line()
  .curve(d3_curveBasis)
  .x(d => x(d[0]))
  .y(d => y(d[1]));

const pathSeg = svg.append('path')
  .datum(data)
  .attr('id', 'path-seg-sine')
  .attr('fill', 'none')
  .attr('stroke-width', 2)
  .attr('stroke', 'none');

const marker = svg.append('circle')
  .attr('r', 5)
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('fill', '#fff')
  .attr('stroke-width', 2)
  .attr('stroke', 'steelblue')
  .attr('transform', 'translate(' + x(point) + ',' + y(Math.sin(point)) + ')');

update();

// Updates marker position.
function update () {

  const nextPoint = (-2 + 4*Math.random()) * Math.PI;

  // Insert [nextPoint, Math.sin(nextPoint)] into data set.
  for (let i = 0; i < data.length - 1; i++) {
    if (nextPoint >= data[i][0] && nextPoint <= data[i + 1][0]) {
      data.splice(i + 1, 0, [nextPoint, Math.sin(nextPoint)]);
      break;
    }
  }

  // Update line segment and path.
  lineSeg.defined( d =>
    d[0] <= nextPoint && d[0] >= point || d[0] <= point && d[0] >= nextPoint
  );
  pathSeg.attr('d', lineSeg);

  // Transition marker from point to nextPoint.
  marker.transition().duration(1500)
    .attrTween('transform', nextPoint > point ? translateRight(pathSeg.node()) : translateLeft(pathSeg.node()))
    .on('end', () => { point = nextPoint; });

  text.text('x = ' + nextPoint.toFixed(3));
}

// Tween function for moving to right.
function translateRight (node) {
  const l = node.getTotalLength();
  return () => {
    return (t) => {
      const p = node.getPointAtLength(t * l);
      return 'translate(' + p.x + ',' + p.y + ')';
    };
  };
}

// Tween function for moving to left.
function translateLeft (node) {
  const l = node.getTotalLength();
  return () => {
    return (t) => {
      const p = node.getPointAtLength((1 - t) * l);
      return 'translate(' + p.x + ',' + p.y + ')';
    };
  };
}
