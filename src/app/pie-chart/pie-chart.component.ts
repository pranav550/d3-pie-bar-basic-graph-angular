import { Component, OnInit } from '@angular/core';
import { StatsPieChart } from '../data/data';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  title = 'D3 Pie Chart in Angular 10';

  margin = {top: 20, right: 20, bottom: 30, left: 50};
  width: number;
  height: number;
  radius: number;
  legendText:any=[];
  legend:any;
  arc: any;
  labelArc: any;
  labelPer: any;
  pie: any;
  color: any;
  svg: any;

  constructor() {
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;
  }

  ngOnInit() {
    this.initSvg();
    this.drawPie();
    this.setLegend()
  }

  initSvg() {
    this.color = d3Scale.scaleOrdinal()
        .range(['#FFA500', '#00FF00', '#FF0000', '#6b486b', '#FF00FF', '#d0743c', '#00FA9A']);
    this.arc = d3Shape.arc()
        .outerRadius(this.radius - 10)
        .innerRadius(this.radius/2);
    this.labelArc = d3Shape.arc()
        .outerRadius(this.radius - 40)
        .innerRadius(this.radius - 40);

    this.labelPer = d3Shape.arc()
        .outerRadius(this.radius - 80)
        .innerRadius(this.radius - 80);

    this.pie = d3Shape.pie()
        .sort(null)
        .value((d: any) => d.electionP);

    this.svg = d3.select('#pieChart')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 ' + Math.min(this.width, this.height) + ' ' + Math.min(this.width, this.height))
        .append('g')
        .attr('transform', 'translate(' + Math.min(this.width, this.height) / 2 + ',' + Math.min(this.width, this.height) / 2 + ')');
  }

  drawPie() {
    const g = this.svg.selectAll('.arc')
        .data(this.pie(StatsPieChart))
        .enter().append('g')
        .attr('class', 'arc');
    g.append('path').attr('d', this.arc)
        .style('fill', (d: any) => this.color(d.data.party) );
    g.append('text').attr('transform', (d: any) => 'translate(' + this.labelArc.centroid(d) + ')')
        .attr('dy', '.35em')
        .text((d: any) => d.data.party);

    g.append('text').attr('transform', (d: any) => 'translate(' + this.labelPer.centroid(d) + ')')
        .attr('dy', '.35em')
        .text((d: any) => d.data.electionP + '%');
  }

  setLegend(){
    console.log(StatsPieChart)
    StatsPieChart.forEach(data=>{
      console.log(data)
      this.legendText.push(data.party+"-"+data.electionP)
    })
    this.legend = d3.select("#legend").append("svg")
    .attr("class", "legend")
    .attr("width", 140)
    .attr("height", 200)
    .selectAll("g")
    .data(d3.range(this.legendText.length))//  w  w w.  de  mo 2  s .com
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });
    this.legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", this.color);
    this.legend.append("text")
    .data(this.legendText)
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function(d) {
      return d;
    });
  }
}
