import React, {useState, useEffect} from "react";
import axios from 'axios';

function Partner() {
    const URL =
    "http://localhost:3001/apis/partner/list";
    // 파트너 리스트 조회

    const [data, setData] = useState([]);
    const [loding, setLoding] = useState([]);
    const [error, setError] = useState([]);

    const fetchData = async () => {
        try {
            setError(null);
            setLoding(true);

            const response = await axios.get(URL);
            // console.log(response.data);
            // 응답 데이터 확인, 전체 출력
            // 확인완료 주석처리 2024-10-08, 11:25
            setData(response.data.dataInfo);

        } catch(e) {
            setError(e);
        }
        setLoding(false);
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="animation">
            <ul className="banner">
                {data && Array(3).fill(data).flat().map((item, index) => (
                    <li key={index}>
                        {item.PARTNER_IMG === "NO_IMG" ? 
                            item.PARTNER_NM : 
                            <img src={item.PARTNER_IMG} alt={item.PARTNER_NM} />
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Partner;