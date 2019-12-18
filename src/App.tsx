import React from "react";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { CanvasJS, ChartJS } from "./components";

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

const App = () => (
  <ApolloProvider client={client}>
    <ChartJS />
  </ApolloProvider>
);

export default App;
