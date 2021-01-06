import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";

const StyledTable = styled.table`
  border-sizing: border-box;
  font-size: 16px;
  font-family: "Roboto";
  text-align: right;
  padding: 0px 10px;
  margin: 10px;
  margin-top: 0px;
  margin-left: 0px;
  max-width: 1500px;
  border-collapse: collapse;
  border: thin solid ${colors.tints[11]};

  thead {
    background-color: ${colors.tints[12]};
    vertical-align: text-top;
  }
  th {
    font-weight: normal;
    padding: 5px 10px;
    min-width: 55px;
  }
  td {
    padding: 3px 10px;
  }
  tbody tr:nth-child(5n) {
    border-bottom: thin solid ${colors.tints[13]};
  }
  tbody tr:last-child {
    border-bottom: thin solid ${colors.tints[11]};
  }

  td:nth-child(2),
  td:nth-child(6),
  td:nth-child(10) {
    border-right: thin solid ${colors.tints[13]};
  }

  td:nth-child(3),
  td:nth-child(10) {
    color: ${colors.tints[1]};
  }

  tbody tr:hover {
    background-color: ${colors.tints[13]};
  }
  tbody tr td:hover {
    background-color: ${colors.tints[12]};
  }

  .tooltip {
    position: relative;
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 200px;
    height: 145px;
    background-color: #333;
    color: #fff;
    text-align: left;
    padding: 10px 15px;
    border-radius: 5px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    top: 105%;
    left: 50%;
    margin-left: -194px;
    z-index: 1;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
`;

interface TabularData {
  [x: string]: { data: (number | string)[]; tooltip?: string };
}

const TableHeader = ({ data }: { data: TabularData }) => (
  <thead>
    <tr>
      {Object.keys(data).map((key, idx) => (
        <th key={idx} className={data[key].tooltip ? "tooltip" : ""}>
          {key}
          {data[key].tooltip && (
            <span className="tooltiptext">{data[key].tooltip}</span>
          )}
        </th>
      ))}
    </tr>
  </thead>
);

const DataRow = ({ data, index }: { data: TabularData; index: number }) => (
  <tr>
    {Object.keys(data).map((key, idx) => (
      <td key={idx}>{data[key].data[index]}</td>
    ))}
  </tr>
);

const DataRows = ({ data }: { data: TabularData }) => {
  const firstColumn = data[Object.keys(data)[0]];

  return (
    <tbody>
      {firstColumn.data.map((_, index) => (
        <DataRow key={index} data={data} index={index} />
      ))}
    </tbody>
  );
};

const numberFormat = (x: number[]) => x.map((y) => y.toLocaleString());

const Table = ({ data }: { data: any }) => {
  if (!data) return <div>Loading</div>;

  const tableData = {
    Age: { data: data.age },
    Year: { data: data.year },

    "Actual withdrawal": {
      data: numberFormat(data.withdrawal.actual),
      tooltip: `The higher of the target distribution and the minimum required distribution.`,
    },
    "Target withdrawal": {
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
    "Excess withdrawal": {
      data: numberFormat(data.withdrawal.excess),
      tooltip: `The positive difference between the target withdrawal and the minimum
         required distribution. The assumption is that this amount is being save in a
         taxable account, which is reflected in the last columns in the table.`,
    },

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
    },
  };

  return (
    <StyledTable>
      <TableHeader data={tableData} />
      <DataRows data={tableData} />
    </StyledTable>
  );
};

export default Table;
