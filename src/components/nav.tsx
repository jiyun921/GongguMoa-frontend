import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { NavBar, NavLogo } from "../styles/common";
import { BackButton, MypageButton } from "../styles/button";
import { BackArrowIcon, ProfileIcon } from "./icons";

export const BackNav = () => {
  const navigate = useNavigate();

  return (
    <NavBar>
      <BackButton onClick={() => navigate(-1)}>
        <BackArrowIcon />
      </BackButton>
    </NavBar>
  );
};

export const BackLogoNav = () => {
  const navigate = useNavigate();

  return (
    <NavBar>
      <BackButton onClick={() => navigate(-1)}>
        <BackArrowIcon />
      </BackButton>
      <NavLogo src={logo} alt="로고" />
    </NavBar>
  );
};

export const LogoMyNav = () => {
  const navigate = useNavigate();

  return (
    <NavBar>
      <NavLogo src={logo} alt="로고" />
      <MypageButton>
        <ProfileIcon />
      </MypageButton>
    </NavBar>
  );
};
