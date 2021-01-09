import React, { useState } from "react";
import styled from "styled-components";
import { InfoIcon } from "./text-icons";
import Modal from "./modal";

const HelpInfo = () => {
  const [visible, setVisible] = useState(true);

  const onOpen = () => setVisible(true);
  const onClose = () => setVisible(false);
  return (
    <>
      <InfoIcon onClick={onOpen} />
      <Modal visible={visible} onClose={onClose}>
        <h1>Retirement Income Calculator</h1>
        <p>
          See your income and remaining 401k balances in retirement using your
          own assumptions.
        </p>
        <p>
          The calculation starts with your current account balance and keeps
          growing it for investment returns and future contributions up to
          retirement. In retirement, additional investment is generated and
          withdrawals start. The annual withdrawal is defined as a percentage of
          the account's balance at the start of retirement. In following years,
          this amount is adjusted for inflation.
        </p>
        <p>
          Consider two risks when picking a withdrawal percentage. A high
          withdrawal percentage will deplete the account faster, and you may run
          out of money. A low withdrawal rate will lower your annual cash
          available for consumption and also force you to withdraw more later in
          retirement to comply with the IRS's{" "}
          <em>minimum distribution requirements</em>.
        </p>
        <p>
          When the withdrawals are higher than the amount based on the
          withdrawal percentage, the excess amount is invested in a taxable
          account. The <em>wealth</em> graphs show the balance of both the 401k
          account (the tax deferred account) and the taxable reinvestment
          account.
        </p>
        <p>
          Results are reported in either <em>nominal</em> or <em>real</em>{" "}
          terms. The nominal numbers do not adjust for the impact of inflation
          whereas the real numbers do. Therefore, the real numbers are lower as
          they are expressed in the purchasing power of today's dollars rather
          than in future year.
        </p>
      </Modal>
    </>
  );
};

export default HelpInfo;
