"use client";

import React, { createContext, useContext } from 'react';
import { useInView } from 'react-intersection-observer';

const IntersectionObserverContext = createContext();

export const IntersectionObserverProvider = ({ children }) => {
    const options = {
        threshold: 0.1,
        root: null,
        rootMargin: '0px',
        triggerOnce: true,
    };

    return (
        <IntersectionObserverContext.Provider value={options}>
            {children}
        </IntersectionObserverContext.Provider>
    );
};

export const useIntersectionObserver = () => {
    const context = useContext(IntersectionObserverContext);
    if (!context) {
        throw new Error('useIntersectionObserver must be used within a IntersectionObserverProvider');
    }
    return useInView(context);
};
