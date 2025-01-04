"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../../../components/modal';
import { useRouter } from 'next/navigation';
import { validateRequired } from '../../../../utils/validators';
import { useSearchParams } from 'next/navigation';

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

    // 이미지 업로드(단일)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // 이미지 필드 유효성 검사
            const validationResult = validateRequired(file);
            setError((prevError) => ({
                ...prevError,
                image: validationResult === true ? '' : validationResult
            }));
        } else {
            setImage('');
            setImagePreview(null);
            setError((prevError) => ({
                ...prevError,
                image: '이미지를 선택해주세요.'
            }));
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    // 미리보기 이미지 삭제
    const clearImage = () => {
        setImage('');
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 이미지 업로드(멀티)
    const handleExampleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        console.log('새로운 파일:', newFiles); // 디버깅용
        setExampleImages((prevImages) => [...prevImages, ...newFiles]);

        const newFileNames = newFiles.map(file => file.name);
        setExampleImageNames((prevNames) => {
            const namesArray = prevNames ? prevNames.split(', ') : [];
            return [...namesArray, ...newFileNames].join(', ');
        });

        const newPreviews = newFiles.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
            });
        });

        Promise.all(newPreviews).then((newPreviews) => {
            setExampleImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
            console.log('업데이트된 exampleImagePreviews:', exampleImagePreviews); // 디버깅용
        });

        const validationResult = validateRequired(newFiles);
        console.log('유효성 검사 결과:', validationResult); // 디버깅용
        setError((prevError) => ({
            ...prevError,
            exampleImage: validationResult === true ? '' : validationResult
        }));

        if (exampleFileInputRef.current) {
            exampleFileInputRef.current.value = '';
        }
    };
    // 미리보기 삭제
    const clearExampleImage = (index) => {
        setExampleImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setExampleImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
        setExampleImageNames((prevNames) => {
            const namesArray = prevNames.split(', ');
            namesArray.splice(index, 1);
            return namesArray.join(', ');
        });

        // If all images are cleared, reset the file input value
        if (exampleImages.length === 1) {
            if (exampleFileInputRef.current) {
                exampleFileInputRef.current.value = '';
            }
        }
    };
    // 미리보기 전체 삭제
    const clearAllExampleImages = () => {
        setExampleImages([]);
        setExampleImagePreviews([]);
        setExampleImageNames('');
        
        // Reset the file input value
        if (exampleFileInputRef.current) {
            exampleFileInputRef.current.value = '';
        }
    };

    // 실시간 유효성 검사
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        const validationResult = validateRequired(value);
        setError((prevError) => ({
            ...prevError,
            title: validationResult === true ? '' : validationResult
        }));
    };
    const handleSubtitleChange = (e) => {
        const value = e.target.value;
        setSubtitle(value);
    };
    const handleProjectInfoChange = (e) => {
        const value = e.target.value;
        setProjectInfo(value);
        const validationResult = validateRequired(value);
        setError((prevError) => ({
            ...prevError,
            projectInfo: validationResult === true ? '' : validationResult
        }));
    };
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

    // 프로젝트 수정
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 유효성 검사
        let hasError = false;
        const newError = { title: '', stack: '', projectInfo: '', image: '' };
        const titleValidationResult = validateRequired(title);
        if (titleValidationResult !== true) {
            newError.title = titleValidationResult;
            hasError = true;
        }
        const selectedStacksValidationResult = validateRequired(selectedStacks);
        if (selectedStacksValidationResult !== true) {
            newError.stack = selectedStacksValidationResult;
            hasError = true;
        }
        const projectInfoValidationResult = validateRequired(projectInfo);
        if (projectInfoValidationResult !== true) {
            newError.projectInfo = projectInfoValidationResult;
            hasError = true;
        }
        const imageValidationResult = validateRequired(image);
        if (imageValidationResult !== true) {
            newError.image = imageValidationResult;
            hasError = true;
        }

        const exampleImageValidationResult = validateRequired(exampleImages);
        if (exampleImageValidationResult !== true) {
            newError.exampleImage = exampleImageValidationResult;
            hasError = true;
        }

        if (hasError) {
            setError(newError);
            return;
        }

        let imgUrl = '';
        // 이미지를 URL로 변환(AWS S3 이용)
        if (typeof image === 'string') {
            // 이미지가 URL인 경우
            imgUrl = image;
        } else {
            // 이미지가 파일인 경우 URL로 변환(AWS S3 이용)
            try {
                const url = '/api/routes/Uplaod';
                const formData = new FormData();
                formData.append("file", image);

                const response = await axios.post(url, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                console.log('Image converted successfully:', response.data);
                imgUrl = response.data.url;
            } catch (error) {
                console.error('Error converting image:', error);
            }
        }

        let exampleImgUrls = [];
        // 파일과 URL을 분리
        const filesToUpload = [];
        exampleImages.forEach((exampleImage) => {
            if (typeof exampleImage === 'string') {
                // 이미지가 이미 URL인 경우, 바로 URLs 배열에 추가
                exampleImgUrls.push(exampleImage);
            } else {
                // 이미지가 파일인 경우, 업로드 준비
                filesToUpload.push(exampleImage);
            }
        });

        // 업로드가 필요한 파일만 업로드
        if (filesToUpload.length > 0) {
            const formData = new FormData();
            filesToUpload.forEach((file) => {
                formData.append("files", file);
            });

            try {
                const url = '/api/routes/Uplaod/Multi';
                const response = await axios.post(url, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                // 새로 업로드된 URL을 기존 URL에 추가
                exampleImgUrls = exampleImgUrls.concat(response.data.files.map(file => file.url));
            } catch (error) {
                console.error('Error converting example images:', error);
            }
        }

        console.log('------멀티 업로드 후 이미지 URL 확인 exampleImgUrls---------');
        console.log(exampleImgUrls);

        const data = {
            title,
            subtitle,
            imgUrl,
            selectedStacks,
            projectInfo,
            exampleImgUrls,
        };

        // 프로젝트 등록 axios
        try {
            const url = '/api/routes/Project';

            const data = {
                // sort: 0, // 순번
                projectNb: projectNb,
                title: title,
                subTitle: subtitle,
                projectImg: imgUrl,
                stack: selectedStacks,
                projectInfo: projectInfo,
                files: exampleImgUrls,
            };
            const response = await axios.put(url, data)
            .then(response => {
                // 작성완료 모달 출력 후 프로젝트 조회 페이지로 이동
                toggleModal();
                setMessage('프로젝트 수정이 완료되었습니다.');
                setShowCancel(false);
                // 데이터 초기화
                // setTitle('');
                // setSubtitle('');
                // setImage('');
                // setImagePreview(null);
                console.log('Data submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error submitting data:', error);
            });

        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

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
        toggleModal();
        setMessage('확인을 누르면 프로젝트 수정이 취소됩니다.');
        setShowCancel(true); // 모달에서 취소 버튼 활성화
        setIsCancelClicked(true); // 취소 버튼 클릭 상태 설정
    };

    return (
        <>
        <form className="p-6 max-w-3xl mx-auto" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6">프로젝트 수정</h2>
            <p className="text-right text-sm mb-6">
                <span className="text-red-500">*</span> 은 필수 입력 항목입니다.
            </p>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    제목 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="제목"
                    className="p-3 w-full rounded bg-gray-900"
                    value={title || ''}
                    onChange={handleTitleChange}
                />
                <div className="text-red-500 text-sm h-5">{error.title}</div>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">부 제목</label>
                <input
                    type="text"
                    placeholder="부 제목"
                    className="border p-2 w-full rounded"
                    value={subtitle || ''}
                    onChange={handleSubtitleChange}
                />
                <div className="text-red-500 text-sm h-5">{error.subtitle}</div>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    스택 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 border border-gray-300 rounded p-2">
                {stackData.map((stack) => (
                    <label key={stack} className="pl-4 flex justify-start items-center">
                    <input
                        type="checkbox"
                        checked={selectedStacks.includes(stack)}
                        onChange={() => handleStackChange(stack)}
                    />
                        <span className="pl-2">{stack}</span>
                    </label>
                ))}
                </div>
                <div className="text-red-500 text-sm h-5">{error.stack}</div>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    개발 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                    placeholder="내용"
                    className="p-3 w-full rounded bg-gray-200 h-32 resize-none overflow-y-auto"
                    value={projectInfo || ''}
                    onChange={handleProjectInfoChange}
                />
                <div className="text-red-500 text-sm h-5">{error.projectInfo}</div>
            </div>

            <div className="mb-4 w-2/3">
                <label className="block mb-2 font-medium">
                    이미지 업로드 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="이미지"
                        className="p-3 w-full rounded bg-gray-100"
                        value={typeof image === 'string' ? image : (image ? image.name : '')}
                        readOnly
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        className="bg-gray-200 px-4 py-2 rounded border border-gray-300 hover:bg-gray-300"
                        onClick={() => fileInputRef.current.click()}
                    >
                        첨부
                    </button>
                </div>
                <div className="text-red-500 text-sm h-5">{error.image}</div>
                {/* 이미지 미리보기 */}
                {(imagePreview || (typeof image === 'string' && image)) && (
                    <div className="text-sm text-gray-500 w-1/2">
                        <button type="button" onClick={clearImage} className="text-lg flex justify-end">
                            &times;
                        </button>
                        <img 
                            src={imagePreview || image} 
                            alt="Image Preview" 
                            className="mt-2 w-[300px] h-auto" 
                        />
                    </div>
                )}
            </div>

            <div className="mb-4 w-2/3">
                <label className="block mb-2 font-medium">
                    적용 예시 이미지 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="이미지"
                        className="p-3 w-full rounded bg-gray-100"
                        value={exampleImageNames || ''}
                        readOnly
                    />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        ref={exampleFileInputRef}
                        onChange={handleExampleFileChange}
                    />
                    <button
                        type="button"
                        className="bg-gray-200 px-4 py-2 rounded border border-gray-300 hover:bg-gray-300"
                        onClick={() => exampleFileInputRef.current.click()}
                    >
                        첨부
                    </button>
                    {exampleImagePreviews.length > 0 && (
                        <button
                            type="button"
                            className="bg-red-200 px-4 py-2 rounded border border-red-300 hover:bg-red-300"
                            onClick={clearAllExampleImages}
                        >
                            모두 삭제
                        </button>
                    )}
                </div>
                <div className="text-red-500 text-sm h-5">{error.exampleImage}</div>
            </div>
            {/* 이미지 미리보기 */}
            <div className="grid grid-cols-3 gap-2">
                {exampleImagePreviews.map((preview, index) => (
                    <div key={index} className="text-sm text-gray-500">
                        <button type="button" onClick={() => clearExampleImage(index)} className="text-lg flex justify-end">
                            &times;
                        </button>
                        <img src={preview} alt={`Example Image Preview ${index}`} className="mt-2 w-[300px] h-auto" />
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-6 space-x-4">
                <button
                    type="submit"
                    className="bg-gray-200 px-6 py-2 rounded border border-gray-300 hover:bg-gray-300"
                >
                    수정
                </button>
                <button
                    type="button"
                    className="bg-gray-200 px-6 py-2 rounded border border-gray-300 hover:bg-gray-300"
                    onClick={projectCancel}
                >
                    취소
                </button>
            </div>    
        </form>
        
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
