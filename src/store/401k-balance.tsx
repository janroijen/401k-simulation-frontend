import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAssumptions {
  startBalance: string;
  annualContribution: string;
  currentAge: number;
  startAge: number;
  finalAge: number;
  withdrawalRate: number;
  expectedRealReturn: number;
  expectedInflationRate: number;
  output: "nominal" | "real";
}

const initialValues: IAssumptions = {
  startBalance: "500,000",
  annualContribution: "10,000",
  currentAge: 50,
  startAge: 60,
  finalAge: 99,
  withdrawalRate: 3,
  expectedRealReturn: 2,
  expectedInflationRate: 2,
  output: "real",
};

const cleanRequest = (data: any): IAssumptions => {
  const result: any = {};
  Object.entries(data).forEach(
    ([key, value]) =>
      (result[key] =
        typeof value === "string" ? Number(value.replace(/,/g, "")) : value)
  );
  result.finalAge = 99;
  result.withdrawalRate /= 100;
  result.expectedRealReturn /= 100;
  result.expectedInflationRate /= 100;
  result.output = data.output;

  return result;
};

export const fetchProjectedBalances = createAsyncThunk(
  "401k-balances/fetchProjectedBalance",
  async (assumptions: any | undefined) => {
    const response = await fetch("http://localhost:4000/balances", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanRequest(assumptions ?? initialValues)),
    });
    return response.json();
  }
);

interface IBalancesState {
  assumptions: IAssumptions;
  balances: any;
  loading: "idle" | "pending";
  errors?: any;
}

const initialState: IBalancesState = {
  assumptions: initialValues,
  balances: undefined,
  loading: "idle",
};

const Balance401kSlice = createSlice({
  name: "401k-balances",
  initialState,
  reducers: {
    projectBalances(state, action: PayloadAction<IAssumptions>) {
      state.assumptions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectedBalances.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
        }
      })
      .addCase(fetchProjectedBalances.fulfilled, (state, action) => {
        state.balances = action.payload;
        state.loading = "idle";
      })
      .addCase(fetchProjectedBalances.rejected, (state, action) => {
        state.errors = action.error;
      });
  },
});

export const { projectBalances } = Balance401kSlice.actions;
export default Balance401kSlice.reducer;
