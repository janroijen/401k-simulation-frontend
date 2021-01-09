import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import * as d3 from "d3";

interface AxisData {
  label: string;
  data: number[];
  color?: string;
}

interface LineGraphDefinition {
  title: string;
  xaxis: AxisData;
  yaxes: AxisData[];
  dimensions: { width: number; height: number };
  margin: { top: number; right: number; bottom: number; left: number };
  unit: string;
}

const StyledDiv = styled.div`
  box-sizing: border-box;
  display: block;
  width: calc(100vw - 230px);
  max-width: 1500px;
  height: calc(100vh - 150px);
  max-height: 800px;

  h1 {
    font-size: 24px;
    text-align: center;
  }

  .bar-hover:hover {
    opacity: 70%;
  }
`;

const LineGraph = ({ graphDef }: { graphDef: LineGraphDefinition }) => {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphDef || !graphRef.current || !graphRef.current.parentElement) {
      return;
    }

    const gDef = { ...graphDef };
    gDef.dimensions = {
      width: Math.max(graphDef.dimensions.width, graphRef.current.offsetWidth),
      height: Math.max(
        graphDef.dimensions.height,
        graphRef.current.parentElement.offsetHeight
      ),
    };

    drawGraph(graphRef, gDef);
  }, [graphDef]);

  if (!graphDef) {
    return <div>Loading</div>;
  }

  return (
    <StyledDiv>
      <h1>{graphDef.title}</h1>
      <div ref={graphRef} />
    </StyledDiv>
  );
};

export default LineGraph;

const drawGraph = (
  ref: React.RefObject<HTMLDivElement>,
  { xaxis, yaxes, dimensions, margin, unit }: LineGraphDefinition
) => {
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  d3.select(ref.current).selectChildren().remove();

  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("height", dimensions.height)
    .attr("width", dimensions.width)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([min(xaxis.data) - 0.5, max(xaxis.data) + 0.5])
    .range([0, width])
    .nice();

  const y = d3
    .scaleLinear()
    .domain([calcMaxY(yaxes), 0])
    .range([0, height])
    .nice();

  const xAxis = d3.axisBottom(x);
  svg
    .append("g")
    .attr("transform", `translate(0, ${y(0)})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(y);
  svg.append("g").call(yAxis);

  // Draw stacked boxes on top of each other for each categorical value.
  const barWidth = x(1) - x(0);
  for (let bar = 0; bar < xaxis.data.length; bar++) {
    const barStack = svg.append("g").attr("class", "bar-hover");
    let ySum = 0;
    for (let series = 0; series < yaxes.length; series++) {
      const yCur = yaxes[series].data[bar];
      const color = yaxes[series].color ?? "gray";
      barStack
        .append("rect")
        .attr("x", x(xaxis.data[bar] - 0.5))
        .attr("y", y(ySum + yCur))
        .attr("height", y(0) - y(yCur))
        .attr("width", barWidth)
        .attr("fill", color)
        .attr("stroke-width", 1)
        .attr("stroke", "gray");
      ySum += yCur;
    }
  }

  svg
    .append("g")
    .attr("font-size", 12)
    .attr("transform", `translate(${0}, ${-0.5 * margin.top})`)
    .call(createLegend, yaxes, 10);

  svg
    .append("g")
    .append("text")
    .attr("font-size", 10)
    .attr("x", width)
    .attr("y", height - 6)
    .attr("text-anchor", "start")
    .text(xaxis.label);

  svg
    .append("g")
    .append("text")
    .attr("font-size", 10)
    .attr("x", -8)
    .attr("y", -8)
    .attr("text-anchor", "end")
    .text(unit);
};

// Find the maximum y-value by first calculating the total height for each
// categorical value.
const calcMaxY = (yseries: AxisData[]) => {
  let yMax = -Infinity;
  for (let i = 0; i < yseries[0].data.length; i++) {
    const curMax = yseries
      .map((x) => x.data[i])
      .reduce((a: number, b: number) => a + b);
    if (curMax > yMax) {
      yMax = curMax;
    }
  }

  return yMax;
};

const max = (x: number[]) =>
  Math.max(...x.filter((x) => !Number.isNaN(x) && Number.isFinite(x)));

const min = (x: number[]) =>
  Math.min(...x.filter((x) => !Number.isNaN(x) && Number.isFinite(x)));

const createLegend = (
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
  linesInfo: AxisData[],
  strokeWidth: number = 1,
  width = 170
): void => {
  selection.attr("stroke-width", 3);
  linesInfo.forEach((lineInfo, i) =>
    selection.call(createLegendItem, lineInfo, i, width)
  );
};

const createLegendItem = (
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
  { label, color }: AxisData,
  index: number,
  width: number,
  strokeWidth: number = 1
): void => {
  const offset = width * index;

  selection
    .append("line")
    .attr("x1", offset + 5)
    .attr("x2", offset + 25)
    .attr("y1", -4)
    .attr("y2", -4)
    .attr("stroke-width", strokeWidth)
    .attr("stroke", color ?? "gray");

  selection
    .append("text")
    .attr("x", offset + 30)
    .attr("y", 0)
    .text(label);
};
