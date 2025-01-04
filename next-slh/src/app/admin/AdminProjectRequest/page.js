"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

function CurrentPage() {
    const [requestData, setRequestData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('USER_NM');
    const [serviceData, setServiceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const serviceResponse = await axios.get('/api/routes/Service');
                const requestResponse = await axios.get('/api/routes/Contact');

                const serviceMap = serviceResponse.data.dataInfo.reduce((map, service) => {
                    map[service.SERVICE_CD] = service.SERVICE_NM;
                    return map;
                }, {});

                const updatedRequestData = requestResponse.data.dataInfo.rows.map(request => {
                    const serviceCodes = JSON.parse(request.SERVICE_CD).serviceCd;
                    const serviceNames = serviceCodes.map(cd => serviceMap[cd] || 'Unknown').join(' / ');
                    return { ...request, SERVICE_NM: serviceNames };
                });

                setRequestData(updatedRequestData);
                setFilteredData(updatedRequestData);
                setServiceData(serviceResponse.data.dataInfo);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // 검색 기능 > api로 검색데이터 받아오기 (실시간으로 변화 할 수도 있을 수 있음)
    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('/api/routes/Search', {
                params: {
                    TABLE_NAME: 'CONTACT',
                    searchType: searchCriteria,
                    searchValue: searchQuery,
                },
            });

            console.log('---------------------------');
            console.log(response.data.dataInfo);

            if (response.data && response.data.dataInfo) {
                const serviceMap = serviceData.reduce((map, service) => {
                    map[service.SERVICE_CD] = service.SERVICE_NM;
                    return map;
                }, {});

                const updatedRequestData = response.data.dataInfo.map(request => {
                    const serviceCodes = JSON.parse(request.SERVICE_CD).serviceCd;
                    const serviceNames = serviceCodes.map(cd => serviceMap[cd] || 'Unknown').join(' / ');
                    return { ...request, SERVICE_NM: serviceNames };
                });

                setFilteredData(updatedRequestData);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };
    const handleClear = () => {
        setSearchQuery('');
        axios.get('/api/routes/Contact')
        .then(response => {
            const serviceMap = serviceData.reduce((map, service) => {
                map[service.SERVICE_CD] = service.SERVICE_NM;
                return map;
            }, {});

            const transformedData = response.data.dataInfo.rows.map(request => {
                const serviceCodes = JSON.parse(request.SERVICE_CD).serviceCd;
                const serviceNames = serviceCodes.map(cd => serviceMap[cd] || 'Unknown').join(' / ');
                return { ...request, SERVICE_NM: serviceNames };
            });
            setFilteredData(transformedData);
        })
        .catch(error => {
            console.error('Error fetching project data:', error);
        });
    };


    const handlePageChange = (pageIndex) => {
        if (pageIndex >= 0 && pageIndex < Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(pageIndex);
        }
    };
    const getPageNumbers = () => {
        const startPage = Math.max(0, Math.min(currentPage - 2, Math.ceil(filteredData.length / itemsPerPage) - 5));
        const endPage = Math.min(Math.ceil(filteredData.length / itemsPerPage), startPage + 5);
        return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">프로젝트 요청 관리</h2>
            <form onSubmit={handleSearch} className="flex items-center mb-6">
                <div className="flex w-full gap-2 justify-between">
                    <div className="flex gap-2 w-3/4">
                        <select
                            name="searchCriteria"
                            className="border p-2 rounded w-[7rem]"
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                        >
                            <option value="USER_NM">고객정보</option>
                            <option value="SERVICE_NM">서비스타입</option>
                            <option value="PROJECT_INFO">문의내용</option>
                            <option value="BUDGET">예산</option>
                            <option value="SCHEDULE">일정</option>
                        </select>
                        <div className="relative w-4/6">
                            <input
                                type="text"
                                name="searchQuery"
                                className="w-full px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="검색어 입력"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                            &times;
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-1/6 bg-gray-200 p-2 rounded"
                        >
                            검색
                        </button>
                    </div>
                </div>
            </form>
            <div className="overflow-x-auto">
                <table className="min-w-[780px] table-fixed border-collapse border border-gray-300 text-left">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="pl-4 w-1/12 border">고객정보</th>
                            <th className="pl-4 w-2/12 border">서비스타입</th>
                            <th className="pl-4 w-3/12 border">문의내용</th>
                            <th className="pl-4 w-1/12 border">예산</th>
                            <th className="pl-4 w-1/12 border">일정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((request) => (
                            <tr
                                key={request.ID}
                                className="border-b cursor-pointer"
                                onClick={() => window.location.href = `/admin/AdminProjectRequest/Detail?id=${request.ID}`}
                            >
                                <td className="p-4 border" title={request.USER_NM}>{request.USER_NM}</td>
                                <td className="p-4 border" title={request.SERVICE_NM}>{request.SERVICE_NM}</td>
                                <td className="p-4 border" title={request.PROJECT_INFO}>
                                    {request.PROJECT_INFO.length > 30 
                                        ? `${request.PROJECT_INFO.substring(0, 30)}...` 
                                        : request.PROJECT_INFO}
                                </td>
                                <td className="p-4 border" title={request.BUDGET}>
                                    {String(request.BUDGET).length > 6
                                        ? `${String(request.BUDGET).substring(0, 6)}...` 
                                        : request.BUDGET}
                                </td>
                                <td className="p-4 border" title={request.SCHEDULE}>
                                    {request.SCHEDULE.length > 8
                                        ? `${request.SCHEDULE.substring(0, 8)}...` 
                                        : request.SCHEDULE}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* 페이지 네이션 */}
            {filteredData.length > itemsPerPage && (
                <div className="flex justify-center py-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-1 border rounded mx-1 hover:bg-blue-500 hover:text-white"
                        disabled={currentPage === 0}
                    >
                        {'<'}
                    </button>
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 border rounded mx-1 ${currentPage === page ? 'bg-blue-500 text-white' : ''} hover:bg-blue-500 hover:text-white`}
                        >
                            {page + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-1 border rounded mx-1 hover:bg-blue-500 hover:text-white"
                        disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage) - 1}
                    >
                        {'>'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CurrentPage;