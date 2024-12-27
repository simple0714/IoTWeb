import React from "react";
import { useIntersectionObserver } from "../IntersectionObserverContext";

function Video({theme, toggleTheme}) {
    const { ref, inView } =useIntersectionObserver();

    return(
        <section id="page01" className="section" ref={ref}>
            <div className="video">
                <video src="./img/main_video.mp4" type="video/mp4"
                    muted autoPlay loop playsInline
                ></video>
            </div>
            <div className="wrap">
                <div className={`title ${inView ? "visible" : ""}`}>
                    <div className="text"> 사람을 위한 <br /> 실용적인 어플리케이션 메이커</div>
                    <div className="subtext">소프트랩 흄</div>
                </div>
            </div>
        </section>
    )
}

export default Video;