"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Modal from '../../../components/modal';
import { useRouter } from 'next/navigation';

const ProjectList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [id, setId] = useState(null);
    const router = useRouter();

    const [projectData, setProjectData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState('ALL');
    
    // 프로젝트 데이터 획득
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/routes/Project');
                const transformedData = response.data.dataInfo.projectList.map(project => {
                    const stackNames = JSON.parse(project.STACK).stack;
                    return { ...project, stackNames };
                });
                setProjectData(transformedData);
                setFilteredData(transformedData); // 초기 필터 데이터 설정
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        fetchData();
    }, []);
    
    // 검색 기능
    // const handleSearch = (e) => {
    //     e.preventDefault();

    //     const searchCriteria = e.target.elements.searchCriteria.value;
    //     const searchQuery = inputValue;
    //     const TABLE_NAME = 'PROJECT';

    //     console.log(searchCriteria, searchQuery);

    //     axios.get(`/api/routes/Search`, {
    //         params: {
    //             TABLE_NAME: TABLE_NAME,
    //             searchType: searchCriteria,
    //             searchValue: searchQuery,
    //         },
    //     })
    //     .then(response => {
    //         // 검색 결과에서 스택 데이터를 분리
    //         const transformedData = response.data.dataInfo.map(project => {
    //             const stackNames = JSON.parse(project.STACK).stack; // 스택 JSON 파싱
    //             return { ...project, stackNames }; // 스택 배열을 포함한 객체 반환
    //         });
    //         setProjectData(transformedData);
    //     })
    //     .catch(error => {
    //         console.error('Error fetching search results:', error);
    //     });
    // };
    // const handleClear = () => {
    //     setInputValue('');
    //     axios.get('/api/routes/Project')
    //         .then(response => {
    //             const transformedData = response.data.dataInfo.projectList.map(project => {
    //                 const stackNames = JSON.parse(project.STACK).stack;
    //                 return { ...project, stackNames };
    //             });
    //             setProjectData(transformedData);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching project data:', error);
    //         });
    // };
    // 검색 기능 >> 필터로 처리함
    useEffect(() => {
        const lowerCaseInput = inputValue.toLowerCase();
        const filtered = projectData.filter(project => {
            if (searchCriteria === 'TITLE') {
                return project.TITLE.toLowerCase().includes(lowerCaseInput);
            } else if (searchCriteria === 'STACK') {
                return project.stackNames.some(stack => stack.toLowerCase().includes(lowerCaseInput));
            } else if (searchCriteria === 'ALL') {
                return project.TITLE.toLowerCase().includes(lowerCaseInput) || 
                       project.stackNames.some(stack => stack.toLowerCase().includes(lowerCaseInput));
            }
            return false;
        });
        setFilteredData(filtered);
    }, [inputValue, projectData, searchCriteria]);

    // 수정 페이지 이동
    const handleUpdate = (id) => {
        router.push('/admin/AdminProject/up?id=' + id);
    };

    // 모달 토글 (삭제)
    const handleDelete = (id) => {
        toggleModal();
        setMessage('확인을 누르면 프로젝트가 삭제됩니다.');
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
        const url = '/api/routes/Project?id=' + id;

        axios.delete(url)
        .then(response => {
            console.log(response.data.dataInfo);
            setProjectData(prevData => prevData.filter(project => project.PROJECT_NB !== id));
            setFilteredData(prevData => prevData.filter(project => project.PROJECT_NB !== id));
        })
        .catch(error => {
            console.error('Error deleting project data:', error);
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
            <h2 className="text-2xl font-semibold mb-4">프로젝트 관리</h2>
            <div className="flex items-center mb-6">
                <div className="flex w-full gap-2 justify-between">
                    <div className="flex gap-2 w-3/4">
                        <select
                            name="searchCriteria"
                            className="border p-2 rounded w-[7rem]"
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                        >
                            <option value="ALL">전체</option>
                            <option value="TITLE">프로젝트명</option>
                            <option value="STACK">스택</option>
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
                        <Link href="/admin/AdminProject/add">
                            추가
                        </Link>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-[780px] table-fixed border-collapse border border-gray-300 text-left">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="pl-4 w-2/12 border">대표이미지</th>
                            <th className="pl-4 w-5/12 border">프로젝트명</th>
                            <th className="pl-4 w-3/12 border">스택</th>
                            <th className="pl-4 w-2/12 border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((project) => (
                            <tr key={project.PROJECT_NB} className="border-b">
                                <td className="p-4 w-2/12 border">
                                    <Link href={`/admin/AdminProject/detail?id=${project.PROJECT_NB}`}>
                                        <img src={project.PROJECT_IMG} className="w-full h-20" title={project.TITLE}/>
                                    </Link>
                                </td>
                                <td className="p-4 w-5/12 border" title={project.TITLE}>
                                    <Link href={`/admin/AdminProject/detail?id=${project.PROJECT_NB}`}>
                                        {project.TITLE}
                                    </Link>
                                </td>
                                <td className="p-4 w-3/12 border" title={project.stackNames.join(' / ')}>
                                    <Link href={`/admin/AdminProject/detail?id=${project.PROJECT_NB}`}>
                                        {project.stackNames.join(' / ')}
                                    </Link>
                                </td>
                                <td className="p-4 w-2/12 border space-x-2">
                                    <button
                                        onClick={() => handleUpdate(project.PROJECT_NB)}
                                        className="bg-gray-200 p-2 rounded">
                                        수정
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(project.PROJECT_NB)}
                                        className="bg-gray-200 p-2 rounded">
                                        삭제
                                    </button>
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

export default ProjectList;
  