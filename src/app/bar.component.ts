import { Component } from '@angular/core';
import * as d3 from 'd3';
import { WebService } from "./web.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent {

  private svg: any;
  private margin = 50;
  private width = 300 - (this.margin * 2);
  private height = 300 - (this.margin * 2);
  url: any;
  animal_Data: any;

  constructor(private route: ActivatedRoute, private webService: WebService) { }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map(d => d._id))
    .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 5])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d: any) => x(d._id))
    .attr("y", (d: any) => y(d.genderCount))
    .attr("width", x.bandwidth())
    .attr("height", (d: any) => this.height - y(d.genderCount))
    .attr("fill", "#d04a35");
  }
 
  ngOnInit(): void {

    // Getting gender data
    //Getting species name to create endpoint URL
    this.webService.getAnimal(this.route.snapshot.params['Species'],this.route.snapshot.params['id']).subscribe(data => {
      this.animal_Data = data
      //Creating url to retreive genderCount
      this.url = 'http://localhost:5000/api/v1.0/animals/' + this.animal_Data[0]['Species'] 
        + '/query/genderCount' 

      //Assinging data and plotting graph, Done inside subscribe{} 
      // so server has time to retieve data
      d3.json(this.url).then(data=> {
        const chartData = data as ChartDataType[];
        this.drawBars(chartData);
      });
    });

    this.createSvg();

    type ChartDataType ={
      Gender: string,
      GenderCount: number,
    }
 
}
}
