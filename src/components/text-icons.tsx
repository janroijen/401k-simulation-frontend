import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";

const StyledInfoIcon = styled.a`
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 15px;
  background-color: ${colors.tints[3]};
  font-weight: bold;
  color: white;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;

  &:hover {
    background-color: ${colors.tints[5]};
  }
`;

interface InfoIconProps {
  onClick(): void;
}

export const InfoIcon = ({ onClick }: InfoIconProps) => {
  return <StyledInfoIcon onClick={onClick}>?</StyledInfoIcon>;
};
