import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
import { useForm } from "react-hook-form";
import styled from "styled-components";

interface IAssumptions {
  startBalance: string;
  currentAge: number;
  startAge: number;
  finalAge: number;
  withdrawalRate: number;
  expectedRealReturn: number;
  expectedInflationRate: number;
  output: "nominal" | "real";
}

const initialValues: IAssumptions = {
  startBalance: "1,000,000",
  currentAge: 50,
  startAge: 60,
  finalAge: 90,
  withdrawalRate: 3,
  expectedRealReturn: 2,
  expectedInflationRate: 2,
  output: "nominal",
};

const Form = styled.form`
  box-sizing: border-box;
  font-size: 12px;
  width: 180px;
  background-color: #eee;
  border-radius: 6px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  padding: 18px;

  label {
    color: #222;
    text-align: left;
    margin-bottom: 3px;
    margin-left: 3px;
  }
  p {
    color: red;
    text-align: left;
    font-size: 10px;
    margin-top: 2px;
    margin-bottom: 5px;
    height: 10px;
  }
  div.radio {
    display: flex;
  }
  div label {
    margin-top: 2px;
  }
  input[type="text"] {
    padding: 6px 10px;
    border-radius: 3px;
    border-color: gray;
    border-width: 1px;
  }
  input[type="submit"] {
    background-color: #111;
    color: white;
    padding: 12px 20px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
  }
  input[type="submit"]:hover {
    opacity: 70%;
  }
`;

const AssumptionsForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    getValues,
    setValue,
  } = useForm<IAssumptions>();

  const onSubmit = (data: Record<string, string>) => {
    // Strip out commas and convert to numbers.
    const result: any = {};
    Object.entries(data).forEach(
      ([key, value]) => (result[key] = Number(value.replace(/,/g, "")))
    );
    result.withdrawalRate /= 100;
    result.expectedRealReturn /= 100;
    result.expectedInflationRate /= 100;
    result.output = data.output;

    alert(JSON.stringify(result, null, "  "));
  };

  const localizeNumber = (value: string): string => {
    const number = Number(
      getValues("startBalance").toString().replace(/,/g, "")
    );

    return isNaN(number) ? value : number.toLocaleString();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <label htmlFor="startBalance">Current balance ($)</label>
      <input
        name="startBalance"
        ref={register({
          required: true,
          min: 0,
          pattern: /^[0-9,/.]*$/,
        })}
        defaultValue={initialValues.startBalance}
        type="text"
        onBlur={() =>
          setValue(
            "startBalance",
            localizeNumber(getValues("startBalance").toString())
          )
        }
      />
      <p>{errors.startBalance && "Positive balance"}</p>

      <label htmlFor="currentAge">Current age (years)</label>
      <input
        name="currentAge"
        ref={register({
          required: true,
          min: 25,
          max: 120,
          pattern: /^[0-9/.]*$/,
        })}
        defaultValue={initialValues.currentAge}
        type="text"
      />
      <p>{errors.currentAge && "Between 25 and 120"}</p>

      <label htmlFor="startAge">Start age (years)</label>
      <input
        name="startAge"
        ref={register({
          required: true,
          min: 25,
          max: 120,
          pattern: /^[0-9/.]*$/,
        })}
        defaultValue={initialValues.startAge}
        type="text"
      />
      <p>{errors.startAge && "Between 25 and 120"}</p>

      <label htmlFor="finalAge">Final age (years)</label>
      <input
        name="finalAge"
        ref={register({
          required: true,
          min: 25,
          max: 120,
          pattern: /^[0-9/.]*$/,
        })}
        defaultValue={initialValues.finalAge}
        type="text"
      />
      <p>{errors.finalAge && "Between 25 and 120"}</p>

      <label htmlFor="withdrawalRate">Withdrawal rate (%)</label>
      <input
        name="withdrawalRate"
        ref={register({
          required: true,
          min: 0,
          max: 100,
          pattern: /^[0-9/.]*$/,
        })}
        defaultValue={initialValues.withdrawalRate}
        type="text"
      />
      <p>{errors.withdrawalRate && "Between 0 and 100"}</p>

      <label htmlFor="expectedRealReturn">Real return (%)</label>
      <input
        name="expectedRealReturn"
        ref={register({
          required: true,
          pattern: /^[0-9/.]*$/,
        })}
        defaultValue={initialValues.expectedRealReturn}
        type="text"
      />
      <p>{errors.expectedRealReturn && "Between 0 and 100"}</p>

      <label htmlFor="expectedInflationRate">Inflation (%)</label>
      <input
        name="expectedInflationRate"
        ref={register({
          required: true,
          pattern: /^[0-9/.]*$/,
        })}
        defaultValue={initialValues.expectedInflationRate}
        type="text"
      />
      <p>{errors.expectedInflationRate && "Between 0 and 100"}</p>

      <div className="radio">
        <input
          type="radio"
          name="output"
          value="real"
          defaultChecked={initialValues.output === "real"}
          ref={register()}
        />
        <label htmlFor="output">Real</label>
        <input
          type="radio"
          name="output"
          value="nominal"
          defaultChecked={initialValues.output === "nominal"}
          ref={register()}
        />
        <label htmlFor="output">Nominal</label>
      </div>
      <input type="submit" value="Calculate" />
    </Form>
  );
};

export default AssumptionsForm;