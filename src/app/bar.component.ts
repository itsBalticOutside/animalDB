import { Component, Input,OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import WebService from "./web.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent {

  private svg: any;
  private margin = 35;
  private width = 250 - (this.margin * 2);
  private height = 250 - (this.margin * 2);
  url: any;
  animal_Data: any;

  constructor(private route: ActivatedRoute, private webService: WebService) { }

//Input to retrieve Species
  @Input() Species: any;
  id: string = 'bar-' + Math.random().toString(36).substr(2, 5);

  private drawBars(data: any[]): void {
   // Remove previous chart
    d3.select(`#${this.id} svg`).remove();
 
    // Create SVG element
    const svg = d3
      .select(`#${this.id}`)
      .append('svg')
      .attr('width', this.width + (this.margin * 2))
      .attr('height', this.height + (this.margin * 2))
      .append('g')
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d._id))
      .padding(0.2);

    // Draw the X-axis on the DOM
    svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, 5])
      .range([this.height, 0]);
        
   
    // Draw the Y-axis on the DOM
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5));

    // Create and fill the bars
    svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d._id)!)
      .attr('y', (d: any) => y(d.genderCount))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.genderCount))
      .attr('fill', '#d04a35');
  }
 
  ngOnInit(): void {
  
      //Creating url to retreive genderCount
      this.url = 'http://localhost:5000/api/v1.0/animals/' + this.Species 
        + '/query/genderCount' 

      //Assinging data and plotting graph, Done inside subscribe{} 
      // so server has time to retieve data
      d3.json(this.url).then(data=> {
        const chartData = data as ChartDataType[];
        this.drawBars(chartData);
      });

   

    type ChartDataType ={
      Gender: string,
      GenderCount: number,
    }
 
}
}
