"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // 쿼리 파라미터에서 ID 가져오기

  useEffect(() => {
    const url = "/api/routes/Contact/" + id;

    console.log("url : ", url);
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        console.log("data : ", response.data.dataInfo);
        setData(response.data.dataInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    const url = "/api/routes/Service/";

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        console.log("serviceData : ", response.data.dataInfo);
        setServiceData(response.data.dataInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // 서비스 코드를 통해 서비스 이름을 가져오는 함수
  const getServiceNames = (serviceCodes) => {
    if (!serviceCodes || !serviceData) return null;

    // 데이터에서 서비스 코드를 파싱
    const parsedServiceCodes = JSON.parse(serviceCodes).serviceCd;

    // 서비스 코드를 서비스 이름으로 매핑
    return parsedServiceCodes
      .map((code) => {
        const service = serviceData.find((s) => s.SERVICE_CD === code);
        return service ? service.SERVICE_NM : null;
      })
      .filter((name) => name !== null) // null 값을 제거
      .join(" / "); // 이름을 쉼표로 구분하여 연결
  };

  return (
    <>
      <div className="text-xl font-bold mb-4">프로젝트 요청(상세)</div>

      {/* 고객 정보 */}
      <div className="text-lg font-semibold mb-2">고객 정보</div>
      <table className="w-3/4 bg-white border border-gray-200 mb-4">
        <tbody className="border border-gray-400">
          <tr className="border border-gray-400">
            <td className="w-1/4 bg-gray-300 px-4 py-2 font-medium">회사 또는 기관명</td>
            <td className="w-3/4 px-4 py-2">{data && data.ORG_NM}</td>
          </tr>
          <tr className="border border-gray-400">
            <td className="w-1/4 bg-gray-300 px-4 py-2 font-medium">담당자명</td>
            <td className="w-3/4 px-4 py-2">{data && data.USER_NM}</td>
          </tr>
          <tr className="border border-gray-400">
            <td className="w-1/4 bg-gray-300 px-4 py-2 font-medium">연락처</td>
            <td className="w-3/4 px-4 py-2">{data && data.PHONE}</td>
          </tr>
          <tr className="border border-gray-400">
            <td className="w-1/4 bg-gray-300 px-4 py-2 font-medium">이메일</td>
            <td className="w-3/4 px-4 py-2">{data && data.EMAIL}</td>
          </tr>
        </tbody>
      </table>

      {/* 서비스 타입 */}
      <div className="text-lg font-semibold mb-2">서비스 타입</div>
      <table className="w-3/4 bg-white border border-gray-200 mb-4">
        <tbody className="border border-gray-400">
          <tr className="border border-gray-400">
            <td className="w-full px-4 py-2">
              {data && getServiceNames(data.SERVICE_CD)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 프로젝트 예산/일정 */}
      <div className="text-lg font-semibold mb-2">프로젝트 예산/일정</div>
      <table className="w-3/4 bg-white border border-gray-200 mb-4">
        <tbody className="border border-gray-400">
          <tr className="border border-gray-400">
            <td className="w-1/4 bg-gray-300 px-4 py-2 font-medium">예산</td>
            <td className="w-3/4 px-4 py-2">{data && data.BUDGET}</td>
          </tr>
          <tr className="border border-gray-400">
            <td className="w-1/4 bg-gray-300 px-4 py-2 font-medium">일정</td>
            <td className="w-3/4 px-4 py-2">{data && data.SCHEDULE}</td>
          </tr>
        </tbody>
      </table>

      {/* 프로젝트 내용 */}
      <div className="text-lg font-semibold mb-2">프로젝트 내용</div>
      <table className="w-3/4 bg-white border border-gray-200 mb-4">
        <tbody className="border border-gray-400">
          <tr className="border border-gray-400">
            <td className="w-full px-4 py-2">
              <textarea 
                readOnly
                value={data ? data.PROJECT_INFO : ''}
                className="w-full border-none resize-none bg-transparent focus:outline-none"
                style={{ minHeight: '100px' }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* 목록 버튼 */}
      <div className="mt-4">
        <Link
          href="/admin/AdminProjectRequest"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </>
  );
}
