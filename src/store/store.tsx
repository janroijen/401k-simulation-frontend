import { configureStore } from "@reduxjs/toolkit";

import Balance401kSlice from "./401k-balance";

export const store = configureStore({
  reducer: Balance401kSlice,
});
