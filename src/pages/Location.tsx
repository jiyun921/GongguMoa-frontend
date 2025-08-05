import { useEffect, useState } from "react";
import { Container, Box, InputGroup } from "../styles/common";
import FormInput from "../components/formInput";
import { BackLogoNav } from "../components/nav";
import { Button } from "../styles/button";
import { LocationIcon } from "../components/icons";
import { colors } from "../styles/theme";
import api from "../api/axios";

declare global {
  interface Window {
    kakao: any;
  }
}

const Location = () => {
  const [map, setMap] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState(500);
  const [savedLocation, setSavedLocation] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      const kakao = window.kakao;
      const mapContainer = document.getElementById("map");
      // mapContainer가 null이어도 지도 생성 시도 (강제)
      const mapInstance = new kakao.maps.Map(mapContainer, {
        center: new kakao.maps.LatLng(37.5407626, 127.0793423),
        level: 3,
      });
      new kakao.maps.Marker({
        map: mapInstance,
        position: new kakao.maps.LatLng(37.5407626, 127.0793423),
      });
      setMap(mapInstance);
      setIsMapLoaded(true);
      (async () => {
        try {
          const { data } = await api.get("/api/users/saved-location");
          if (data?.location) setSavedLocation(data.location);
        } catch (err) {
          console.error("저장된 위치 불러오기 실패:", err);
        }
      })();
    };

    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=c82c2da92bb86f7431f2e093d32d2026&libraries=services";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // window.kakao.maps가 생길 때까지 polling
        const interval = setInterval(() => {
          if (window.kakao && window.kakao.maps) {
            clearInterval(interval);
            loadKakaoMap();
          }
        }, 100);
      };
    }
  }, []);

  const searchAddress = () => {
    if (!map || !address) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        new window.kakao.maps.Marker({ map, position: coords });
        map.setCenter(coords);
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    });
  };

  const findMyLocation = () => {
    // isMapLoaded 체크 제거, 무조건 실행
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }
    if (!map || !window.kakao || !window.kakao.maps) {
      alert("지도가 아직 준비되지 않았습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const coords = new window.kakao.maps.LatLng(latitude, longitude);
      new window.kakao.maps.Marker({
        map,
        position: coords,
      });
      map.setCenter(coords);
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.coord2Address(
        coords.getLng(),
        coords.getLat(),
        (result: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setSavedLocation(result[0].address.address_name);
          }
        }
      );
    });
  };

  return (
    <>
      <BackLogoNav />
      <Container>
        <Box>
          <InputGroup>
            <FormInput
              icon={<LocationIcon />}
              type="text"
              placeholder="위치를 입력하세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              buttonText="검색"
              onButtonClick={searchAddress}
              isError={false}
              iconColor={address ? colors.primary : undefined}
            />
          </InputGroup>

          <Button
            style={{ width: "100%", margin: "0 0" }}
            onClick={findMyLocation}
            // disabled={!isMapLoaded} // 비활성화 제거
          >
            현재 위치로 찾기
          </Button>

          <div style={{ margin: "12px", fontSize: "14px" }}>
            <div style={{ marginBottom: "8px" }}>
              저장된 위치:{" "}
              <span style={{ fontWeight: "bold", color: colors.primary }}>
                {savedLocation || "(없음)"}
              </span>
            </div>
            <label style={{ marginRight: "8px" }}>거리 설정:</label>
            <select
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value={100}>100m</option>
              <option value={300}>300m</option>
              <option value={500}>500m</option>
              <option value={1000}>1km</option>
              <option value={2000}>2km</option>
              <option value={3000}>3km</option>
            </select>
          </div>

          <div
            id="map"
            style={{ width: "100%", height: "400px", borderRadius: "12px" }}
          />
        </Box>
      </Container>
    </>
  );
};

export default Location;
