import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { IAssumptions } from "../store/401k-balance";
import { fetchProjectedBalances } from "../store/401k-balance";
import colors from "../styles/colors";

const Form = styled.form`
  box-sizing: border-box;
  font-size: 12px;
  width: 180px;
  background-color: ${colors.tints[11]};
  border-radius: 3px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  padding: 18px;
  height: 565px;

  label {
    color: ${colors.tints[0]};
    text-align: left;
    margin-top: 10px;
    margin-bottom: 3px;
  }
  label.newsection {
    margin-top: 25px;
  }
  p.errors {
    color: #880000;
    text-align: left;
    font-size: 10px;
    margin-top: 2px;
    margin-bottom: 5px;
    height: 10px;
  }
  p.errors::before {
    display: inline;
    content: "⚠ ";
  }

  div.radio {
    display: flex;
    margin-top: 25px;
  }
  div label {
    margin-top: 2px;
  }

  input[type="text"] {
    outline: none;
    border-radius: 2px 2px 0px 0px;
    border-width: 1px;
    border-style: hidden;
    border-bottom-style: solid;
    border-color: ${colors.tints[6]};
    padding: 6px 10px;
  }
  input[type="text"]:focus {
    background-color: ${colors.tints[13]};
  }

  input[type="radio"] {
    border-color: ${colors.tints[3]};
    outline-color: ${colors.tints[3]};
  }
  input[type="radio"]:focus {
    border-color: ${colors.tints[3]};
    border-width: 6px;
  }

  input[type="submit"] {
    outline: none;
    background-color: ${colors.tints[3]};
    color: white;
    padding: 12px 20px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
  }
  input[type="submit"]:hover,
  input[type="submit"]:disabled {
    background-color: ${colors.tints[6]};
  }

  div.slider {
    display: flex;
    justify-contents: space-between;
    align-items: center;
  }
  input[type="range"] {
    display: inline;
    width: 75%;
    margin-left: 0;
    margin-right: 10px;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    background: ${colors.tints[8]};
    height: 4px;
    border-radius: 2px;
    cursor: pointer;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    background: ${colors.tints[8]};
    border-radius: 2px;
    border: 0px;
  }
  input[type="range"]::-webkit-slider-thumb {
    height: 12px;
    width: 12px;
    border-radius: 12px;
    background: ${colors.tints[4]};
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -4px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: ${colors.tints[7]};
  }
  output {
    color: ${colors.tints[0]};
    display: inline;
    width: 25%;
    text-align: right;
  }
`;

const AssumptionsForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    getValues,
    setValue,
    watch,
    reset,
    formState: { isSubmitSuccessful, isDirty, isValid },
  } = useForm<IAssumptions>({ mode: "onBlur" });
  const dispatch = useDispatch();
  const initialValues = useSelector((state: any) => state.assumptions);
  const [submittedValues, setSubmittedValue] = useState(initialValues);

  // Initial data load
  useEffect(() => {
    dispatch(fetchProjectedBalances(initialValues));
  }, [dispatch, initialValues]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...submittedValues });
    }
  }, [isSubmitSuccessful, submittedValues, reset]);

  const onSubmit = (data: Record<string, string>) => {
    // Strip out commas and convert to numbers.
    const result: any = {};
    Object.entries(data).forEach(
      ([key, value]) => (result[key] = Number(value.replace(/,/g, "")))
    );
    result.finalAge = 99;
    result.withdrawalRate /= 100;
    result.expectedRealReturn /= 100;
    result.expectedInflationRate /= 100;
    result.output = data.output;

    dispatch(fetchProjectedBalances(data));

    setSubmittedValue(data);
  };

  const insertThousandSeparator = (
    fieldName: "startBalance" | "annualContribution"
  ): void => {
    const origValue = getValues(fieldName);
    const number = Number(origValue.toString().replace(/,/g, ""));

    setValue(fieldName, isNaN(number) ? origValue : number.toLocaleString());
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
        onBlur={() => insertThousandSeparator("startBalance")}
      />
      {errors.startBalance && <p className="errors">Positive balance</p>}
      <label htmlFor="annualContribution">Annual contribution ($)</label>
      <input
        name="annualContribution"
        ref={register({
          required: true,
          min: 0,
          pattern: /^[0-9,/.]*$/,
        })}
        defaultValue={initialValues.annualContribution}
        type="text"
        onBlur={() => insertThousandSeparator("annualContribution")}
      />
      {errors.annualContribution && <p className="errors">Positive balance</p>}
      <label className="newsection" htmlFor="currentAge">
        Current age (years)
      </label>
      <div className="slider">
        <input
          name="currentAge"
          ref={register({
            required: true,
          })}
          defaultValue={initialValues.currentAge}
          type="range"
          min="25"
          max="75"
        />
        <output htmlFor="currentAge">
          {watch("currentAge", initialValues.currentAge)}
        </output>
      </div>
      <label htmlFor="startAge">Retirement age (years)</label>
      <div className="slider">
        <input
          name="startAge"
          ref={register({
            required: true,
          })}
          defaultValue={initialValues.startAge}
          type="range"
          min="60"
          max="70"
        />
        <output htmlFor="startAge">
          {watch("startAge", initialValues.startAge)}
        </output>
      </div>
      <label className="newsection" htmlFor="withdrawalRate">
        Withdrawal rate (%)
      </label>
      <div className="slider">
        <input
          name="withdrawalRate"
          ref={register({
            required: true,
          })}
          defaultValue={initialValues.withdrawalRate}
          type="range"
          min="0"
          max="6"
          step="0.25"
        />
        <output htmlFor="withdrawalRate">
          {Number(
            watch("withdrawalRate", initialValues.withdrawalRate)
          ).toFixed(2)}
          %
        </output>
      </div>
      <label htmlFor="expectedRealReturn">Real return (%)</label>
      <div className="slider">
        <input
          name="expectedRealReturn"
          ref={register({
            required: true,
          })}
          defaultValue={initialValues.expectedRealReturn}
          type="range"
          min="0"
          max="6"
          step="0.25"
        />
        <output htmlFor="expectedRealReturn">
          {Number(
            watch("expectedRealReturn", initialValues.expectedRealReturn)
          ).toFixed(2)}
          %
        </output>
      </div>
      <label htmlFor="expectedInflationRate">Inflation (%)</label>
      <div className="slider">
        <input
          name="expectedInflationRate"
          ref={register({
            required: true,
          })}
          defaultValue={initialValues.expectedInflationRate}
          type="range"
          min="0"
          max="6"
          step="0.25"
        />
        <output htmlFor="expectedInflationRate">
          {Number(
            watch("expectedInflationRate", initialValues.expectedInflationRate)
          ).toFixed(2)}
          %
        </output>
      </div>
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
      <input type="submit" value="Calculate" disabled={!isDirty || !isValid} />
    </Form>
  );
};

export default AssumptionsForm;
