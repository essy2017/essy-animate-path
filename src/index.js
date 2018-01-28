import {
  axisBottom as d3_axisBottom,
  axisLeft as d3_axisLeft,
  curveLinear as d3_curveLinear,
  line as d3_line,
  max as d3_max,
  scaleLinear as d3_scaleLinear,
  select as d3_select,
  transition as d3_transition
} from 'd3';

const margin      = { top: 10, right: 10, bottom: 20, left: 30 };
const outerWidth  = 800;
const outerHeight = 300;
const innerWidth  = outerWidth - margin.left - margin.right;
const innerHeight = outerHeight - margin.top - margin.bottom;
const parentNode  = d3_select('#example-line');

let showSegment   = false;
let data          = [];
let lastY         = 5;
let point         = 0;

// Create data set.
for (let i = 0; i < 20; i++) {
  const nextY = lastY * (1 + 0.5*(Math.random() - 0.5));
  data.push(nextY);
  lastY = nextY;
}

// Create checkbox to show segment.
parentNode.append('input')
  .attr('type', 'checkbox')
  .on('change', function () {
    d3_select('#path-seg').attr('stroke', this.checked ? '#b44' : 'none');
  });
parentNode.append('span').text('Show segment');

// Create button to update on click.
parentNode.append('button')
  .text('Update')
  .on('click', update);

// Text to show x position.
const text = parentNode.append('span');

// Create main svg element.
const svg = parentNode.append('svg')
  .attr('width', outerWidth)
  .attr('height', outerHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Create scales and axes.
const x     = d3_scaleLinear().domain([0, data.length - 1]).range([0, innerWidth]).nice();
const y     = d3_scaleLinear().domain([0, d3_max(data)]).range([innerHeight, 0]).nice();
const xAxis = d3_axisBottom(x);
const yAxis = d3_axisLeft(y);

// Render axes.
svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + innerHeight + ')')
  .call(xAxis);

svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);

// Render line.
const line = d3_line()
  .curve(d3_curveLinear)
  .x( (d, i) => x(i))
  .y( d => y(d));

svg.append('path')
  .datum(data)
  .attr('id', 'line')
  .attr('fill', 'none')
  .attr('stroke-width', 2)
  .attr('stroke', 'steelblue')
  .attr('d', line);

// Render line segment that we'll animate along.
const lineSeg = d3_line()
  .curve(d3_curveLinear)
  .x( (d, i) => x(i))
  .y( d => y(d))

const pathSeg = svg.append('path')
  .datum(data)
  .attr('id', 'path-seg')
  .attr('fill', 'none')
  .attr('stroke-width', 2)
  .attr('stroke', 'none');

// Render marker.
const marker = svg.append('circle')
  .attr('id', 'marker')
  .attr('r', 5)
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('fill', '#fff')
  .attr('stroke-width', 2)
  .attr('stroke', 'steelblue')
  .attr('transform', 'translate(' + x(point) + ',' + y(data[point]) + ')');

update();

// Updates position of marker.
function update () {

  // Get the next point.
  const nextPoint = Math.floor(Math.random() * (data.length - 1));

  // Only include points between existing and new point.
  lineSeg.defined( (d, i) =>
    i <= nextPoint && i >= point || i <= point && i >= nextPoint
  );

  // Update path.
  pathSeg.attr('d', lineSeg);

  // Transition marker from point to nextPoint.
  marker.transition().duration(2000)
    .attrTween('transform', nextPoint > point ? translateRight(pathSeg.node()) : translateLeft(pathSeg.node()))
    .on('end', () => { point = nextPoint; });

  text.text('x = ' + nextPoint);
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
