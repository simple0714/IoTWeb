"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../../../components/modal';
import { useRouter } from 'next/navigation';
// import { validateRequired } from '../../../../utils/validators';
import { useSearchParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProjectAddForm = () => {
    // 쿼리 파라미터 "projectNb" 가져오기
    const searchParams = useSearchParams();
    const projectNb = searchParams.get("id");
    const [stackData, setStackData] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showCancel, setShowCancel] = useState(true);
    const [isCancelClicked, setIsCancelClicked] = useState(false);
    
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [selectedStacks, setSelectedStacks] = useState([]);
    const [image, setImage] = useState('');
    const [projectInfo, setProjectInfo] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const exampleFileInputRef = useRef(null);
    const router = useRouter();

    const [error, setError] = useState({
        title: '',
        stack: '',
        projectInfo: '',
        image: '',
        exampleImage: '',
    });

    const [exampleImages, setExampleImages] = useState([]);
    const [exampleImagePreviews, setExampleImagePreviews] = useState([]);
    const [exampleImageNames, setExampleImageNames] = useState('');

    const [isMobile, setIsMobile] = useState(false);

    // 초기 데이터 획득 (특정projectNb에 대한 데이터)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = '/api/routes/Project/' + projectNb;
                const response = await axios.get(url);
                console.log('Data fetched successfully:', response.data.dataInfo);
    
                setTitle(response.data.dataInfo.projectInfo.TITLE); // 제목 초기값 설정
                setSubtitle(response.data.dataInfo.projectInfo.SUB_TITLE); // 서브제목 초기값 설정
                setImage(response.data.dataInfo.projectInfo.PROJECT_IMG); // 이미지 초기값 설정
                setProjectInfo(response.data.dataInfo.projectInfo.PROJECT_INFO); // 개발 내용 초기값 설정
                setExampleImages(response.data.dataInfo.projectFiles.map(file => file.PROJECT_IMG)); // 예시 이미지 초기값 설정

                // STACK 필드를 JSON으로 파싱
                const parsedStack = JSON.parse(response.data.dataInfo.projectInfo.STACK).stack;
                setSelectedStacks(parsedStack); // 스택 초기값 설정

                // 예시 이미지 URL들을 ,로 구분된 문자열로 변환
                const exampleImageUrls = response.data.dataInfo.projectFiles.map(file => file.PROJECT_IMG).join(', ');
                setExampleImageNames(exampleImageUrls); // 예시 이미지 이름 설정

                // 예시 이미지 URL들을 미리보기로 설정
                const exampleImagePreviews = response.data.dataInfo.projectFiles.map(file => file.PROJECT_IMG);
                setExampleImagePreviews(exampleImagePreviews); // 예시 이미지 미리보기 설정

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [projectNb]);
    // 초기 데이터 획득 (스택 데이터)
    useEffect(() => {
        const url = '/api/routes/Stack';
        axios.get(url)
        .then(response => {
            const stackNames = response.data.map(stack => stack.STACK_NM);
            setStackData(stackNames);
        })
        .catch(error => {
            console.error('Error fetching stack data:', error);
        });
    }, []);
    // 스택 선택 함수
    const handleStackChange = (stack) => {
        setSelectedStacks((prevStacks) =>
        prevStacks.includes(stack)
            ? prevStacks.filter((s) => s !== stack)
            : [...prevStacks, stack]
        );
    };

    // // 실시간 유효성 검사
    // const handleTitleChange = (e) => {
    //     const value = e.target.value;
    //     setTitle(value);
    //     const validationResult = validateRequired(value);
    //     setError((prevError) => ({
    //         ...prevError,
    //         title: validationResult === true ? '' : validationResult
    //     }));
    // };
    // const handleSubtitleChange = (e) => {
    //     const value = e.target.value;
    //     setSubtitle(value);
    // };
    // const handleProjectInfoChange = (e) => {
    //     const value = e.target.value;
    //     setProjectInfo(value);
    //     const validationResult = validateRequired(value);
    //     setError((prevError) => ({
    //         ...prevError,
    //         projectInfo: validationResult === true ? '' : validationResult
    //     }));
    // };
    // const handleSelectedStacksChange = (stack) => {
    //     setSelectedStacks((prevStacks) =>
    //         prevStacks.includes(stack)
    //             ? prevStacks.filter((s) => s !== stack)
    //             : [...prevStacks, stack]
    //     );
    //     const validationResult = validateRequired(selectedStacks);
    //     setError((prevError) => ({
    //         ...prevError,
    //         stack: validationResult === true ? '' : validationResult
    //     }));
    // };

    // // 프로젝트 수정
    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     // 유효성 검사
    //     let hasError = false;
    //     const newError = { title: '', stack: '', projectInfo: '', image: '' };
    //     const titleValidationResult = validateRequired(title);
    //     if (titleValidationResult !== true) {
    //         newError.title = titleValidationResult;
    //         hasError = true;
    //     }
    //     const selectedStacksValidationResult = validateRequired(selectedStacks);
    //     if (selectedStacksValidationResult !== true) {
    //         newError.stack = selectedStacksValidationResult;
    //         hasError = true;
    //     }
    //     const projectInfoValidationResult = validateRequired(projectInfo);
    //     if (projectInfoValidationResult !== true) {
    //         newError.projectInfo = projectInfoValidationResult;
    //         hasError = true;
    //     }
    //     const imageValidationResult = validateRequired(image);
    //     if (imageValidationResult !== true) {
    //         newError.image = imageValidationResult;
    //         hasError = true;
    //     }

    //     const exampleImageValidationResult = validateRequired(exampleImages);
    //     if (exampleImageValidationResult !== true) {
    //         newError.exampleImage = exampleImageValidationResult;
    //         hasError = true;
    //     }

    //     if (hasError) {
    //         setError(newError);
    //         return;
    //     }

    //     let imgUrl = '';
    //     // 이미지를 URL로 변환(AWS S3 이용)
    //     if (typeof image === 'string') {
    //         // 이미지가 URL인 경우
    //         imgUrl = image;
    //     } else {
    //         // 이미지가 파일인 경우 URL로 변환(AWS S3 이용)
    //         try {
    //             const url = '/api/routes/Uplaod';
    //             const formData = new FormData();
    //             formData.append("file", image);

    //             const response = await axios.post(url, formData, {
    //                 headers: { "Content-Type": "multipart/form-data" }
    //             });
    //             console.log('Image converted successfully:', response.data);
    //             imgUrl = response.data.url;
    //         } catch (error) {
    //             console.error('Error converting image:', error);
    //         }
    //     }

    //     let exampleImgUrls = [];
    //     // 파일과 URL을 분리
    //     const filesToUpload = [];
    //     exampleImages.forEach((exampleImage) => {
    //         if (typeof exampleImage === 'string') {
    //             // 이미지가 이미 URL인 경우, 바로 URLs 배열에 추가
    //             exampleImgUrls.push(exampleImage);
    //         } else {
    //             // 이미지가 파일인 경우, 업로드 준비
    //             filesToUpload.push(exampleImage);
    //         }
    //     });

    //     // 업로드가 필요한 파일만 업로드
    //     if (filesToUpload.length > 0) {
    //         const formData = new FormData();
    //         filesToUpload.forEach((file) => {
    //             formData.append("files", file);
    //         });

    //         try {
    //             const url = '/api/routes/Uplaod/Multi';
    //             const response = await axios.post(url, formData, {
    //                 headers: { "Content-Type": "multipart/form-data" }
    //             });
    //             // 새로 업로드된 URL을 기존 URL에 추가
    //             exampleImgUrls = exampleImgUrls.concat(response.data.files.map(file => file.url));
    //         } catch (error) {
    //             console.error('Error converting example images:', error);
    //         }
    //     }

    //     console.log('------멀티 업로드 후 이미지 URL 확인 exampleImgUrls---------');
    //     console.log(exampleImgUrls);

    //     const data = {
    //         title,
    //         subtitle,
    //         imgUrl,
    //         selectedStacks,
    //         projectInfo,
    //         exampleImgUrls,
    //     };

    //     // 프로젝트 등록 axios
    //     try {
    //         const url = '/api/routes/Project';

    //         const data = {
    //             // sort: 0, // 순번
    //             projectNb: projectNb,
    //             title: title,
    //             subTitle: subtitle,
    //             projectImg: imgUrl,
    //             stack: selectedStacks,
    //             projectInfo: projectInfo,
    //             files: exampleImgUrls,
    //         };
    //         const response = await axios.put(url, data)
    //         .then(response => {
    //             // 작성완료 모달 출력 후 프로젝트 조회 페이지로 이동
    //             toggleModal();
    //             setMessage('프로젝트 수정이 완료되었습니다.');
    //             setShowCancel(false);
    //             // 데이터 초기화
    //             // setTitle('');
    //             // setSubtitle('');
    //             // setImage('');
    //             // setImagePreview(null);
    //             console.log('Data submitted successfully:', response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error submitting data:', error);
    //         });

    //     } catch (error) {
    //         console.error('Error submitting data:', error);
    //     }
    // };

    // 모달 토글
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setMessage(message);
    };

    const handleConfirm = () => {
        toggleModal();
        if (isCancelClicked) {
            router.replace('/admin/AdminProject'); // 취소 또는 수정 완료 후 확인 시 이동
        }
        setIsCancelClicked(false); // 상태 초기화
    };

    const handleCancel = () => {
        toggleModal();
    };

    const projectCancel = () => {
        // toggleModal();
        router.replace('/admin/AdminProject');
        // setShowCancel(true); // 모달에서 취소 버튼 활성화
        // setIsCancelClicked(true); // 취소 버튼 클릭 상태 설정
    };

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768); // md 브레이크포인트
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    const renderImages = () => {
        if (isMobile) {
            return (
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full"
                >
                    {exampleImagePreviews.map((preview, index) => (
                        <SwiperSlide key={index}>
                            <div className="text-sm text-gray-500 flex justify-center">
                                <img 
                                    src={preview} 
                                    alt={`Example Preview ${index}`} 
                                    className="mt-2 w-[300px] h-auto"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            );
        }

        return (
            <div className="grid grid-cols-3 gap-2">
                {exampleImagePreviews.map((preview, index) => (
                    <div key={index} className="text-sm text-gray-500">
                        <img 
                            src={preview} 
                            alt={`Example Preview ${index}`} 
                            className="mt-2 w-[300px] h-auto mx-auto" 
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
        {/* <form className="p-6 max-w-3xl mx-auto" onSubmit={handleSubmit}> */}
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">프로젝트 (상세)</h2>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    제목
                </label>
                <input
                    type="text"
                    placeholder="제목"
                    className="p-3 w-full rounded bg-gray-900"
                    readOnly
                    value={title || ''}
                    // onChange={handleTitleChange}
                />
                {/* <div className="text-red-500 text-sm h-5">{error.title}</div> */}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">부 제목</label>
                <input
                    type="text"
                    placeholder="부 제목"
                    className="border p-2 w-full rounded"
                    readOnly
                    value={subtitle || ''}
                    // onChange={handleSubtitleChange}
                />
                {/* <div className="text-red-500 text-sm h-5">{error.subtitle}</div> */}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    스택
                </label>
                <div className="grid grid-cols-3 gap-2 border border-gray-300 rounded p-2">
                {stackData.map((stack) => (
                    <label key={stack} className="pl-4 flex justify-start items-center">
                    <input
                        type="checkbox"
                        disabled
                        checked={selectedStacks.includes(stack)}
                        onChange={() => handleStackChange(stack)}
                    />
                        <span className="pl-2">{stack}</span>
                    </label>
                ))}
                </div>
                {/* <div className="text-red-500 text-sm h-5">{error.stack}</div> */}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    개발 내용
                </label>
                <textarea
                    placeholder="내용"
                    className="p-3 w-full rounded bg-gray-200 h-32 resize-none overflow-y-auto"
                    readOnly
                    value={projectInfo || ''}
                    // onChange={handleProjectInfoChange}
                />
                {/* <div className="text-red-500 text-sm h-5">{error.projectInfo}</div> */}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    대표 이미지
                </label>
                <div className="flex items-center space-x-2">
                    {/* <input
                        type="text"
                        placeholder="이미지"
                        className="p-3 w-full rounded bg-gray-100"
                        value={typeof image === 'string' ? image : (image ? image.name : '')}
                        readOnly
                    /> */}
                    {/* <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    /> */}
                    {/* <button
                        type="button"
                        className="bg-gray-200 px-4 py-2 rounded border border-gray-300 hover:bg-gray-300"
                        onClick={() => fileInputRef.current.click()}
                    >
                        첨부
                    </button> */}
                </div>
                {/* <div className="text-red-500 text-sm h-5">{error.image}</div> */}
                {/* 이미지 미리보기 */}
                {(imagePreview || (typeof image === 'string' && image)) && (
                    <div className="text-sm text-gray-500 flex justify-center">
                        {/* <button type="button" onClick={clearImage} className="text-lg flex justify-end">
                            &times;
                        </button> */}
                        <img 
                            src={imagePreview || image} 
                            alt="Image Preview" 
                            className="mt-2 w-[300px] h-auto" 
                        />
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    예시 이미지
                </label>
                {renderImages()}
            </div>

            <div className="flex justify-center mt-6 space-x-4">
                {/* <button
                    type="submit"
                    className="bg-gray-200 px-6 py-2 rounded border border-gray-300 hover:bg-gray-300"
                >
                    수정
                </button> */}
                <button
                    type="button"
                    className="bg-gray-200 px-6 py-2 rounded border border-gray-300 hover:bg-gray-300"
                    onClick={projectCancel}
                >
                    돌아가기
                </button>
            </div>    
        </div>
        
        {isModalOpen && (
            <Modal
                message={message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                showCancel={showCancel}
            />
        )}
        </>
    );
};

export default ProjectAddForm;
