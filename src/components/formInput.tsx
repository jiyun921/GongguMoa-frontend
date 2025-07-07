// components/formInput.tsx
import React from "react";
import { Input, InputIcon, InputWrapper } from "../styles/common";
import { SmallButton } from "../styles/button";

interface FormInputProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText?: string;
  onButtonClick?: () => void;
  isError?: boolean;
  errorBorderRadius?: string;
  isValid?: boolean;
  iconColor?: string;
}

const FormInput = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  buttonText,
  onButtonClick,
  isError,
  errorBorderRadius,
  iconColor,
}: FormInputProps) => {
  const borderStyle = isError
    ? {
        border: "1px solid red",
        borderRadius: errorBorderRadius || "6px",
      }
    : {};

  return (
    <InputWrapper style={borderStyle}>
      <InputIcon style={{ color: iconColor }}>{icon}</InputIcon>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {buttonText && (
        <SmallButton onClick={onButtonClick}>{buttonText}</SmallButton>
      )}
    </InputWrapper>
  );
};

export default FormInput;
