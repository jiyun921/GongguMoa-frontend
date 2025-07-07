import { createGlobalStyle } from "styled-components";
import LINESeedKRTh from "../assets/fonts/LINESeedKR-Th.otf";
import LINESeedKRRg from "../assets/fonts/LINESeedKR-Rg.otf";
import LINESeedKRBd from "../assets/fonts/LINESeedKR-Bd.otf";

export const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: 'LINESeedKR';
    src: url(${LINESeedKRTh}) format('opentype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'LINESeedKR';
    src: url(${LINESeedKRRg}) format('opentype');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'LINESeedKR';
    src: url(${LINESeedKRBd}) format('opentype');
    font-weight: 700;
    font-style: normal;
  }

  *, *::before, *::after, body, #root {
    font-family: 'LINESeedKR', sans-serif;
  }
`;
