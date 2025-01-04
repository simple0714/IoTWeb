"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import Modal from '../../../../components/modal';
import { useRouter } from 'next/navigation';
import { validateRequired } from '../../../../utils/validators';

export default function AboutAddForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showCancel, setShowCancel] = useState(true);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [error, setError] = useState({
        title: '',
        subtitle: '',
        image: ''
    });
    const router = useRouter();

    // 모달 토글
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setMessage(message);
    };

    const handleConfirm = () => {
        toggleModal();
        router.replace('/admin/AdminAbout'); // 소개글 조회로 이동
    };

    const handleCancel = () => {
        toggleModal();
    };

    const aboutCancel = () => {
        toggleModal();
        setMessage('확인을 누르면 소개글 추가가 취소됩니다.');
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
        const validationResult = validateRequired(value);
        setError((prevError) => ({
            ...prevError,
            subtitle: validationResult === true ? '' : validationResult
        }));
    };
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
            const validationResult = validateRequired(file.name);
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
    };

    // 소개글 등록
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 유효성 검사
        let hasError = false;
        const newError = { title: '', subtitle: '', image: '' };
        const titleValidationResult = validateRequired(title);
        if (titleValidationResult !== true) {
            newError.title = titleValidationResult;
            hasError = true;
        }
        const subtitleValidationResult = validateRequired(subtitle);
        if (subtitleValidationResult !== true) {
            newError.subtitle = subtitleValidationResult;
            hasError = true;
        }
        const imageValidationResult = validateRequired(image);
        if (imageValidationResult !== true) {
            newError.image = imageValidationResult;
            hasError = true;
        }
        if (hasError) {
            setError(newError);
            return;
        }
        let imgUrl= '';
        // 이미지를 URL로 변환(AWS S3 이용)
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

        // 소개글 등록 axios
        try {
            const url = '/api/routes/About';

            const data = {
                // sort: 0, // 순번도 받아서 저장하려면 data에 추가하기 (현재 : 쿼리에서 마지막 순번 가지고 와서 +1순번으로 저장)
                // 중간에 삭제된 순번을 알 수 없어서 고민 필요(수정할때도 모든 순번을 알 수 없으니 추후 수정 필요)
                title,
                subtitle,
                imgUrl,
            };

            const response = await axios.post(url, data)
            .then(response => {
                // 작성완료 모달 출력 후 소개글 조회 페이지로 이동
                toggleModal();
                setMessage('소개글 추가가 완료되었습니다.');
                setShowCancel(false);
                // 데이터 초기화
                setTitle('');
                setSubtitle('');
                setImage('');
                setImagePreview(null);
                console.log('Data submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error submitting data:', error);
            });

        } catch (error) {
            console.error('Error submitting data:', error);
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

    return (
        <form className="p-6 max-w-3xl mx-auto" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6">소개글 추가</h2>
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
                    value={title}
                    onChange={handleTitleChange}
                />
                <div className="text-red-500 text-sm h-5">{error.title}</div>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                    placeholder="내용"
                    className="p-3 w-full rounded bg-gray-200 h-32 resize-none overflow-y-auto"
                    value={subtitle}
                    onChange={handleSubtitleChange}
                />
                <div className="text-red-500 text-sm h-5">{error.subtitle}</div>
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
                        value={image ? image.name : ''}
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
                {imagePreview && (
                    <div className="text-sm text-gray-500 w-1/2">
                        <button type="button" onClick={clearImage} className="text-lg flex justify-end">
                            &times;
                        </button>
                        <img src={imagePreview} alt="Image Preview" className="mt-2 w-[300px] h-auto"/>
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-6 space-x-4">
                <button
                    type="submit"
                    className="bg-gray-200 px-6 py-2 rounded border border-gray-300 hover:bg-gray-300"
                >
                    추가
                </button>
                <button
                    type="button"
                    className="bg-gray-200 px-6 py-2 rounded border border-gray-300 hover:bg-gray-300"
                    onClick={aboutCancel}
                >
                    취소
                </button>
            </div>

            {isModalOpen && (
                <Modal
                    message={message}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    showCancel={showCancel}
                />
            )}
        </form>
    );
};

  