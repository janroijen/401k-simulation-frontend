import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import * as d3 from "d3";

interface LineGraphDefinition {
  title: string;
  xaxis: { label: string; data: number[] };
  yaxes: { label: string; data: number[]; color: string }[];
  dimensions: { width: number; height: number };
  margin: { top: number; right: number; bottom: number; left: number };
  unit: string;
}

const StyledDiv = styled.div`
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 100%;

  h1 {
    font-size: 24px;
    text-align: center;
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
    .domain([min(xaxis.data), max(xaxis.data)])
    .range([0, width])
    .nice();

  const maxY = max(yaxes.flatMap((yaxis) => yaxis.data));

  const y = d3.scaleLinear().domain([maxY, 0]).range([0, height]).nice();

  const xAxis = d3.axisBottom(x);
  svg
    .append("g")
    .attr("transform", `translate(0, ${y(0)})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(y);
  svg.append("g").call(yAxis);

  const lineBuilder: any = d3
    .line()
    .x((d: any) => x(d.x))
    .y((d: any) => y(d.y))
    .curve(d3.curveMonotoneX);

  const lines = svg.append("g").attr("fill", "none").attr("stroke-width", 3);

  yaxes.forEach((yseries) => {
    lines
      .append("path")
      .data([zipSeries(xaxis.data, yseries.data)])
      .attr("stroke", yseries.color)
      .attr("d", lineBuilder);
  });

  svg
    .append("g")
    .attr("font-size", 12)
    .attr("transform", `translate(${0}, ${-0.5 * margin.top})`)
    .call(createLegend, yaxes);

  svg
    .append("g")
    .append("text")
    .attr("font-size", 10)
    .attr("x", width)
    .attr("y", height - 6)
    .attr("text-anchor", "end")
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

const zipSeries = (x: number[], y: number[]): { x: number; y: number }[] => {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    // ignore NaNs and infinity
    if (!Number.isNaN(y[i]) && Number.isFinite(y[i])) {
      result.push({ x: x[i], y: y[i] });
    }
  }

  return result;
};

const max = (x: number[]) =>
  Math.max(...x.filter((x) => !Number.isNaN(x) && Number.isFinite(x)));

const min = (x: number[]) =>
  Math.min(...x.filter((x) => !Number.isNaN(x) && Number.isFinite(x)));

const createLegend = (
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
  linesInfo: { label: string; color: string; index: number }[],
  width = 170
): void => {
  selection.attr("stroke-width", 3);
  linesInfo.forEach((lineInfo, i) =>
    selection.call(createLegendItem, lineInfo, i, width)
  );
};

const createLegendItem = (
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
  { label, color }: { label: string; color: string },
  index: number,
  width: number
): void => {
  const offset = width * index;

  selection
    .append("line")
    .attr("x1", offset + 5)
    .attr("x2", offset + 25)
    .attr("y1", -4)
    .attr("y2", -4)
    .attr("stroke", color);

  selection
    .append("text")
    .attr("x", offset + 30)
    .attr("y", 0)
    .text(label);
};
