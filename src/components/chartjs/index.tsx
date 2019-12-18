import React from "react";

import { Line } from "react-chartjs-2";

const ChartJS = ({ data = [], options = {} }) => {
  return (
    <div style={{ height: 200 }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartJS;
