import React from 'react';
import '../css/modal.css';

const Modal = ({ message, onConfirm, onCancel, showCancel = true }) => {

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-btn">
                    <button className="bg-gray-200 p-2 rounded border border-gray-300 hover:bg-gray-300" onClick={onConfirm}>확인</button>
                    {showCancel && (
                        <button className="bg-gray-200 p-2 rounded border border-gray-300 hover:bg-gray-300" onClick={onCancel}>취소</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;