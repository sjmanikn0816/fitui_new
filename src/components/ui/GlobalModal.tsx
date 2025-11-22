import React from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import StatusModal from "./StatusModal";
import { hideModal } from "@/redux/slice/modalSlice";

const GlobalModal = () => {
  const dispatch = useAppDispatch();
  const { isVisible, type, message } = useAppSelector((state) => state.modal);

  return (
    <StatusModal
      type={type}
      isVisible={isVisible}
      message={message}
      onClose={() => dispatch(hideModal())}
    />
  );
};

export default GlobalModal;