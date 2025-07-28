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
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showAgreementDetail, setShowAgreementDetail] = useState(false);

  const [emailChecked, setEmailChecked] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 유효성 검증 함수들
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
    isValidPassword(password) &&
    password === passwordConfirm &&
    isValidName(name) &&
    isValidPhone(phone) &&
    isValidNickname(nickname) &&
    isValidBirthdate(birthdate) &&
    agreed &&
    emailChecked &&
    phoneChecked &&
    nicknameChecked;

  // ✅ 이메일 중복 체크
  const checkEmail = async () => {
    try {
      const { data } = await api.get(`/api/users/check-email`, {
        params: { email },
      });
      if (data.code === 20000) {
        setErrors((prev) => ({ ...prev, email: "" }));
        setEmailChecked(true);
      } else {
        setErrors((prev) => ({ ...prev, email: data.message }));
        setEmailChecked(false);
      }
    } catch (err) {
      console.error("❌ checkEmail 에러:", err);
      setErrors((prev) => ({ ...prev, email: "네트워크 오류" }));
      setEmailChecked(false);
    }
  };

  // ✅ 전화번호 중복 체크
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
      console.error("❌ checkPhone 에러:", err);
      setErrors((prev) => ({ ...prev, phone: "네트워크 오류" }));
      setPhoneChecked(false);
    }
  };

  // ✅ 닉네임 중복 체크
  const checkNickname = async () => {
    if (isValidNickname(nickname)) {
      setErrors((prev) => ({ ...prev, nickname: "" }));
      setNicknameChecked(true);
    } else {
      setErrors((prev) => ({ ...prev, nickname: "닉네임 형식 오류" }));
      setNicknameChecked(false);
    }
  };

  // ✅ 회원가입 처리
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
      console.error("❌ handleRegister 에러:", err);
      alert("네트워크 오류");
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
