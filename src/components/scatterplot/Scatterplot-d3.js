import * as d3 from 'd3'
import { getDefaultFontSize } from '../../utils/helper';

class ScatterplotD3 {
    margin = {top: 100, right: 10, bottom: 50, left: 100};
    size;
    height;
    width;
    matSvg;
    // add specific class properties used for the vis render/updates
    defaultOpacity=0.3;
    transitionDuration=1000;
    circleRadius = 3;
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
        this.yScale = d3.scaleLinear().range([this.height,0]);

        // build xAxisG
        this.matSvg.append("g")
            .attr("class","xAxisG")
            .attr("transform","translate(0,"+this.height+")")
        ;
        this.matSvg.append("g")
            .attr("class","yAxisG")
        ;
    }

    changeBorderAndOpacity(selection){
        selection.style("opacity", (item)=>{
            return item.selected?1:this.defaultOpacity;
        })
        ;

        selection.select(".dotCircle")
            .attr("stroke-width",(item)=>{
                return item.selected?2:0;
            })
        ;
    }

    updateDots(selection,xAttribute,yAttribute){
        // transform selection
        selection
            .transition().duration(this.transitionDuration)
            // .attr("transform", (item)=>{
            //     // use scales to return shape position from data values
            // })
        this.changeBorderAndOpacity(selection)
    }

    highlightSelectedItems(selectedItems){
        // this.changeBorderAndOpacity(updateSelection);
        this.matSvg.selectAll(".dotG")
            // all elements with the class .cellG (empty the first time)
            .data(selectedItems,(itemData)=>itemData.index)
            .join(
                enter=>enter,
                update=>{
                    this.changeBorderAndOpacity(update);
                },
                exit => exit
            )
        ;
    }

    updateAxis = function(visData,xAttribute,yAttribute){
        // compute min max using d3.min/max(item=>item.attribute)
        // this.xScale.domain(...);
        // this.yScale.domain(...);

        // create axis with computed scales
    }


    renderScatterplot = function (visData, xAttribute, yAttribute, controllerMethods){
        // build the size scales and x,y axis
        this.updateAxis(visData,xAttribute,yAttribute);

        this.matSvg.selectAll(".dotG")
            // all elements with the class .cellG (empty the first time)
            .data(visData,(itemData)=>itemData.index)
            .join(
                enter=>{
                    // all data items to add:
                    // doesn’exist in the select but exist in the new array
                    const itemG=enter.append("g")
                        .attr("class","dotG")
                        .style("opacity",this.defaultOpacity)
                        .on("click", (event,itemData)=>{
                            controllerMethods.handleOnClick(itemData);
                        })
                    ;
                    // render element as child of each element "g"
                    itemG.append("circle")
                        .attr("class","dotCircle")
                        .attr("r",this.circleRadius)
                        .attr("stroke","red")
                    ;
                    this.updateDots(itemG,xAttribute,yAttribute);
                },
                update=>{
                    this.updateDots(update,xAttribute,yAttribute)
                },
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