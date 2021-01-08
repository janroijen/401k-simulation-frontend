import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import colors from "../styles/colors";
import Table from "./table";
import LineGraph from "./line-graph";

interface ReportChoices {
  report: "income" | "wealth";
  format: "table" | "line-graph";
}

const Report401k = () => {
  const loadingStatus = useSelector((state: any) => state.loading);
  const data = useSelector((state: any) => state.balances);
  const [dataInternal, setDataInternal] = useState(data);
  const [selection, setSelection] = useState<ReportChoices>({
    report: "income",
    format: "line-graph",
  });

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
    <div>
      <SelectionButtons
        initialSelection={selection}
        onSelection={handleSelection}
      />
      <Switch data={dataInternal} choice={selection} />
    </div>
  );
};

export default Report401k;

const StyledSelection = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-contents: flex-start;

  font-size: 12px;
  background-color: ${colors.tints[11]};
  border-radius: 3px;
  margin: 10px;
  margin-left: 0;
  padding: 15px;
  padding-top: 12px;
  height: 42px;
  color: ${colors.tints[0]};

  div {
    margin-right: 40px;
  }

  label,
  input {
    vertical-align: middle;
  }

  input[type="radio"] {
    margin-top: -1px;
    border-color: ${colors.tints[3]};
    outline-color: ${colors.tints[3]};
  }
  input[type="radio"]:focus {
    border-color: ${colors.tints[3]};
    border-width: 6px;
  }
`;

interface ISelectionButtonProps {
  initialSelection: ReportChoices;
  onSelection: (selection: ReportChoices) => void;
}

const SelectionButtons = ({
  initialSelection,
  onSelection,
}: ISelectionButtonProps) => {
  const [selection, setSelection] = useState<ReportChoices>(initialSelection);

  const handleSelection = (choice: Partial<ReportChoices>) => {
    setSelection({ ...selection, ...choice });
    onSelection({ ...selection, ...choice });
  };

  return (
    <StyledSelection className="radio">
      <div>
        <input
          type="radio"
          name="output"
          value="income"
          defaultChecked={selection.report === "income"}
          onChange={() => handleSelection({ report: "income" })}
        />
        <label htmlFor="output">Income</label>
        <input
          type="radio"
          name="output"
          value="wealth"
          defaultChecked={selection.report === "wealth"}
          onChange={() => handleSelection({ report: "wealth" })}
        />
        <label htmlFor="output">Wealth</label>
      </div>
      <div>
        <input
          type="radio"
          name="format"
          value="line-graph"
          defaultChecked={selection.format === "line-graph"}
          onChange={() => handleSelection({ format: "line-graph" })}
        />
        <label htmlFor="format">Line Graph</label>
        <input
          type="radio"
          name="format"
          value="table"
          defaultChecked={selection.format === "table"}
          onChange={() => handleSelection({ format: "table" })}
        />
        <label htmlFor="format">Table</label>
      </div>
    </StyledSelection>
  );
};

const Switch = ({ data, choice }: { data: any; choice: ReportChoices }) => {
  let elem: JSX.Element;
  switch (choice.report + "-" + choice.format) {
    default:
    case "income-table":
      const incomeTable = {
        Age: { data: data.age },
        Year: { data: data.year, rightBorder: true },

        "Actual income": {
          data: numberFormat(data.withdrawal.actual),
          tooltip: `The higher of the target distribution and the minimum required distribution.`,
          highlight: true,
        },
        "Target income": {
          data: numberFormat(data.withdrawal.target),
          tooltip: `The intended amount to be taken out of the account. This is defined as a percentage
             of the balance at the first year of distributions and inflation adjusted in later year.`,
        },
        "Minimum required distribution": {
          data: numberFormat(data.withdrawal.mrd),
          tooltip: `The US tax authorities (IRS) require minimal withdrawals starting at age 70.
             The amount is a percentage of the account's balance. This percentage reflects
             expected remaining lifetime and increases with age.`,
        },
        "Above target income": {
          data: numberFormat(data.withdrawal.excess),
          tooltip: `The positive difference between the target withdrawal and the minimum
             required distribution. The assumption is that this amount is being save in a
             taxable account, which is reflected in the last columns in the table.`,
        },
      };
      elem = <Table data={incomeTable} />;
      break;
    case "wealth-table":
      const wealthTable = {
        Age: { data: data.age },
        Year: { data: data.year, rightBorder: true },

        "Deferred opening Balance": {
          data: numberFormat(data.taxDeferredAccount.openingBalance),
          tooltip: `The account's balance at the beginning of the year.`,
        },
        "Deferred proceeds": {
          data: numberFormat(data.taxDeferredAccount.investmentProceeds),
          tooltip: `The investment income that the account is assumed to generate during the year.`,
        },
        "Deferred withdrawal": {
          data: numberFormat(data.taxDeferredAccount.withdrawal),
          tooltip: "Money taken out of the account during the year.",
        },
        "Deferred closing balance": {
          data: numberFormat(data.taxDeferredAccount.closingBalance),
          tooltip: `The balance at the end of the year. The closing balance for a year 
               will equal the opening balance for the
               following year for nominal returns. For real return the opening balance will be
               lower due to another year of inflation adjustment.`,
          rightBorder: true,
          highlight: true,
        },

        "Taxable opening Balance": {
          data: numberFormat(data.taxableAccount.openingBalance),
          tooltip: `The account's balance at the beginning of the year.`,
        },
        "Taxable proceeds": {
          data: numberFormat(data.taxableAccount.investmentProceeds),
          tooltip: `The investment income that the account is assumed to generate during the year.`,
        },
        "Taxable withdrawal": {
          data: numberFormat(data.taxableAccount.withdrawal),
          tooltip: "Money taken out of the account during the year.",
        },
        "Taxable closing balance": {
          data: numberFormat(data.taxableAccount.closingBalance),
          tooltip: `The balance at the end of the year. The closing balance for a year 
               will equal the opening balance for the
               following year for nominal returns. For real return the opening balance will be
               lower due to another year of inflation adjustment.`,
          highlight: true,
        },
      };
      elem = <Table data={wealthTable} />;
      break;
    case "wealth-line-graph":
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
    case "income-line-graph":
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

const numberFormat = (x: number[]) =>
  x.map((y) =>
    typeof y === "number" ? (100 * Math.round(y / 100)).toLocaleString() : ""
  );
