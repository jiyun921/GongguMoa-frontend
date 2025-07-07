import styled from "styled-components";
import { colors, borderRadius, fontSize } from "./theme";

export const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: ${colors.white};
  padding: 16px;
  box-sizing: border-box;
`;

export const Box = styled.div`
  width: 100%;
  max-width: 680px;
  box-sizing: border-box;
  background-color: ${colors.white};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background-color: ${colors.inputBackground};
  border-bottom: 1px solid ${colors.greyLight2};

  &:last-child {
    border-bottom: none;
  }
`;

export const InputIcon = styled.div`
  width: 18px;
  height: 18px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.greyLight};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Input = styled.input`
  flex: 1;
  font-size: ${fontSize.medium};
  background-color: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${colors.greyLight};
    opacity: 1;
  }
`;

export const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.greyLight2};
  border-radius: ${borderRadius.input};
  overflow: hidden;
  margin-bottom: 16px;
`;

export const NavBar = styled.nav`
  width: 100%;
  height: 48px;
  background-color: ${colors.white};
  box-sizing: border-box;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${colors.greyLight2};
  position: relative;
`;

export const NavLogo = styled.img`
  width: 100px;
  height: auto;
  margin-left: 20px;
  display: block;
`;

export const AgreementWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 16px;
  background-color: ${colors.inputBackground};

  label {
    font-size: 14px;
    color: ${colors.grey};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  input[type="checkbox"] {
    appearance: none;
    width: 16px;
    height: 16px;
    margin: 2px;
    border: 1px solid ${colors.greyLight};
    border-radius: 4px;
    background-color: white;
    position: relative;
    cursor: pointer;

    &:checked {
      background-color: ${colors.primary};
      border-color: ${colors.primary};
    }

    &:checked::after {
      content: "";
      position: absolute;
      top: 1px;
      left: 4px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
`;
