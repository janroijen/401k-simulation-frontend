import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import InputPanel from "./components/assumptions-form";
import ReportSelection from "./components/report-401k";
// import Table from "./components/balances-table";
// import Test from "./components/line-graph";

import styled from "styled-components";

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  // min-height: 95vh;
`;

function App() {
  return (
    <Container className="App">
      <Provider store={store}>
        <InputPanel />
        <ReportSelection />
      </Provider>
    </Container>
  );
}

export default App;
