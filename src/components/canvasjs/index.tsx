import React from "react";
import CanvasJSReact from "./lib/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const CanvasJS = ({ data = {} }) => {
  let chartRef: any = undefined;

  const toogleDataSeries = (e: any) => {
    console.log("chartRef", e, chartRef);

    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }

    chartRef.render();
  };

  return (
    <div>
      <CanvasJSChart
        onRef={(ref: any) => (chartRef = ref)}
        options={{
          ...data,
          legend: {
            itemclick: toogleDataSeries
          }
        }}
      />
    </div>
  );
};

export default CanvasJS;
