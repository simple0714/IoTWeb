// 이메일 유효성 검사
const validTlds = [
    "com", "net", "org", "edu", "gov", "mil", "int", "info", "biz", "name", "pro", "aero", "coop", "museum",
    "app", "tech", "dev", "store", "blog", "xyz", "online", "website", "space", "shop",
    "kr", "jp", "cn", "us", "uk", "de", "fr", "ca", "au", "br", "in", "ru", "za", "mx", "es"
]; // 화이트리스트

const coTldCombinations = validTlds.filter(tld => tld.length === 2).map(tld => `co.${tld}`);

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tld = email.split('.').pop();
    if (!email.match(emailRegex)) {
        return '유효한 이메일 형식이 아닙니다.';
    } else if (!validTlds.includes(tld) && !coTldCombinations.includes(tld)) {
        return '허용되지 않는 이메일 도메인입니다.';
    }
    return true; // 유효한 이메일
}

// 전화번호 유효성 검사
export function validatePhone(phone) {
    const phoneRegex = /^\d{10,11}$/;
    if (phone.includes('-')) {
        return '하이픈(-)을 입력할 수 없습니다.';
    } else if (!phone.match(phoneRegex)) {
        return '연락처는 10~11자리를 입력해주세요';
    }
    return true; // 유효한 전화번호
}

// 이름 유효성 검사
export function validateName(name) {
    const nameRegex = /^[가-힣]{2,10}$/;
    return name.match(nameRegex) ? true : '이름은 2~10자의 한글로 입력해주세요.';
}

// 아이디 유효성 검사
export function validateId(id) {
    const idRegex = /^[a-zA-Z0-9]{4,20}$/;
    return id.match(idRegex) ? true : '아이디는 4~20자의 영문 대소문자와 숫자로 입력해주세요.';
}

// 비밀번호 유효성 검사
export function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return password.match(passwordRegex) ? true : '비밀번호는 영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.';
}

// 비밀번호 확인 유효성 검사
export function validatePasswordChk(passwordChk, password) {
    return passwordChk === password ? true : '비밀번호가 일치하지 않습니다.';
}

// 공백 검사
export function validateNoWhitespace(value) {
    if (typeof value === 'string' && value.includes(' ')) {
        return '공백을 포함할 수 없습니다.';
    }
    return true;
}

// URL 배열 유효성 검사
export function validateUrlArray(value) {
    if (!Array.isArray(value) || value.length === 0) {
        return '최소 하나 이상의 이미지를 선택해주세요.';
    }
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (value.every(url => urlRegex.test(url))) {
        return true;
    }
    return '유효하지 않은 URL이 포함되어 있습니다.';
}

// 필수 값 검사
export function validateRequired(value) {
    // 문자열 검사
    if (typeof value === 'string') {
        if (!value || value.trim() === '') {
            return '해당 항목을 입력해주세요.';
        }
        return true;
    } 
    // 파일 검사
    else if (value instanceof File) {
        if (!value.name || value.name.trim() === '') {
            return '이미지 파일의 이름이 필요합니다.';
        }
        // 예를 들어, 파일 크기 제한을 추가할 수 있습니다.
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (value.size > maxSizeInBytes) {
            return '이미지 파일의 크기가 너무 큽니다.';
        }
        return true;
    }
    // 파일 배열 검사 (예: 여러 이미지 업로드)
    else if (Array.isArray(value) && value.every(item => item instanceof File)) {
        if (value.length === 0) {
            return '최소 하나 이상의 이미지를 선택해주세요.';
        }
        return true;
    }
    // 일반 배열 검사
    else if (Array.isArray(value)) {
        if (value.length === 0) {
            return '최소 하나 이상의 항목을 선택해주세요.';
        }
        return true;
    }
    // 유효하지 않은 값 검사
    return '유효한 값을 입력해주세요.';
}

// 숫자만 입력 검사
export function validateNumber(value) {
    const numberRegex = /^\d+$/;
    return numberRegex.test(value) ? true : '숫자만 입력해주세요.';
}

// 한글만 입력 검사
export function validateKorean(value) {
    const koreanRegex = /^[가-힣]*$/;
    return koreanRegex.test(value) ? true : '한글만 입력해주세요.';
}

// 영어만 입력 검사
export function validateEnglish(value) {
    const englishRegex = /^[a-zA-Z]*$/;
    return englishRegex.test(value) ? true : '영어만 입력해주세요.';
}

// Example image validation
export function validateExampleImages(images) {
    if (!Array.isArray(images) || images.length === 0) {
        return '최소 하나 이상의 이미지를 선택해주세요.';
    }
    // Check if all items are either valid files or URLs
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (images.every(item => item instanceof File || urlRegex.test(item))) {
        return true;
    }
    return '유효하지 않은 이미지가 포함되어 있습니다.';
}
