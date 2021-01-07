import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import colors from "../styles/colors";
import Table from "./balances-table";
import LineGraph from "./line-graph";

type ReportChoices = "table" | "balance-graph" | "income-graph";

const StyledReport401k = styled.div`
  width: calc(100vw - 230px);
  max-width: 1500px;

  .selected-report {
    width: calc(100vw - 230px);
    max-width: 1500px;
    height: calc(100vh - 150px);
    max-height: 800px;
  }
`;

const Report401k = () => {
  const loadingStatus = useSelector((state: any) => state.loading);
  const data = useSelector((state: any) => state.balances);
  const [dataInternal, setDataInternal] = useState(data);
  const [selection, setSelection] = useState<ReportChoices>("income-graph");

  // Only update the depicted data when it is available to avoid flickering the
  // screen during the reload.

  useEffect(() => {
    if (loadingStatus !== "pending") {
      setDataInternal(data);
    }
  }, [data, loadingStatus]);

  const handleSelection = (selection: ReportChoices) => setSelection(selection);

  if (!dataInternal) {
    return <div>Loading</div>;
  }

  return (
    <StyledReport401k>
      <SelectionButtons selection={selection} onSelection={handleSelection} />
      {/* {loadingStatus !== "pending" && data && ( */}
      <Switch data={dataInternal} choice={selection} />
      {/* )} */}
    </StyledReport401k>
  );
};

export default Report401k;

const StyledSelection = styled.div`
  box-sizing: border-box;
  font-size: 12px;
  background-color: ${colors.tints[11]};
  border-radius: 3px;
  margin: 10px;
  margin-left: 0;
  padding: 15px;
  padding-top: 12px;
  display: block;
  height: 42px;
  color: ${colors.tints[0]};

  // label {
  //   margin-top: 2px;
  // }

  input[type="radio"] {
    border-color: ${colors.tints[3]};
    outline-color: ${colors.tints[3]};
  }
  input[type="radio"]:focus {
    border-color: ${colors.tints[3]};
    border-width: 6px;
  }
`;

interface ISelectionButtonProps {
  selection: string;
  onSelection: (selection: ReportChoices) => void;
}

const SelectionButtons = ({
  selection,
  onSelection,
}: ISelectionButtonProps) => {
  return (
    <StyledSelection className="radio">
      <input
        type="radio"
        name="output"
        value="income-graph"
        defaultChecked={selection === "income-graph"}
        onChange={() => onSelection("income-graph")}
      />
      <label htmlFor="output">Income</label>
      <input
        type="radio"
        name="output"
        value="balance-graph"
        defaultChecked={selection === "balance-graph"}
        onChange={() => onSelection("balance-graph")}
      />
      <label htmlFor="output">Wealth</label>
      <input
        type="radio"
        name="output"
        value="table"
        defaultChecked={selection === "table"}
        onChange={() => onSelection("table")}
      />
      <label htmlFor="output">Data</label>
    </StyledSelection>
  );
};

const Switch = ({ data, choice }: { data: any; choice: ReportChoices }) => {
  let elem: JSX.Element;
  switch (choice) {
    case "table":
      elem = <Table data={data} />;
      break;
    case "balance-graph":
      const balanceGraphDef = {
        title: "Account balances ($)",
        xaxis: { label: "Age", data: data.age },
        yaxes: [
          {
            label: "Tax deferred account",
            data: data.taxDeferredAccount.closingBalance,
            color: colors.triadic[0],
          },
          {
            label: "Taxable account",
            data: data.taxableAccount.closingBalance,
            color: colors.triadic[1],
          },
          {
            label: "Total accounts",
            data: add(
              data.taxDeferredAccount.closingBalance,
              data.taxableAccount.closingBalance
            ),
            color: colors.triadic[2],
          },
        ],
        unit: "$",
        dimensions: { width: 520, height: 450 },
        margin: {
          top: 48,
          right: 32,
          bottom: 32,
          left: 64,
        },
      };
      elem = <LineGraph graphDef={balanceGraphDef} />;
      break;
    case "income-graph":
      const age = data.age as number[];
      const targetIncome = data.withdrawal.target as number[];
      const actualIncome = data.withdrawal.actual as number[];
      const incomeGraphDef = {
        title: "Income ($)",
        xaxis: {
          label: "Age",
          data: age,
        },
        yaxes: [
          {
            label: "Target income",
            data: targetIncome.map((income, idx) =>
              age[idx] < data.assumptions.startAge ? NaN : income
            ),
            color: colors.triadic[1],
          },
          {
            label: "Actual income",
            data: actualIncome.map((income, idx) =>
              age[idx] < data.assumptions.startAge ? NaN : income
            ),
            color: colors.triadic[0],
          },
        ],
        unit: "$",
        dimensions: { width: 520, height: 450 },
        margin: {
          top: 48,
          right: 32,
          bottom: 32,
          left: 64,
        },
      };
      elem = <LineGraph graphDef={incomeGraphDef} />;
      break;
  }

  return <div className="selected-report">{elem}</div>;
};

const add = (x: number[], y: number[]): number[] => {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + y[i]);
  }

  return result;
};
