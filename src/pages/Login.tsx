import styled from "styled-components";
import logo from "../assets/logo.png";
import { BackNav } from "../components/nav";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Input,
  InputWrapper,
  InputGroup,
} from "../styles/common";
import { Button, TextButtonWrapper, TextButton } from "../styles/button";

const Logo = styled.img`
  width: 160px;
  height: auto;
  margin: 0 auto 24px auto;
  display: block;
`;

const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <BackNav />
      <Container>
        <Box>
          <Logo src={logo} alt="로고" />
          <InputGroup>
            <InputWrapper>
              <Input type="text" placeholder="이메일 또는 전화번호" />
            </InputWrapper>
            <InputWrapper>
              <Input type="password" placeholder="비밀번호" />
            </InputWrapper>
          </InputGroup>
          <Button>로그인</Button>
          <TextButtonWrapper>
            <TextButton>비밀번호 찾기</TextButton>
            <TextButton onClick={() => navigate("/register")}>
              회원가입
            </TextButton>
          </TextButtonWrapper>
        </Box>
      </Container>
    </>
  );
};

export default Login;
