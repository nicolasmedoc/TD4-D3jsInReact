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

        // get the effect size of the view by substracting the margin
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

    renderMatrix = function (matrixData, controllerMethods){
        // build the size scale from the data
        const minNbProductSold = d3.min(matrixData.genData.map(cellData=>cellData.nbProductSold));
        const maxNbProductSold = d3.max(matrixData.genData.map(cellData=>cellData.nbProductSold));
        const cellSizeScale = d3.scaleLinear()
            .domain([minNbProductSold, maxNbProductSold])
            .range([2, this.radius-1])
        ;
        // build the color scale from the data
        const colorScheme = d3.schemeYlGnBu[9];
        const cellColorScale = d3.scaleQuantile(colorScheme);
        cellColorScale.domain(matrixData.genData.map(cellData=>cellData.salesGrowth));

        // add the g and translate the position of cells
        const cellG = this.matSvg.selectAll(".cellG")
            .data(matrixData.genData,(cellData)=>cellData.index)
            .enter()
            .append("g")
            .attr("class","cellG")
            .attr("transform",(cellData)=>{
                return "translate("+(cellData.colPos*this.cellSize)+", "+(cellData.rowPos*this.cellSize)+")"
            })
        ;
        // render a rect as child of each element "g"
        cellG.append("rect")
            .attr("class","CellRect")
            .attr("width",this.cellSize-1)
            .attr("height",this.cellSize-1)
            .attr("fill","lightGray")
        ;

        // render a circle as child of each element "g"
        cellG.append("circle")
            .attr("class","CellCircle")
            .attr("cx",this.radius)
            .attr("cy",this.radius)
            .attr("r",(cellData)=>cellSizeScale(cellData.nbProductSold))
            .attr("fill",(cellData) =>{
                const color =  cellColorScale(cellData.salesGrowth);
                return color;
            })
        ;
    }

    clear = function(){
        d3.select(this.el).selectAll("*").remove();
    }
}
export default MatrixD3;