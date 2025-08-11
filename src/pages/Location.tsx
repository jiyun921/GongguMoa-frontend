import { useEffect, useRef, useState } from "react";
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

type SearchItem = {
  name: string;
  addr: string;
  lat: number;
  lng: number;
};

const Location = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const mapObjRef = useRef<any>(null);

  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState(500);
  const [savedLocation, setSavedLocation] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // 현재 선택된 좌표/주소(백엔드로 보낼 값)
  const [currLat, setCurrLat] = useState<number | null>(null);
  const [currLng, setCurrLng] = useState<number | null>(null);
  const [currAddr, setCurrAddr] = useState<string>("");

  // 검색 리스트 & 페이징
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const placesRef = useRef<any>(null); // kakao.maps.services.Places 인스턴스

  // Kakao SDK 로더 (중복 제거 + 캐시버스터)
  useEffect(() => {
    const removeExisting = () => {
      const existed = document.querySelector<HTMLScriptElement>(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      if (existed) existed.remove();
    };

    const initKakao = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;
        const center = new window.kakao.maps.LatLng(37.5407626, 127.0793423);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });
        mapObjRef.current = map;

        markerRef.current = new window.kakao.maps.Marker({
          map,
          position: center,
        });

        // 지도 클릭으로 좌표 선택
        window.kakao.maps.event.addListener(map, "click", (e: any) => {
          const lat = e.latLng.getLat();
          const lng = e.latLng.getLng();
          applyPosition(lat, lng);
        });

        // 마커 드래그로도 변경 가능하게
        markerRef.current.setDraggable(true);
        window.kakao.maps.event.addListener(markerRef.current, "dragend", () => {
          const pos = markerRef.current.getPosition();
          applyPosition(pos.getLat(), pos.getLng());
        });
        
        placesRef.current = new window.kakao.maps.services.Places();
        setReady(true);
        
        // 저장된 위치 불러오기
        (async () => {
          try {
            const { data } = await api.get("/api/users/location");
            if (data?.location) setSavedLocation(data.location);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("저장된 위치 불러오기 실패:", e);
          }
        })();
      });
    };

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      initKakao();
      return;
    }

    // 새로 로드
    removeExisting();
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&libraries=services&v=${Date.now()}`;
    script.async = true;
    script.defer = true;
    script.onload = initKakao;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  // 지도 위치/주소 반영
  const applyPosition = (lat: number, lng: number) => {
    if (!mapObjRef.current || !markerRef.current) return;
    const kakao = window.kakao;
    const coords = new kakao.maps.LatLng(lat, lng);

    markerRef.current.setPosition(coords);
    mapObjRef.current.setCenter(coords);

    setCurrLat(lat);
    setCurrLng(lng);

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(
      lng,
      lat,
      (result: any[], status: string) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const addr =
            result[0].road_address?.address_name ??
            result[0].address?.address_name ??
            "";
          setCurrAddr(addr);
          setAddress(addr); 
        } else {
          setCurrAddr("");
          setAddress("");
        }
      }
    );
  };

  // 검색 시작
  const searchAddress = () => {
    if (!ready || !mapObjRef.current || !address.trim()) return;

    // 새로운 검색: 초기화
    setResults([]);
    setPage(1);
    setQuery(address.trim());
    setHasNext(false);

    // 첫 페이지 로드
    fetchPage(address.trim(), 1);
  };

  // 페이지 가져오기
  const fetchPage = (q: string, p: number) => {
    if (!placesRef.current) return;
    setIsLoading(true);

    placesRef.current.keywordSearch(
      q,
      (data: any[], status: string, pagination: any) => {
        if (status !== window.kakao.maps.services.Status.OK || !data?.length) {
          setIsLoading(false);
          setHasNext(false);
          return;
        }

        const mapped: SearchItem[] = data.map((d: any) => ({
          name: d.place_name,
          addr: d.road_address_name || d.address_name || "",
          lat: parseFloat(d.y),
          lng: parseFloat(d.x),
        }));

        // 첫 결과로 지도 이동(초기 UX)
        if (p === 1 && mapped[0]) {
          applyPosition(mapped[0].lat, mapped[0].lng);
        }

        setResults(prev => [...prev, ...mapped]);

        // 다음 페이지 유무 계산
        const current = pagination?.current || p;
        const last = pagination?.last ?? current;
        setHasNext(current < last);
        setPage(current);

        setIsLoading(false);
      },
      { page: p, size: 15 }
    );
  };

  // 무한스크롤 
  useEffect(() => {
    if (!sentinelRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && !isLoading && hasNext && query) {
          // 다음 페이지 요청
          fetchPage(query, page + 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isLoading, hasNext, page, query]);

  // 결과 선택
  const selectResult = (item: SearchItem) => {
    applyPosition(item.lat, item.lng);
    setCurrAddr(item.addr || item.name);
    setAddress(item.addr || item.name);

    setResults([]);
    setHasNext(false);
  };

  // 내 위치로 찾기
  const findMyLocation = () => {
    if (!ready || !mapObjRef.current) {
      alert("지도가 아직 준비되지 않았습니다.");
      return;
    }
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        applyPosition(latitude, longitude);
      },
      () => {
        alert("현재 위치를 가져올 수 없습니다.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 선택된 좌표/주소 저장 -> 백엔드 POST
  const saveMyLocation = async () => {
    if (currLat == null || currLng == null || !currAddr) {
      alert("저장할 위치가 없습니다. 먼저 주소 검색 또는 현재 위치 찾기를 해주세요.");
      return;
    }
    try {
      await api.post("/api/users/locations", {
        latitude: currLat,
        longitude: currLng,
        location: currAddr,
      });
      setSavedLocation(currAddr);
      alert("내 위치가 저장되었습니다.");
    } catch (e) {
      console.error(e);
      alert("위치 저장에 실패했습니다.");
    }
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
              onKeyDown={(e: any) => { if (e.key === "Enter") searchAddress(); }}
            />
          </InputGroup>

          {/* 검색 결과 리스트 + 무한스크롤 */}
          {results.length > 0 && (
            <div
              style={{
                marginTop: 8,
                border: "1px solid #ddd",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                background: "#fff",
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              {results.map((r, i) => (
                <button
                  key={`${r.name}-${r.lat}-${r.lng}-${i}`}
                  onClick={() => selectResult(r)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderBottom: i === results.length - 1 ? "none" : "1px solid #eee",
                    cursor: "pointer",
                    background: "white",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                    {r.addr}
                  </div>
                </button>
              ))}
              <div ref={sentinelRef} style={{ height: 1 }} />
              {isLoading && (
                <div style={{ padding: 10, textAlign: "center", fontSize: 12, color: "#666" }}>
                  불러오는 중…
                </div>
              )}
              {!hasNext && !isLoading && (
                <div style={{ padding: 10, textAlign: "center", fontSize: 12, color: "#999" }}>
                  더 이상 결과가 없습니다
                </div>
              )}
            </div>
          )}

          <Button
            style={{ width: "100%", margin: "12px 0 0" }}
            onClick={findMyLocation}
          >
            현재 위치로 찾기
          </Button>

          <Button
            style={{ width: "100%", margin: "8px 0 12px" }}
            onClick={saveMyLocation}
            disabled={currLat == null || currLng == null || !currAddr}
          >
            이 위치로 저장
          </Button>

          <div style={{ margin: "12px", fontSize: "14px" }}>
            <div style={{ marginBottom: "6px" }}>
              선택된 위치: <b>{currAddr || "-"}</b>
            </div>
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
            ref={mapRef}
            id="map"
            style={{ width: "100%", height: "400px", borderRadius: "12px" }}
          />
        </Box>
      </Container>
    </>
  );
};

export default Location;
