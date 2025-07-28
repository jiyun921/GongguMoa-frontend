import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackLogoNav } from "../components/nav";
import FormInput from "../components/formInput";
import { Container, Box, InputGroup, AgreementWrapper } from "../styles/common";
import { Button, TextButtonWrapper, TextButton } from "../styles/button";
import {
  EmailIcon,
  CheckIcon,
  PasswordIcon,
  NicknameIcon,
  BirthdateIcon,
  PhoneNumberIcon,
  ProfileIcon,
} from "../components/icons";
import { colors } from "../styles/theme";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showAgreementDetail, setShowAgreementDetail] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showAuthInput, setShowAuthInput] = useState(false);
  const [isSendingAuth, setIsSendingAuth] = useState(false);

  const isValidPassword = (pw: string) =>
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(pw);
  const isValidNickname = (nick: string) =>
    /^[가-힣a-zA-Z0-9]{2,8}$/.test(nick) && !/^\d+$/.test(nick);
  const isValidBirthdate = (date: string) =>
    /^\d{8}$/.test(date) &&
    new Date(
      Number(date.slice(0, 4)),
      Number(date.slice(4, 6)) - 1,
      Number(date.slice(6, 8))
    ) <= new Date();
  const isValidName = (text: string) => /^[가-힣]{1,}$/.test(text);
  const isValidPhone = (num: string) => /^\d{10,11}$/.test(num);
  const isValidEmail = (email: string) => /.+@.+\..+/.test(email);

  const isFormValid =
    isValidEmail(email) &&
    isEmailVerified &&
    isValidPassword(password) &&
    password === passwordConfirm &&
    isValidName(name) &&
    isValidPhone(phone) &&
    isValidNickname(nickname) &&
    isValidBirthdate(birthdate) &&
    agreed &&
    phoneChecked &&
    nicknameChecked;

  const sendAuthCode = async () => {
    if (isSendingAuth) return; // 중복 방지
    setIsSendingAuth(true);
    try {
      const { data } = await api.post("/api/users/email-code", { email });
      if (data.code === 20000) {
        alert("인증번호가 이메일로 발송되었습니다.");
        setErrors((prev) => ({ ...prev, email: "" }));
        setShowAuthInput(true); // 인증번호 입력 칸 보이기
      } else {
        setErrors((prev) => ({ ...prev, email: data.message }));
      }
    } catch (err) {
      console.error("sendAuthCode 에러:", err);
      setErrors((prev) => ({ ...prev, email: "네트워크 오류" }));
    } finally {
      setIsSendingAuth(false);
    }
  };

  const verifyAuthCode = async () => {
    try {
      const { data } = await api.post("/api/users/check-emailcode", {
        email,
        code: authCode,
      });
      if (data.success) {
        setIsEmailVerified(true);
        alert("이메일 인증이 완료되었습니다.");
      } else {
        alert(data.message || "인증 실패");
        setIsEmailVerified(false);
      }
    } catch (err) {
      console.error("verifyAuthCode 에러:", err);
      alert("네트워크 오류");
      setIsEmailVerified(false);
    }
  };

  const checkPhone = async () => {
    try {
      const { data } = await api.get(`/api/users/check-phone`, {
        params: { phone },
      });
      if (data.success) {
        setErrors((prev) => ({ ...prev, phone: "" }));
        setPhoneChecked(true);
      } else {
        setErrors((prev) => ({ ...prev, phone: data.message }));
        setPhoneChecked(false);
      }
    } catch (err) {
      console.error("checkPhone 에러:", err);
      setErrors((prev) => ({ ...prev, phone: "네트워크 오류" }));
      setPhoneChecked(false);
    }
  };

  const checkNickname = async () => {
    if (isValidNickname(nickname)) {
      setErrors((prev) => ({ ...prev, nickname: "" }));
      setNicknameChecked(true);
    } else {
      setErrors((prev) => ({ ...prev, nickname: "닉네임 형식 오류" }));
      setNicknameChecked(false);
    }
  };

  const handleRegister = async () => {
    if (!isFormValid) return;
    try {
      const { data } = await api.post(`/api/users/signup`, {
        email,
        password,
        name,
        birthdate: `${birthdate.slice(0, 4)}-${birthdate.slice(
          4,
          6
        )}-${birthdate.slice(6, 8)}`,
        phoneNumber: phone,
        nickname,
      });

      if (data.success) {
        alert("회원가입 성공!");
        navigate("/login");
      } else {
        alert(data.message || "회원가입 실패");
      }
    } catch (err) {
      console.error("handleRegister 에러:", err);
      alert("네트워크 오류");
    }
  };

  return (
    <>
      <BackLogoNav />
      <Container>
        <Box>
          <InputGroup>
            <FormInput
              icon={<EmailIcon />}
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              buttonText="인증번호"
              onButtonClick={sendAuthCode}
              isError={!!errors.email}
              iconColor={isEmailVerified ? colors.primary : undefined}
              disabled={!isValidEmail(email) || isSendingAuth}
            />
            {showAuthInput && !isEmailVerified && (
              <FormInput
                icon={<CheckIcon />}
                type="text"
                placeholder="인증번호 입력"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                buttonText="확인"
                onButtonClick={verifyAuthCode}
              />
            )}
            <FormInput
              icon={<PasswordIcon />}
              type="password"
              placeholder="8~16자리 비밀번호 입력 (영문 + 숫자 + 특수문자 포함)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isError={!!errors.password}
              iconColor={isValidPassword(password) ? colors.primary : undefined}
            />
            <FormInput
              icon={<PasswordIcon />}
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              isError={password !== passwordConfirm}
              errorBorderRadius="0 0 6px 6px"
              iconColor={
                password === passwordConfirm && password !== ""
                  ? colors.primary
                  : undefined
              }
            />
          </InputGroup>

          <InputGroup>
            <FormInput
              icon={<NicknameIcon />}
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              iconColor={isValidName(name) ? colors.primary : undefined}
              isError={!!name && !isValidName(name)}
            />
            <FormInput
              icon={<PhoneNumberIcon />}
              type="text"
              placeholder="휴대전화번호 입력"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              buttonText="중복확인"
              onButtonClick={checkPhone}
              isError={!!errors.phone}
              iconColor={phoneChecked ? colors.primary : undefined}
            />
          </InputGroup>

          <InputGroup>
            <FormInput
              icon={<ProfileIcon />}
              type="text"
              placeholder="2~8자리 닉네임 입력 (영문 또는 한글)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              buttonText="중복확인"
              onButtonClick={checkNickname}
              isError={!!errors.nickname}
              iconColor={isValidNickname(nickname) ? colors.primary : undefined}
            />
            <FormInput
              icon={<BirthdateIcon />}
              type="text"
              placeholder="생년월일 8자리 입력"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              iconColor={
                isValidBirthdate(birthdate) ? colors.primary : undefined
              }
            />
          </InputGroup>

          <InputGroup>
            <AgreementWrapper>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
              >
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: colors.black,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowAgreementDetail((prev) => !prev)}
                >
                  이용약관 동의
                </span>
              </div>
              {showAgreementDetail && (
                <div
                  style={{
                    fontSize: "12px",
                    color: colors.greyDark,
                    marginTop: "6px",
                  }}
                >
                  • 개인정보 수집 및 이용에 동의합니다. <br />
                  • 서비스 이용약관에 동의합니다. <br />• 마케팅 정보 수신에
                  동의합니다.
                </div>
              )}
            </AgreementWrapper>
          </InputGroup>

          <Button disabled={!isFormValid} onClick={handleRegister}>
            회원가입
          </Button>
          <TextButtonWrapper>
            <TextButton onClick={() => navigate("/login")}>로그인</TextButton>
          </TextButtonWrapper>
        </Box>
      </Container>
    </>
  );
};

export default Register;
