"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Modal from '../../../components/modal';
import { useRouter } from 'next/navigation';

const PartnerList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [id, setId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [partnerData, setPartnerData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState('PARTNER_NM');
    const router = useRouter();

    // 파트너 데이터 획득
    useEffect(() => {
        const url = '/api/routes/Partner';
        axios.get(url)
        .then(response => {
            setPartnerData(response.data.dataInfo);
            setFilteredData(response.data.dataInfo); // 초기 필터 데이터 설정
        })
        .catch(error => {
            console.error('Error fetching partner data:', error);
        });
    }, []);
    
    // 검색 기능 >> api로 불러오지 않고 필터로 처리함
    // const handleSearch = (e) => {
    //     e.preventDefault();

    //     const searchCriteria = e.target.elements.searchCriteria.value;
    //     const searchQuery = inputValue;
    //     const TABLE_NAME = 'PARTNER';

    //     console.log(searchCriteria, searchQuery);

    //     axios.get(`/api/routes/Search`, {
    //         params: {
    //             TABLE_NAME: TABLE_NAME,
    //             searchType: searchCriteria,
    //             searchValue: searchQuery,
    //         },
    //     })
    //     .then(response => {
    //         console.log(response.data.dataInfo);
    //         setPartnerData(response.data.dataInfo);
    //     })
    //     .catch(error => {
    //         console.error('Error fetching search results:', error);
    //     });
    // };
    // const handleClear = () => {
    //     setInputValue('');
    //     axios.get('/api/routes/Partner')
    //         .then(response => {
    //             setPartnerData(response.data.dataInfo);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching partner data:', error);
    //         });
    // };
    // 검색 기능 >> 필터로 처리함
    useEffect(() => {
        const filtered = partnerData.filter(partner => {
            if (searchCriteria === 'PARTNER_NM') {
                return partner.PARTNER_NM.includes(inputValue);
            }
            return false;
        });
        setFilteredData(filtered);
    }, [inputValue, partnerData, searchCriteria]);

    // 파트너 수정
    const handleUpdate = (id) => {
        router.push('/admin/AdminPartner/up?id=' + id);
    };

    // 모달 토글 (삭제)
    const handleDelete = (id) => {
        toggleModal();
        setMessage('확인을 누르면 협력사가 삭제됩니다.');
        setId(id);
    };
    
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setMessage(message);
        if (isModalOpen) {
            setId(null);
        }
    };

    const handleConfirm = () => {
        toggleModal();
        const url = '/api/routes/Partner?id=' + id;

        axios.delete(url)
        .then(response => {
            console.log(response.data.dataInfo);
            setPartnerData(prevData => prevData.filter(partner => partner.ID !== id));
            setFilteredData(prevData => prevData.filter(partner => partner.ID !== id));
        })
        .catch(error => {
            console.error('Error deleting partner data:', error);
        });
    };

    const handleCancel = () => {
        toggleModal();
    };

    // 페이지 네이션 상태
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (pageIndex) => {
        if (pageIndex >= 0 && pageIndex < totalPages) {
            setCurrentPage(pageIndex);
        }
    };

    const getPageNumbers = () => {
        const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
        const endPage = Math.min(totalPages, startPage + 5);
        return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">협력사 관리</h2>
            <div className="flex items-center mb-6">
                <div className="flex w-full gap-2 justify-between">
                    <div className="flex gap-2 w-3/4">
                        <select
                            name="searchCriteria"
                            className="border p-2 rounded w-[7rem]"
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                        >
                            <option value="PARTNER_NM">파트너명</option>
                        </select>
                        <div className="relative w-4/6">
                            <input
                                type="text"
                                name="searchQuery"
                                className="w-full px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="검색어 입력"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setInputValue('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                            &times;
                            </button>
                        </div>
                        <div className='w-1/6'></div>
                    </div>
                    <button type="button" className="bg-gray-300 p-2 rounded justify-end ">
                        <Link href="/admin/AdminPartner/add">
                            추가
                        </Link>
                    </button>
                </div>
            </div>

            {/* 데이터 출력 */}
            <div className="overflow-x-auto">
                <table className="min-w-[780px] table-fixed border-collapse border border-gray-300 text-left">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="pl-4 w-3/12 border">이미지</th>
                            <th className="pl-4 w-7/12 border">파트너명</th>
                            <th className="pl-4 w-2/12 border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((partner) => (
                            <tr key={partner.ID} className="border-b">
                                <td className="p-4 w-2/12 border">
                                    <img src={partner.PARTNER_IMG} className="w-full h-20" />
                                </td>
                                <td className="p-4 w-8/12 border">{partner.PARTNER_NM}</td>
                                <td className="p-4 w-2/12 border space-x-2">
                                    <button 
                                        onClick={() => handleUpdate(partner.ID)}
                                        className="bg-gray-200 p-2 rounded">수정</button>
                                    <button 
                                        onClick={() => handleDelete(partner.ID)}
                                        className="bg-gray-200 p-2 rounded">삭제</button>
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
                        disabled={currentPage === totalPages - 1}
                    >
                        {'>'}
                    </button>
                </div>
            )}
            {isModalOpen && (
                <Modal
                    message={message}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default PartnerList;