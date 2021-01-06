import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import colors from "../styles/colors";
import Table from "./balances-table";
import LineGraph from "./line-graph";

type ReportChoices = "table" | "balance-graph" | "income-graph";

const StyledReport401k = styled.div`
  display: flex;
  flex-direction: column;
  // width: calc(100vw-210px);
`;

const Report401k = () => {
  const loadingStatus = useSelector((state: any) => state.loading);
  const data = useSelector((state: any) => state.balances);
  const [selection, setSelection] = useState<ReportChoices>("income-graph");

  const handleSelection = (selection: ReportChoices) => setSelection(selection);

  return (
    <StyledReport401k>
      <SelectionButtons selection={selection} onSelection={handleSelection} />
      {loadingStatus !== "pending" && data && (
        <Switch data={data} choice={selection} />
      )}
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
  display: flex;
  height: 42px;
  color: ${colors.tints[0]};

  label {
    margin-top: 1px;
  }

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
  switch (choice) {
    case "table":
      return <Table data={data} />;
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
        dimensions: { width: 800, height: 450 },
        margin: {
          top: 48,
          right: 32,
          bottom: 32,
          left: 64,
        },
      };
      return <LineGraph graphDef={balanceGraphDef} />;
    case "income-graph":
      const incomeGraphDef = {
        title: "Income ($)",
        xaxis: { label: "Age", data: data.age },
        yaxes: [
          {
            label: "Target income",
            data: data.withdrawal.target,
            color: colors.triadic[1],
          },
          {
            label: "Actual income",
            data: data.withdrawal.actual,
            color: colors.triadic[0],
          },
        ],
        unit: "$",
        dimensions: { width: 800, height: 450 },
        margin: {
          top: 48,
          right: 32,
          bottom: 32,
          left: 64,
        },
      };
      return <LineGraph graphDef={incomeGraphDef} />;
  }
};

const add = (x: number[], y: number[]): number[] => {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + y[i]);
  }

  return result;
};
