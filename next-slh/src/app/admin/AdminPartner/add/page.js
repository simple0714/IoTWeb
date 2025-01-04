"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import Modal from '../../../../components/modal';
import { useRouter } from 'next/navigation';
import { validateRequired } from '../../../../utils/validators';

export default function PartnerAddForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showCancel, setShowCancel] = useState(true);

    const [title, setTitle] = useState('');
    const [urlData, setUrlData] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [error, setError] = useState({
        title: '',
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
        router.replace('/admin/AdminPartner'); // 협력사 조회로 이동
    };

    const handleCancel = () => {
        toggleModal();
    };

    const partnerCancel = () => {
        toggleModal();
        setMessage('확인을 누르면 협력사 추가가 취소됩니다.');
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

    const handleUrlChange = (e) => {
        const value = e.target.value;
        setUrlData(value);
        const validationResult = validateRequired(value);
        setError((prevError) => ({
            ...prevError,
            urlData: validationResult === true ? '' : validationResult
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

    // 협력사 등록
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 유효성 검사
        let hasError = false;
        const newError = { title: '', image: '' };
        const titleValidationResult = validateRequired(title);
        if (titleValidationResult !== true) {
            newError.title = titleValidationResult;
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

        let imgUrl = '';
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

        // 협력사 등록 axios
        try {
            const url = '/api/routes/Partner';

            const data = {
                // sort: 0, // 순번 (about과 동일하게 쿼리에서 마지막 순번 가지고 와서 +1순번으로 저장)
                partnerNm : title,
                partnerUrl : urlData,
                imgUrl : imgUrl,
            };
            const response = await axios.post(url, data)
            .then(response => {
                // 작성완료 모달 출력 후 협력사 조회 페이지로 이동
                toggleModal();
                setMessage('협력사 추가가 완료되었습니다.');
                setShowCancel(false);
                // 데이터 초기화
                setTitle('');
                setUrlData('');
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
            <h2 className="text-2xl font-semibold mb-6">협력사 추가</h2>
            <p className="text-right text-sm mb-6">
                <span className="text-red-500">*</span> 은 필수 입력 항목입니다.
            </p>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    협력사명 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="협력사명"
                    className="p-3 w-full rounded bg-gray-900"
                    value={title}
                    onChange={handleTitleChange}
                />
                <div className="text-red-500 text-sm h-5">{error.title}</div>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    URL
                </label>
                <input
                    type="text"
                    placeholder="URL"
                    className="p-3 w-full rounded bg-gray-900"
                    value={urlData}
                    onChange={handleUrlChange}
                />
            </div>

            <div className="mb-4 w-2/3">
                <label className="block mb-2 font-medium">
                    로고 업로드 <span className="text-red-500">*</span>
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
                    onClick={partnerCancel}
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

  