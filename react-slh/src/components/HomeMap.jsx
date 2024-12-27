import React, { useEffect,useState } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";

function Map() {
    const [load,setLoad] = useState(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=b64dca9f82f63b262471bc27e36439ff&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        // 카카오 맵 API가 로드된 후 지도 생성
        setLoad(true)
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section id="page05" className="section">
        {load ? 
            <div className="wrap">
                <div className="map">
                    <div className="left" style={{ width: "100%", height: "400px" }}>
                        <KakaoMap
                        center={{ lat: 35.877075, lng: 128.723421 }}
                        level={3}
                        style={{ width: "100%", height: "100%" }}
                        >
                        <MapMarker
                            position={{ lat: 35.877075, lng: 128.723421 }}
                            title="여기"
                        />
                        </KakaoMap>
                    </div>
                    <div className="right">
                        <div className="address">
                        <div className="text">오시는 길</div>
                        <div className="subtext">
                            대구광역시 동구 신서로 21길 3-10 C호실 소프트랩 흄
                        </div>
                        </div>
                    </div>
                </div>
            </div> :
        ""}
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </section>
  );
}

export default Map;
