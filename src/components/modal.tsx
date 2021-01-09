import React, { ReactNode } from "react";
import styled from "styled-components";

import colors from "../styles/colors";

interface IModalProps {
  visible: boolean;
  onClose(): void;
  left?: number;
  top?: number;
  children: ReactNode;
}

const StyledModal = styled.div<IModalProps>`
  /* The Modal (background) */
  box-sizing: border-box;
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: ${(props) => props.left ?? 0};
  top: ${(props) => props.top ?? 0};
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  font-size: 12px;
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgb(0,0,0,0.8); // ${colors.tints[8]};
  opacity: 40%.
  margin: 10px;

  /* Modal Content/Box */
  .modal-content {
    background-color: ${colors.tints[12]};
    margin: 8% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid ${colors.tints[10]};
    border-radius: 5px;
    width: 80%; /* Could be more or less, depending on screen size */
  }

  /* The Close Button */
  .close {
    color: ${colors.tints[6]};
    float: right;
    font-size: 20px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: ${colors.tints[0]};
    text-decoration: none;
    cursor: pointer;
  }
`;

const Modal = (props: IModalProps) => {
  return (
    <StyledModal {...props}>
      <div className="modal-content">
        <span className="close" onClick={props.onClose}>
          &times;
        </span>
        <div>{props.children}</div>
      </div>
    </StyledModal>
  );
};

export default Modal;
