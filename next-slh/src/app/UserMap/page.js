"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "../../utils/IntersectionObserverContext";

// KakaoMap과 MapMarker를 dynamic import로 클라이언트 측에서만 로딩되도록 설정
const KakaoMap = dynamic(
    () => import("react-kakao-maps-sdk").then((mod) => mod.Map),
    { ssr: false }
);

const MapMarker = dynamic(
    () => import("react-kakao-maps-sdk").then((mod) => mod.MapMarker),
    { ssr: false }
);

function UserMap() {
    const { ref, inView } = useIntersectionObserver();
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=6b16a9589bb53ab1b9b406e5cdbd75e3&autoload=false`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                setLoad(true);
            });
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <section id="page05" className={`section ${inView ? 'view' : ''}`} ref={ref}>
            <div className="wrap">
                <div className="map">
                    <div className="left" style={{ width: "100%", height: "400px" }}>
                        {load && (
                            <KakaoMap
                                center={{ lat: 35.877075, lng: 128.723421 }}
                                level={3}
                                style={{ width: "100%", height: "100%" }}
                            >
                                <MapMarker
                                    position={{ lat: 35.877075, lng: 128.723421 }}
                                />
                            </KakaoMap>
                        )}
                    </div>
                    <div className="right">
                        <div className="address">
                            <div className="text">오시는 길</div>
                            <div className="subtext">대구광역시 동구 신서로 21길 3-10 C호실 소프트랩 흄</div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </section>
    );
}

export default UserMap;
