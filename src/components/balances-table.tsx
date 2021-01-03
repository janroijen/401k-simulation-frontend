import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  margin: 10px;
  font-family: "Roboto";

  div {
    font-size: 16px;
    text-align: right;
    padding: 0px 10px;
  }
  .header {
    background-color: #eee;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .header-last {
    padding-right: 50px;
  }
  div.fourth-row {
    padding-top: 5px;
  }
  div.fifth-row {
    padding-bottom: 7px;
    border-bottom: thin solid #ddd;
  }
  div.first-column {
    border-left: thin solid #ddd;
  }
  div.column-line {
    padding-right: 10px;
    border-right: thin solid #ddd;
  }
  div.emphasize {
    // font-weight: bold;
    color: #00a;
  }
`;

interface TabularData {
  [x: string]: (number | string)[];
}

const TableHeader = ({ data }: { data: TabularData }) => (
  <>
    {Object.keys(data).map((key, idx) => (
      <div className="header" key={idx}>
        {key}
      </div>
    ))}
  </>
);

const DataRow = ({
  data,
  index,
  addClass = "",
}: {
  data: TabularData;
  index: number;
  addClass?: string;
}) => (
  <>
    {Object.keys(data).map((key, idx) => (
      <div
        className={`
          ${addClass} 
          ${
            idx === 1 || idx === 5 || idx === 9 || idx === 13
              ? "column-line"
              : ""
          }
          ${idx === 0 ? "first-column" : ""}
          ${idx === 2 || idx === 9 ? "emphasize" : ""}
        }`}
        key={idx}
      >
        {data[key][index]}
      </div>
    ))}
  </>
);

const DataRows = ({ data }: { data: TabularData }) => {
  const firstColumn = data[Object.keys(data)[0]];

  return (
    <>
      {firstColumn.map((_, index) => (
        <DataRow
          addClass={
            index % 5 === 0 ? "fourth-row" : index % 5 === 4 ? "fifth-row" : ""
          }
          key={index}
          data={data}
          index={index}
        />
      ))}
    </>
  );
};

const numberFormat = (x: number[]) => x.map((y) => y.toLocaleString());

const Table = () => {
  const loadingStatus = useSelector((state: any) => state.loading);
  const data = useSelector((state: any) => state.balances);

  if (loadingStatus === "pending" || !data) {
    return <div>Loading</div>;
  }

  const tableData = {
    Age: data.age,
    Year: data.year,

    "Actual withdrawal": numberFormat(data.withdrawal.actual),
    "Target withdrawal": numberFormat(data.withdrawal.target),
    "Minimum required distribution": numberFormat(data.withdrawal.mrd),
    "Excess withdrawal": numberFormat(data.withdrawal.excess),

    "Deferred Opening Balance": numberFormat(
      data.taxDeferredAccount.openingBalance
    ),
    "Deferred proceeds": numberFormat(
      data.taxDeferredAccount.investmentProceeds
    ),
    "Deferred withdrawal": numberFormat(data.taxDeferredAccount.withdrawal),
    "Deferred closing balance": numberFormat(
      data.taxDeferredAccount.closingBalance
    ),

    "Taxable Opening Balance": numberFormat(data.taxableAccount.openingBalance),
    "Taxable proceeds": numberFormat(data.taxableAccount.investmentProceeds),
    "Taxable withdrawal": numberFormat(data.taxDeferredAccount.withdrawal),
    "Taxable closing balance": numberFormat(data.taxableAccount.closingBalance),
  };

  return (
    <>
      <Grid>
        <TableHeader data={tableData} />
        <DataRows data={tableData} />
        {/* <DataRow data={tableData} index={0} /> */}
      </Grid>
    </>
  );
};

export default Table;
