import styled from "styled-components";
import { colors, borderRadius, fontSize } from "./theme";

export const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: ${colors.greyDark};
  cursor: pointer;
  padding: 0;
`;

export const MypageButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: ${colors.greyDark};
  cursor: pointer;
  padding: 0;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background-color: ${({ disabled }) =>
    disabled ? colors.greyLight2 : colors.primary};
  color: ${({ disabled }) => (disabled ? colors.greyLight : colors.white)};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? colors.greyLight2 : colors.primaryDark};
  }
`;

export const TextButtonWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const TextButton = styled.button`
  background: none;
  border: none;
  color: ${colors.greyDark};
  font-size: ${fontSize.medium};
  padding: 0;
  cursor: pointer;
  border-radius: 0;
  border-bottom: 1px solid ${colors.greyDark};
  line-height: 1.1;
`;

export const SmallButton = styled.button`
  position: absolute;
  right: 16px;
  width: 80px;
  padding: 6px;
  background-color: ${colors.primary};
  color: ${colors.white};
  font-weight: bold;
  border: none;
  border-radius: ${borderRadius.button};
  font-size: ${fontSize.small};
  cursor: pointer;

  &:active {
    background-color: ${colors.primaryDark};
  }
`;
