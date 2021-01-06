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
  p {
    color: #880000;
    text-align: left;
    font-size: 10px;
    margin-top: 2px;
    margin-bottom: 5px;
    height: 10px;
  }
  p::before {
    display: inline;
    content: "⚠ ";
  }

  div.radio {
    display: flex;
    margin-top: 20px;
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
`;

const AssumptionsForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    getValues,
    setValue,
    reset,
    formState: { isSubmitSuccessful, isDirty, isValid },
  } = useForm<IAssumptions>({ mode: "onBlur" });
  const dispatch = useDispatch();
  const initialValues = useSelector((state: any) => state.assumptions);
  const [submittedValues, setSubmittedValue] = useState(initialValues);

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

    dispatch(fetchProjectedBalances(result));

    setSubmittedValue(data);
  };

  const localizeNumber = (value: string): string => {
    const number = Number(
      getValues("startBalance").toString().replace(/,/g, "")
    );

    return isNaN(number) ? value : number.toLocaleString();
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, () => console.log("error"))}
      autoComplete="off"
    >
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
      {errors.startBalance && <p>Positive balance</p>}

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
      {errors.withdrawalRate && <p>Between 0 and 100</p>}

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
      {errors.currentAge && <p>Between 25 and 120</p>}

      <label htmlFor="startAge">Start age (years)</label>
      <input
        name="startAge"
        ref={register({
          required: true,
          min: 60,
          max: 70,
          pattern: /^[0-9/.]*$/,
        })}
        defaultValue={initialValues.startAge}
        type="text"
      />
      {errors.startAge && <p>Between 60 and 70</p>}

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
      {errors.expectedRealReturn && <p>Between 0 and 100</p>}

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
      {errors.expectedInflationRate && <p>Between 0 and 100</p>}

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
