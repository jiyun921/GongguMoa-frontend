import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackLogoNav } from "../components/nav";
import FormInput from "../components/formInput";
import { Container, Box, InputGroup, AgreementWrapper } from "../styles/common";
import { Button, TextButtonWrapper, TextButton } from "../styles/button";
import {
  EmailIcon,
  PasswordIcon,
  NicknameIcon,
  BirthdateIcon,
  PhoneNumberIcon,
  ProfileIcon,
} from "../components/icons";
import { colors } from "../styles/theme";

const Register = () => {
  const navigate = useNavigate();

  // 사용자 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showAgreementDetail, setShowAgreementDetail] = useState(false);

  // 중복확인 성공 여부
  const [emailChecked, setEmailChecked] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);

  // 에러 메시지 관리
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 프론트 유효성 검사 함수들
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

  // 전체 유효성 검사
  const isFormValid =
    isValidEmail(email) &&
    isValidPassword(password) &&
    password === passwordConfirm &&
    name &&
    isValidPhone(phone) &&
    isValidNickname(nickname) &&
    isValidBirthdate(birthdate) &&
    agreed &&
    emailChecked &&
    phoneChecked;

  // 이메일 중복 확인 요청
  const checkEmail = async () => {
    const res = await fetch("/api/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!data.success) {
      setErrors((prev) => ({ ...prev, email: data.message }));
      setEmailChecked(false);
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
      setEmailChecked(true);
    }
  };

  // 전화번호 중복 확인 요청
  const checkPhone = async () => {
    const res = await fetch("/api/check-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!data.success) {
      setErrors((prev) => ({ ...prev, phone: data.message }));
      setPhoneChecked(false);
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
      setPhoneChecked(true);
    }
  };

  // 회원가입 제출 처리
  const handleRegister = async () => {
    if (!isFormValid) return;
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
        birthdate,
        phone,
        nickname,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      switch (data.code) {
        case 60000:
          alert("필수 입력 항목이 누락되었습니다.");
          break;
        case 60003:
          setErrors((prev) => ({ ...prev, password: data.message }));
          break;
        case 60004:
          setErrors((prev) => ({ ...prev, email: data.message }));
          break;
        case 60005:
          setErrors((prev) => ({ ...prev, phone: data.message }));
          break;
        case 60006:
          setErrors((prev) => ({ ...prev, nickname: data.message }));
          break;
        case 60007:
          setErrors((prev) => ({ ...prev, birthdate: data.message }));
          break;
        case 60008:
          setErrors((prev) => ({ ...prev, birthdate: data.message }));
          break;
        case 60009:
          setErrors((prev) => ({ ...prev, passwordConfirm: data.message }));
          break;
        default:
          alert(data.message);
      }
    } else {
      alert("회원가입 성공!");
      navigate("/login");
    }
  };

  return (
    <>
      <BackLogoNav />
      <Container>
        <Box>
          {/* 이메일 & 비밀번호 */}
          <InputGroup>
            <FormInput
              icon={<EmailIcon />}
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              buttonText="중복확인"
              onButtonClick={checkEmail}
              isError={!!errors.email}
              iconColor={emailChecked ? colors.primary : undefined}
            />
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

          {/* 이름, 전화번호 */}
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

          {/* 닉네임, 생일 */}
          <InputGroup>
            <FormInput
              icon={<ProfileIcon />}
              type="text"
              placeholder="2~8자리 닉네임 입력 (영문 또는 한글)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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

          {/* 이용약관 동의 */}
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

          {/* 회원가입 버튼 */}
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
