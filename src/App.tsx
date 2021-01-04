import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Basic from "./components/assumptions-form";
import Table from "./components/balances-table";
import Test from "./components/react-vis-test";

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
        <Basic />
        <Test />
        <Table />
      </Provider>
    </Container>
  );
}

export default App;
