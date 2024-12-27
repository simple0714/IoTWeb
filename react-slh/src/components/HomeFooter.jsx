import React from "react";

function Footer() {
    return(
        <div className="wrap">
            <div className="flex">
                <div className="logo">
                <img src="/img/logo_row.png" alt="" />
                </div>

                <div className="text">
                <ul className="list">
                    <li>대표이사 김진호</li>
                    <li>justin.kim@softlab-hum.dev</li>
                    <li>+82)010-4099-3636</li>
                </ul>
                <ul className="list">
                    <li>대구광역시 동구 신서로 21길 3-10 C호실 소프트랩 흄</li>
                    <li>사업자번호 219-75-00150</li>
                    <li>개인정보보호책임자 (김진호 justin.kim@softlab-hum.dev)</li>
                </ul>
                </div>
            </div>
        </div>

    )
}

export default Footer;