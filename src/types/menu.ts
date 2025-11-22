import { ReactNode } from "react";

// types/menu.ts
export interface MenuItem {
  id: string;
  icon: string | ReactNode; // ✅ allows either MaterialIcon name or custom JSX
  title: string;
  hasArrow?: boolean;
  onPress: () => void;
}
