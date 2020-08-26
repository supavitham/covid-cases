import React, { Component } from "react";
import CanvasJSReact from "../assets/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Covid extends Component {

    constructor(props) {
    super(props);
    this.state = {
        newDataCovid : new Map(),
        dateShowRealTime : "",
        indexOfdate : 0
    }
  }

    componentWillReceiveProps(nextProps) { // จะทำงานก่อนการ render()
    console.log("componentWillReceiveProps");
        const { covids } = nextProps;
        let newMap = new Map();
        covids.forEach( item => {
            //console.log("item >",item)
            var cases = new Map(Object.entries(item.timeline.cases));
            //console.log("cases" ,cases)
            var country = item.country;
            cases.forEach( (numCase , date) => {
                //console.log("k,v " ,date," : ",numCase)
                var findKeyDate = newMap.get(date);
                if (findKeyDate != undefined) {
                    findKeyDate.set(country, numCase);
                }else {
                    var temp = new Map();
                    temp.set(country, numCase);
                    newMap.set(date, temp);
                }
            })
        })
        console.log("newMap ",newMap);
        //var f = newMap.keys().next().value;
        //console.log("newMapkeys ",newMap.keys());
        let keys = Array.from( newMap.keys() );
        this.setState({newDataCovid : newMap, dateShowRealTime : keys[0], indexOfdate  : 0})
    }

    componentDidMount(){ 
        this.timerID = setInterval(() => {
            var DateDay;
            DateDay = Array.from(this.state.newDataCovid.keys())[this.state.indexOfdate +1]
            //console.log("DateDay ", DateDay)
            if(DateDay != undefined){
                this.setState({ indexOfdate: this.state.indexOfdate + 1 })
                this.setState({ dateShowRealTime : DateDay})
            }else{
                var dateBegin = Array.from(this.state.newDataCovid.keys())[0]
                //console.log("dateBegin >> ",dateBegin)
                this.setState({ dateShowRealTime : dateBegin,indexOfdate : 0})
                
            }
        },2000)
    }

    showCovid(){
        var dataPoints = [];
        var dateBegin = this.state.newDataCovid.get(this.state.dateShowRealTime) || new Map();
        var newDataSort = new Map();
        //console.log("dataBegin ", dateBegin);
        dateBegin[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        }
        for (let [key, value] of dateBegin) {
            newDataSort.set(key,value)
        }
       
        newDataSort.forEach(( numCase,date) =>{
            dataPoints.push({ y: numCase, label: date });
        })
        const options = {
            animationEnabled: true,
            theme: "light2",
            title: {
              text: "covid Case " + this.state.dateShowRealTime,
            },
            axisX: {
              title: "countries",
              reversed: true,
            },
            axisY: {
              title: "จำนวนผู้ติดเชื้อ",
              includeZero: true,
              labelFormatter: this.addSymbols,
            },
            data: [
              {
                type: "bar",
                dataPoints: dataPoints,
              },
            ],
          };
            return (
            <div>
              <CanvasJSChart options={options} />
            </div>
            );
    }   

    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1) order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
      }

    render(){
    const { covids } = this.props;
      return(
        <div className="container-fluid">
        <div className="col-md-12">
        {this.showCovid()}
        </div>
        </div>
      )
  }
}

export default Covid;
