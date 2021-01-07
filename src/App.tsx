import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import InputPanel from "./components/assumptions-form";
import ReportSelection from "./components/report-401k";

import styled from "styled-components";

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
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
