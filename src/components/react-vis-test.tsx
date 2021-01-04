import React from "react";
import { useSelector } from "react-redux";
import "../App.css";
import "../../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  LineSeries,
  XAxis,
  YAxis,
  DiscreteColorLegend,
  // Hint,
} from "react-vis";

const Test = () => {
  const loadingStatus = useSelector((state: any) => state.loading);
  const data = useSelector((state: any) => state.balances);
  // const [indexX, setIndexX] = useState<number | null>(null);

  if (loadingStatus === "pending" || !data) {
    return <div>Loading</div>;
  }

  // const handleMouseOver = (x: number | null) => setIndexX(x);

  const x = data.age;

  const deferredBalanceLine = selectData(
    x,
    data.taxDeferredAccount.closingBalance
  );

  const taxableBalanceLine = selectData(x, data.taxableAccount.closingBalance);

  const totalBalance = add(
    data.taxDeferredAccount.closingBalance,
    data.taxableAccount.closingBalance
  );

  const totalBalanceLine = selectData(x, totalBalance);

  const maxY = 1.05 * Math.max(...totalBalance);

  return (
    <div>
      <XYPlot
        yDomain={[0, maxY]}
        // onMouseLeave={() => handleMouseOver(null)}
        height={525}
        width={800}
        margin={{ left: 80, top: 80, bottom: 30 }}
      >
        <XAxis title="Age" />
        <YAxis
          tickFormat={(v) => `${Math.round(v / 1000).toLocaleString()}k`}
        />
        <LineSeries
          data={deferredBalanceLine}
          // onNearestX={(datapoint, { index }) => handleMouseOver(index)}
        />
        <LineSeries
          data={taxableBalanceLine}
          style={{ strokeDasharray: "5, 5" }}
        />
        <LineSeries data={totalBalanceLine} style={{ strokeWidth: 3 }} />
      </XYPlot>
      <DiscreteColorLegend
        orientation="horizontal"
        items={[
          { title: "Tax deferred" },
          { title: "Taxable", strokeDasharray: "5 5" },
          { title: "Total", strokeWidth: 3 },
        ]}
      />
    </div>
  );
};

export default Test;

const selectData = (x: number[], y: number[]): { x: number; y: number }[] => {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push({ x: x[i], y: y[i] });
  }

  return result;
};

const add = (x: number[], y: number[]): number[] => {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + y[i]);
  }

  return result;
};

// const maxOfLines = (...x: number[]): number => {
//   return Math.max(...x.flat());
// };

/* 
        {indexX === null ? null : (
          <LineSeries
            data={[
              { x: data.age[indexX], y: 0 },
              { x: data.age[indexX], y: maxY },
            ]}
            opacity={0.5}
            color="#ddd"
            style={{ strokeDasharray: "3 3" }}
          />
        )}
        {indexX !== null && (
          <Hint
            value={{
              x: x[indexX],
              y: data.taxDeferredAccount.closingBalance[indexX],
            }}
          >
            deferred
            {`$${Math.round(
              data.taxDeferredAccount.closingBalance[indexX] / 1000
            )}k`}
          </Hint>
        )} */
