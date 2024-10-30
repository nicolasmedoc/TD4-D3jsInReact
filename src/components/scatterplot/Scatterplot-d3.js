import * as d3 from 'd3'
import { getDefaultFontSize } from '../../utils/helper';

class ScatterplotD3 {
    margin = {top: 100, right: 10, bottom: 50, left: 100};
    size;
    height;
    width;
    matSvg;
    // add specific class properties used for the vis render/updates
    circleRadius = 3;
    selectedCircleRadius = 10;
    xScale;
    yScale;


    constructor(el){
        this.el=el;
    };

    create = function (config) {
        this.size = {width: config.size.width, height: config.size.height};

        // get the effect size of the view by subtracting the margin
        this.width = this.size.width - this.margin.left - this.margin.right;
        this.height = this.size.height - this.margin.top - this.margin.bottom;

        // initialize the svg and keep it in a class property to reuse it in renderMatrix()
        this.matSvg=d3.select(this.el).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("class","matSvgG")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        ;

        this.xScale = d3.scaleLinear().range([0,this.width]);
        this.yScale = d3.scaleLinear().range([0,this.height]);

        // build xAxisG
        this.matSvg.append("g")
            .attr("class","xAxisG")
            .attr("transform","translate(0,"+this.height+")")
        ;
        this.matSvg.append("g")
            .attr("class","yAxisG")
        ;
    }

    updatePoints(selection){
        // transform selection
        selection
            .transition().duration(500)
            .attr("transform", (itemData)=>{
             // use scales to return shape position from data values
            const xPos = this.xScale(itemData.nbProductSold);
            const yPos = this.yScale(itemData.salesGrowth);
            return "translate("+xPos+","+yPos+")";
        })

        selection.select(".pointCircle")
            .attr("stroke-width",(cellData)=>{
                return cellData.selected?2:0;
            })
            .attr("r",(cellData)=>{
                return cellData.selected?this.selectedCircleRadius:this.circleRadius;
            })

        ;
    }


    updateAxis = function(visData){
        const minNbProductSold = d3.min(visData.genData.map(cellData=>cellData.nbProductSold));
        const maxNbProductSold = d3.max(visData.genData.map(cellData=>cellData.nbProductSold));
        this.xScale.domain([minNbProductSold, maxNbProductSold]);
        const minSalesGrowth = d3.min(visData.genData.map(cellData=>cellData.salesGrowth));
        const maxSalesGrowth = d3.max(visData.genData.map(cellData=>cellData.salesGrowth));
        this.yScale.domain([minSalesGrowth, maxSalesGrowth]);

        this.matSvg.select(".xAxisG")
            .transition().duration(500)
            .call(d3.axisBottom(this.xScale))
        ;
        this.matSvg.select(".yAxisG")
            .transition().duration(500)
            .call(d3.axisLeft(this.yScale))
        ;
    }


    renderScatterplot = function (visData, controllerMethods){
        // build the size scales and x,y axis
        this.updateAxis(visData);

        this.matSvg.selectAll(".pointG")
            // all elements with the class .cellG (empty the first time)
            .data(visData.genData,(itemData)=>itemData.index)
            .join(
                enter=>{
                    // all data items to add:
                    // doesn’exist in the select but exist in the new array
                    const itemG=enter.append("g")
                        .attr("class","pointG")
                        .on("click", (event,itemData)=>{
                            controllerMethods.handleOnClick(itemData);
                        })
                        .on("mouseenter",(event,cellData)=>{
                            controllerMethods.handleOnMouseEnter(cellData);
                        })
                        .on("mouseleave",(event,cellData)=>{
                            controllerMethods.handleOnMouseEnter();
                        })
                    ;
                    // render element as child of each element "g"
                    itemG.append("circle")
                        .attr("class","pointCircle")
                        .attr("cx",this.circleRadius/2)
                        .attr("cy",this.circleRadius/2)
                        .attr("r",this.circleRadius)
                        .attr("stroke","red")
                    ;
                    this.updatePoints(itemG);
                },
                update=>{this.updatePoints(update)},
                exit =>{
                    exit.remove()
                    ;
                }

            )
    }

    clear = function(){
        d3.select(this.el).selectAll("*").remove();
    }
}
export default ScatterplotD3;