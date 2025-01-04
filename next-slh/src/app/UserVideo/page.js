// src/app/user/page.js
export default function UserPage() {
    return (
        <>
            <section id="page01" className="section">
                <div className="video">
                    <video muted autoPlay loop playsInline src="./img/main_video.mp4" type="video/mp4"></video>
                </div>
            
                <div className="wrap">
                    <div className="title">
                        <div className="text">사람을 위한 <br /> 실용적인 어플리케이션 메이커</div>
                        <div className="subtext">소프트랩 흄</div>
                    </div>
                </div>
            </section>
        </>
      );
}
  