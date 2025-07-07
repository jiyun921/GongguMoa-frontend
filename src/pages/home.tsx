import styled from "styled-components";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { ProfileIcon } from "../components/icons";
import { LogoMyNav } from "../components/nav";
import {
  Container,
  Input,
  InputWrapper,
} from "../styles/common";

const Home = () => {
  const [filter, setFilter] = useState("전체"); 


  const filters = ["전체", "추천", "인기", "최신"];
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `아이템 제목 ${i + 1}`,
    description: `이건 아이템 ${i + 1}의 설명입니다.`,
    imageUrl: "https://via.placeholder.com/80", // 더미 이미지
  }));

  return (
    <>
      <LogoMyNav />
      <Container>
        <InputWrapper>
        <Input>
        찾으실 상품 입력
        </Input>
        </InputWrapper>
      </Container>
    </>
    // <Wrapper>

    //   <SearchInput placeholder="검색어를 입력하세요" />

    //   <StickyFilter>
    //     {filters.map((f) => (
    //       <FilterButton
    //         key={f}
    //         onClick={() => setFilter(f)}
    //         selected={filter === f}
    //       >
    //         {f}
    //       </FilterButton>
    //     ))}
    //   </StickyFilter>

    //   <ItemList>
    //     {items.map((item) => (
    //       <Item key={item.id}>
    //         <ItemImage src={item.imageUrl} />
    //         <ItemText>
    //           <Title>{item.title}</Title>
    //           <Description>{item.description}</Description>
    //         </ItemText>
    //       </Item>
    //     ))}
    //   </ItemList>
    // </Wrapper>
  );
};

export default Home;
