import React from "react";
import { storiesOf } from "@storybook/react";
import { Query } from "react-apollo";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { toDate, format } from "date-fns";
import Hammer from "hammerjs";
import * as zoom from "chartjs-plugin-zoom";

import { ChartJS, CanvasJS } from "../src/components";

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

const query = gql`
  {
    getTimelineEvents {
      sensors {
        sensorName
        value
        legend
        time
        eventTime
        distance
      }
      sensorList {
        name
        sensorId
        legend
      }
    }
  }
`;

const options = {
  scales: {
    xAxes: [
      {
        // type: "time",
        distribution: "series",
        ticks: {
          time: {
            unit: "millisecond",
            parser: format
          }
          //   sampleSize: 10
        },
        scaleLabel: {
          display: true,
          labelString: "Distance (m)"
        }
      }
    ]
  },
  plugins: {
    zoom: {
      //   pan: {
      //     enabled: true,
      //     mode: "xy"
      //   },
      zoom: {
        enabled: true,
        drag: true,
        mode: "xy",
        speed: 0.1
      }
    }
  }
};

const sharedProps = {
  fill: false,
  lineTension: 0.2,
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: "miter",
  pointBackgroundColor: "#fff",
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBorderWidth: 2,
  pointRadius: 4,
  pointHitRadius: 10,
  showLine: true,
  cubicInterpolationMode: "monotone",
  spanGaps: true
};

const randomColor = [
  "rgba(75,192,192,0.4)",
  "rgba(255, 224, 0, .5)",
  "green",
  "blue",
  "pink",
  "orange",
  "rgba(192, 0, 255, 0.5)"
];

const generateDataSet = (items, sensorList, isCanvas) => {
  return sensorList.map((item, i) => {
    const dataPoints = items
      .filter(sensor => sensor.sensorName === item.name)
      .map(res => ({
        // x: toDate(res.time), // for time
        x: res.distance,
        y: Number(res.value)
      }));

    if (isCanvas) {
      return {
        type: "spline",
        name: item.name,
        toolTipContent: `${item.name} {x}: {y} ${item.legend}`,
        showInLegend: true,
        markerType: "circle",
        markerSize: 8,
        lineThickness: 2.5,
        dataPoints
      };
    }

    return {
      ...sharedProps,
      label: item.name,
      backgroundColor: randomColor[i],
      borderColor: randomColor[i],
      pointHoverBackgroundColor: randomColor[i],
      pointHoverBorderColor: randomColor[i],
      pointBorderColor: randomColor[i],
      data: dataPoints
    };
  });
};

const generateChartData = (items, sensorList) => ({
  //   labels: items.map(item => toDate(item.time)), // for time
  labels: items.map(item => item.distance), // for distance
  datasets: generateDataSet(items, sensorList)
});

const canvasOptions = {
  zoomEnabled: true,
  animationEnabled: true,
  exportEnabled: true,
  theme: "light2", // "light1", "dark1", "dark2"
  toolTip: {
    shared: "true"
  },
  axisY: {
    includeZero: true
  },
  axisX: {
    title: "Distance (km)"
  }
};

const generateCanvasData = (item, sensorList) => ({
  ...canvasOptions,
  data: generateDataSet(item, sensorList, true)
});

const App = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <Query query={query}>{children}</Query>
    </ApolloProvider>
  );
};
storiesOf("charts", "controlled")
  .add("chartJS", () => (
    <App>
      {({ data, error, loading }) => {
        if (loading) {
          return <div>Data is fetching</div>;
        }

        const {
          getTimelineEvents: { sensors, sensorList }
        } = data;

        return (
          <ChartJS
            data={generateChartData(sensors, sensorList)}
            options={options}
          />
        );
      }}
    </App>
  ))
  .add("canvasJS", () => (
    <div>
      <App>
        {({ data, error, loading }) => {
          if (loading) {
            return <div>Data is fetching</div>;
          }

          const {
            getTimelineEvents: { sensors, sensorList }
          } = data;

          return (
            <CanvasJS data={generateCanvasData(sensors, sensorList, true)} />
          );
        }}
      </App>
    </div>
  ));
