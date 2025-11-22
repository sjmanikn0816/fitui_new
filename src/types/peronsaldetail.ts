import React from "react";

export interface CardOption {
  label: string;            // Text to display
  value: string;            // Unique value for backend / state
  icon?: React.ReactNode;   // Optional icon component
}
