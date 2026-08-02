export type FloatingObjectPosition = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

export type FloatingObjectConfig = {
  id: string;
  label: string;
  position: FloatingObjectPosition;
  width: string;
  height: string;
  hideOnMobile?: boolean;
};
