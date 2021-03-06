import React, { useState, useEffect } from 'react';
import './Future.css';
import Header from './header.js';
import Chart from "react-google-charts";
import Popup from "reactjs-popup";
import axios from "axios";
import { useParams } from "react-router";

const FutureOverview = ( props ) => {
  if(props.status === -1) {
    return (
      <futureOverViewBoxBad>
        <h1 className="overViewH1">This Plan Doesn't Look Good!</h1>
      </futureOverViewBoxBad>
    )
  } else if (props.status === 0) {
    return (
      <futureOverViewBoxNeutral>
        <h1 className="overViewH1">This Plan Could Be Better, But Not Bad!</h1>
      </futureOverViewBoxNeutral>
    )
  } else {
    return (
      <futureOverViewBoxGood>
        <h1 className="overViewH1">Great Job! This is a Great Plan!</h1>
      </futureOverViewBoxGood>
    )
  }
}

// const FutureDiagram = ( props ) => {
//   return (
//     <futureDiagramBox>
//       /*<h1 className="overViewH1">{props.title}</h1>
//       <p className="overViewP">{props.text}</p>*/
//     </futureDiagramBox>
//   )
// }

const FutureSummary = ( props ) => {
  if (props.heading === "rec") {
    //if positive cashflow
    if (props.status == 1) {
      //if positive cash flow but future state is more expensive
      if (props.stateDiff > 3) {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Recommendations:</h1>
              <p className="summaryP">{"This plan is looking pretty good! You have a positive cash flow, however you should watch out for the higher costs in " + props.futureState + "."}</p> 
              <p className="summaryP">{props.futureState + " is " + props.stateDiff + "% more expensive to live in compared to " + props.currState + "."}</p>
          </futureSummaryBox>
        )
      } else if (props.stateDiff < -3) {
        //if positive cash flow but future state is less expensive
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Recommendations:</h1>
              <p className="summaryP">{"This plan is looking pretty good! You have a positive cash flow, and " + props.futureState + " is cheaper to live in!."}</p> 
              <p className="summaryP">{props.futureState + " is " + Math.abs(props.stateDiff) + "% cheaper to live in compared to " + props.currState + "."}</p>
          </futureSummaryBox>
        )
      } else {
        //if positive cash flow but future state is neutral
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Recommendations:</h1>
              <p className="summaryP">{"This plan is looking pretty good! You have a positive cash flow, and " + props.futureState + " is about the same to live in."}</p> 
              <p className="summaryP">{"The difference of cost between " + props.futureState + " and " + props.currState + " is " + Math.abs(props.stateDiff) + "%."}</p>
          </futureSummaryBox>
        )
      }
    } else if (props.status == 0) {
        //if neutral cash flow but future state is more expensive
        if (props.stateDiff > 3) {
          return (
            <futureSummaryBox>
              <h1 className="summaryH1">Recommendations:</h1>
                <p className="summaryP">{"This plan is okay. Your cash flow is close to 0, so you should watch out for the higher costs in " + props.futureState + "."}</p> 
                <p className="summaryP">{props.futureState + " is " + props.stateDiff + "% more expensive to live in compared to " + props.currState + "."}</p>
            </futureSummaryBox>)
        } else if (props.stateDiff < -3) {
          //if neutral cash flow but future state is less expensive
          return (
            <futureSummaryBox>
              <h1 className="summaryH1">Recommendations:</h1>
                <p className="summaryP">{"This plan is okay. Your cash flow is close to 0, however because " + props.futureState + " is cheaper to live in, your costs will be lower."}</p> 
                <p className="summaryP">{props.futureState + " is " + Math.abs(props.stateDiff) + "% cheaper to live in compared to " + props.currState + "."}</p>
            </futureSummaryBox>)
        } else {
          return (
            <futureSummaryBox>
              <h1 className="summaryH1">Recommendations:</h1>
                <p className="summaryP">{"This plan is okay. Your cash flow is close to 0. Because " + props.futureState + " is similar to live in, you shouldn't have too much trouble."}</p> 
                <p className="summaryP">{"The difference of cost between " + props.futureState + " and " + props.currState + " is " + Math.abs(props.stateDiff) + "%."}</p>
            </futureSummaryBox>)
        }
    } else {
      //if negative cash flow but future state is more expensive
      if (props.stateDiff > 3) {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Recommendations:</h1>
              <p className="summaryP">{"Your plan needs work. Your cash flow is already negative, so you should watch out for the higher costs in " + props.futureState + "."}</p> 
              <p className="summaryP">{props.futureState + " is " + props.stateDiff + "% more expensive to live in compared to " + props.currState + "."}</p>
          </futureSummaryBox>
        )
      } else if (props.stateDiff < -3) {
        //if negative cash flow but future state is less expensive
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Recommendations:</h1>
              <p className="summaryP">{"Your plan needs work. Your cash flow is negative, however because " + props.futureState + " is cheaper to live in, your costs will be lower."}</p> 
              <p className="summaryP">{props.futureState + " is " + Math.abs(props.stateDiff) + "% cheaper to live in compared to " + props.currState + "."}</p>
          </futureSummaryBox>
        )
      } else {
        //if negative cash flow but future state comparable
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Recommendations:</h1>
              <p className="summaryP">{"Your plan needs work. Your cash flow is negative, however because " + props.futureState + " is about the same to live in, your cost of living wont change too much."}</p> 
              <p className="summaryP">{"The difference of cost between " + props.futureState + " and " + props.currState + " is " + Math.abs(props.stateDiff) + "%."}</p>
          </futureSummaryBox>
        )
      }
    }
  } 
  if (props.heading === "outlook") {
    //postive cash flow
    if (props.status == 1) {
      if (props.stateDiff > 3) {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan is good! You have a positive cash flow, however you should watch out for the higher costs in " + props.futureState + "."}</p> 
          </futureSummaryBox>
        )
      } else if (props.stateDiff < -3) {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan is good! You have a positive cash flow and costs in " + props.futureState + " is lower than " + props.currState + "."}</p> 
          </futureSummaryBox>
        )
      } else {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan is good! The costs in " + props.futureState + " is similar to " + props.currState + "."}</p> 
          </futureSummaryBox>
        ) 
      }
    } else if (props.status == 0) {
      if (props.stateDiff > 3) {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan could be better. You are close to equal cash flow, however you should watch out for the higher costs in " + props.futureState + "."}</p> 
          </futureSummaryBox>
        )
      } else if (props.stateDiff < -3) {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan could be better. You are close to equal cash flow, however costs in " + props.futureState + " is lower than " + props.currState + " so be mindful of spending."}</p> 
          </futureSummaryBox>
        )
      } else {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan could be better. However the costs in " + props.futureState + " is similar to " + props.currState + " so be mindful of spending."}</p> 
          </futureSummaryBox>
        ) 
      }
    } else {
      if (props.stateDiff > 3) {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan does not look great. You have negative cash flow, and " + props.futureState + " is more expensive to live in. Possibly consider a different plan."}</p> 
          </futureSummaryBox>
        )
      } else if (props.stateDiff < -3) {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan does not look great. You have negative cash flow. However costs in " + props.futureState + " is lower than " + props.currState + " so this plan could work out, but not very likely."}</p> 
          </futureSummaryBox>
        )
      } else {
        return (
          <futureSummaryBox>
            <h1 className="summaryH1">Outlook:</h1>
              <p className="summaryP">{"The outlook on this plan does not look great. However the costs in " + props.futureState + " is similar to " + props.currState + ". But because of your negative cash flow, possibly reconsider your plan."}</p> 
          </futureSummaryBox>
        ) 
      }
    }
  }
}


const Future = (props) => {
  let futureID = useParams();
  let [pieData, setPieData] = useState([]);
  let [barData, setBarData] = useState([]);
  let [cashFlow, setCashFlow] = useState();
  let [financialIndicator, setFinancialIndicator] = useState();
  let [stateCost, setStateCost] = useState();
  let [currState, setCurrState] = useState();
  let [futureState, setFutureState] = useState();
  useEffect(() => {
    console.log("in use effect in future page");
    console.log(futureID);
    axios.get("/future", {params: {id: futureID}, headers: {Authorization: 'Bearer ' + localStorage.token}}).then(function(response) {

      //console.log(response.data);
      setPieData(response.data.pieChart);
      setBarData(response.data.barChart);
      setCashFlow(response.data.cashFlow);
      setFinancialIndicator(response.data.financialIndicator);
      setStateCost(parseFloat(response.data.stateCost));
      setCurrState(response.data.currState);
      setFutureState(response.data.futureState);
    });
  }, []);
  return (
    <>
      <Header/>
      <futureOverall>
        <FutureOverview status={financialIndicator}/>
      </futureOverall>
      <futureGraph>
        <futureDiagramBox>
            <Chart
              width={'100%'}
              height={'300px'}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={pieData}
              options={{
                chartArea: {left: '5%', right: '5%',},
                //backgroundColor: 'red',
                title: 'Overall Expenses',
                // Just add this option
                is3D: true,
              }}
              rootProps={{ 'data-testid': '2' }}
            />
          </futureDiagramBox>
          <futureDiagramBox>
            <Chart
              width={'600px'}
              height={'300px'}
              chartType="ColumnChart"
              loader={<div>Loading Chart</div>}
              data={barData}
              options={{
                chartArea: {left: '10%', right: '12%',},
                chart: {title: 'Income In vs. Out'},
                vAxis: { title: 'Money', },
                //hAxis: { title: 'Cash Flow' ,},
                //backgroundColor: 'yellow',
              }}
              // For tests
              rootProps={{ 'data-testid': '3' }}
            />
        </futureDiagramBox>
      </futureGraph>
      <futureSummary>
        <FutureSummary heading="rec" status={financialIndicator} stateDiff={stateCost} currState={currState} futureState={futureState} />
      </futureSummary>
      <futureSummary>
        <FutureSummary heading="outlook" status={financialIndicator} cashFlows={cashFlow} stateDiff={stateCost} futureState={futureState} currState={currState} />
      </futureSummary>
    </>
  )
}

export default Future;
