import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";

const StyledTable = styled.table`
  border-sizing: border-box;
  font-size: 12px;
  // font-family: "Roboto";
  text-align: right;
  padding: 0px 10px;
  margin: 10px;
  margin-top: 0px;
  margin-left: 0px;
  max-width: 1500px;
  border-collapse: collapse;

  thead {
    background-color: ${colors.tints[11]};
    color: ${colors.tints[0]};
    vertical-align: text-top;
    border: thin solid ${colors.tints[10]};
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
    position: sticky;
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
    background-color: ${colors.tints[6]};
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

const Table = ({ data }: { data: any }) => {
  if (!data) return <div>Loading</div>;

  return (
    <StyledTable>
      <TableHeader data={data} />
      <DataRows data={data} />
    </StyledTable>
  );
};

export default Table;
