const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

d3.json(url).then(data => {
  const dataset = data.data;

  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select('#svg-container')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
              .domain(dataset.map(d => d[0]))
              .range([0, width])
              .padding(0.1);

  const y = d3.scaleLinear()
              .domain([0, d3.max(dataset, d => d[1])])
              .nice()
              .range([height, 0]);

  // X axis
  svg.append('g')
     .attr('id', 'x-axis')
     .attr('transform', `translate(0,${height})`)
     .call(d3.axisBottom(x));

  // Y axis
  svg.append('g')
     .attr('id', 'y-axis')
     .call(d3.axisLeft(y));

  // Title
  svg.append('text')
     .attr('id', 'title')
     .attr('x', width / 2)
     .attr('y', -10)
     .style('text-anchor', 'middle')
     .text('United States GDP');

  // Bars
  svg.selectAll('.bar')
     .data(dataset)
     .enter()
     .append('rect')
     .attr('class', 'bar')
     .attr('data-date', d => d[0])
     .attr('data-gdp', d => d[1])
     .attr('x', d => x(d[0]))
     .attr('y', d => y(d[1]))
     .attr('width', x.bandwidth())
     .attr('height', d => height - y(d[1]))
     .attr('class', 'bar')
     .on('mouseover', function(event, d) {
       const [date, gdp] = d;
       const tooltip = d3.select('#tooltip')
                         .style('left', `${event.pageX + 10}px`)
                         .style('top', `${event.pageY + 10}px`)
                         .style('display', 'block')
                         .attr('data-date', date)
                         .html(`Date: ${date}<br>GDP: $${gdp.toFixed(1)} Billion`);
     })
     .on('mouseout', () => {
       d3.select('#tooltip').style('display', 'none');
     });
});
 