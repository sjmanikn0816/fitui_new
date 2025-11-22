import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ConfirmationPayload = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};
type ConfirmationState = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};
const initialState: ConfirmationState = {
  isOpen: false,
  title: "",
  message: "",
  onConfirm: undefined,
  onCancel: undefined,
};
const confirmationSlice = createSlice({
  name: "confirmation",
  initialState,
  reducers: {
    showConfirmation: (state, action: PayloadAction<ConfirmationPayload>) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
      state.onCancel = action.payload.onCancel;
    },
    hideConfirmation: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.onConfirm = undefined;
      state.onCancel = undefined;
    },
  },
});
export const { showConfirmation, hideConfirmation } = confirmationSlice.actions;
export default confirmationSlice.reducer;





