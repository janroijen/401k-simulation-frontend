import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";

const StyledTable = styled.div`
  max-height: calc(100vh - 82px);
  width: calc(100vw - 230px);
  max-width: 1500px;
  overflow: auto;

  box-sizing: border-box;
  font-size: 12px;
  text-align: right;
  margin: 10px 0px;

  div {
    position: sticky;
    top: 100px;
  }

  table {
    border-collapse: collapse;
  }

  thead th {
    position: sticky;
    top: 0;

    background-color: ${colors.tints[11]};
    color: ${colors.tints[0]};
    vertical-align: text-top;
  }
  tbody {
    border: thin solid ${colors.tints[10]};
    font-family: "Roboto";
    font-size: 14px;
  }
  th {
    font-weight: normal;
    padding: 5px 10px;
    min-width: 55px;
  }
  td {
    padding: 3px 10px;
  }
  tr:nth-child(5n) {
    border-bottom: thin solid ${colors.tints[13]};
  }
  tr:last-child {
    border-bottom: thin solid ${colors.tints[11]};
  }

  // td:nth-child(2),
  // td:nth-child(6),
  // td:nth-child(10) {
  //   border-right: thin solid ${colors.tints[13]};
  // }

  // td:nth-child(3),
  // td:nth-child(10) {
  //   color: ${colors.tints[1]};
  // }

  td.rightBorder {
    border-right: thin solid ${colors.tints[13]};
  }

  td.highlight {
    color: ${colors.tints[1]};
  }

  tbody tr:hover {
    background-color: ${colors.tints[13]};
  }
  tbody tr td:hover {
    background-color: ${colors.tints[12]};
  }

  // Tooltip text
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 200px;
    height: 145px;
    background-color: ${colors.tints[6]};
    color: #fff;
    text-align: left;
    padding: 10px 15px;
    border-radius: 5px;

    //*  Position the tooltip text
    position: absolute;
    top: 105%;
    left: 50%;
    margin-left: -194px;
    z-index: 1;
  }

  // Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }

  // Scrollbar
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${colors.tints[13]};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${colors.tints[9]};
    border-radius: 2px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.tints[7]};
  }
`;

interface TabularData {
  [x: string]: {
    data: (number | string)[];
    tooltip?: string;
    highlight?: boolean;
    rightBorder?: boolean;
  };
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
      <td
        className={`${data[key].highlight ? "highlight" : ""}
          ${data[key].rightBorder ? "rightBorder" : ""}`}
        key={idx}
      >
        {data[key].data[index]}
      </td>
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

const Table = ({ data }: { data: any }) => {
  if (!data) return <div>Loading</div>;

  return (
    <StyledTable>
      <table className="table">
        <TableHeader data={data} />
        <DataRows data={data} />
      </table>
    </StyledTable>
  );
};

export default Table;
