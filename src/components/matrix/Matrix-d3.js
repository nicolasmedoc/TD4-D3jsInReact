import * as d3 from 'd3'
import { getDefaultFontSize } from '../../utils/helper';

class MatrixD3{
    margin = {top: 100, right: 5, bottom: 5, left: 100};
    marginLabelsToMatrix=5;
    size;
    height;
    width;
    matSvg;
    cellSize= 34;
    radius = this.cellSize / 2;
    fontSize = getDefaultFontSize();
    transitionDuration = 2000;
    colorScheme = d3.schemeYlGnBu[9];
    cellColorScale = d3.scaleQuantile(this.colorScheme);
    cellSizeScale = d3.scaleLinear()
        .range([2, this.radius-1])
    ;


    constructor(el){
        this.el=el;
    };

    create = function (config) {
        this.size = {width: config.size.width, height: config.size.height};

        // adapt the size locally to create a square svg
        if (this.size.width > this.size.height) {
            this.size.width = this.size.height;
        } else {
            this.size.height = this.size.width;
        }

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


    }

    updateCells(selection){
        selection.attr("transform",(cellData)=>{
            return "translate("+(cellData.colPos*this.cellSize)+","+(cellData.rowPos*this.cellSize)+")"
        })
        ;
        selection.select(".CellCircle")
            .attr("r",(cellData)=>this.cellSizeScale(cellData.nbProductSold))
            .attr("fill",(cellData) =>{
                const color = this.cellColorScale(cellData.salesGrowth);
                return color;
            })
            .attr("stroke-width",(cellData)=>{
                return cellData.selected?2:0;
            })
        ;
    }


    renderMatrix = function (matrixData, controllerMethods){
        // build the size scale from the data
        const minNbProductSold = d3.min(matrixData.genData.map(cellData=>cellData.nbProductSold));
        const maxNbProductSold = d3.max(matrixData.genData.map(cellData=>cellData.nbProductSold));
        this.cellSizeScale.domain([minNbProductSold, maxNbProductSold])
        // build the color scale from the data
        this.cellColorScale.domain(matrixData.genData.map(cellData=>cellData.salesGrowth));

        this.matSvg.selectAll(".cellG")
            // all elements with the class .cellG (empty the first time)
            .data(matrixData.genData,(cellData)=>cellData.index)
            .join(
                enter=>{
                    // all data items to add:
                    // doesn’exist in the select but exist in the new array
                    const cellG=enter.append("g")
                        .attr("class","cellG")
                        .on("click", (event,cellData)=>{
                            controllerMethods.handleOnClick(cellData);
                        })
                        .on("mouseenter",(event,cellData)=>{
                            controllerMethods.handleOnMouseEnter(cellData);
                        })
                        .on("mouseleave",(event,cellData)=>{
                            controllerMethods.handleOnMouseEnter();
                        })

                    ;
                    // render rect as child of each element "g"
                    cellG.append("rect")
                        .attr("class","CellRect")
                        .attr("width",this.cellSize-1)
                        .attr("height",this.cellSize-1)
                        .attr("fill","lightGray")
                    ;
                    // render circle as child of each element "g"
                    cellG.append("circle")
                        .attr("class","CellCircle")
                        .attr("cx",this.radius)
                        .attr("cy",this.radius)
                        .attr("stroke","red")
                    ;
                    this.updateCells(cellG);
                },
                update=>{this.updateCells(update)},
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
export default MatrixD3;