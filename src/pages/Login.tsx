import { useState } from "react";
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
import api from "../api/axios";

const Logo = styled.img`
  width: 160px;
  height: auto;
  margin: 0 auto 24px auto;
  display: block;
`;

const Login = () => {
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      setError("이메일/전화번호와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const { data } = await api.post("/api/users/login", {
        identifier: emailOrPhone, // 백엔드에서 이메일,전화번호 겸용 필드면
        password,
      });

      if (data.code=20000) {
        alert("로그인 성공!");
        navigate("/"); // 로그인 후 메인 페이지 이동
      } else {
        setError(data.message || "로그인 실패");
      }
    } catch (err) {
      console.error("로그인 에러:", err);
      setError("네트워크 오류");
    }
  };

  return (
    <>
      <BackNav />
      <Container>
        <Box>
          <Logo src={logo} alt="로고" />
          <InputGroup>
            <InputWrapper>
              <Input
                type="text"
                placeholder="이메일 또는 전화번호"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputWrapper>
          </InputGroup>
          {error && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
              {error}
            </p>
          )}
          <Button onClick={handleLogin}>로그인</Button>
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
