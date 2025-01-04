import Link from 'next/link';

// 회원가입, 로그인, 아이디 찾기, 비밀번호 찾기, 비밀번호 변경
export default function Layout({ children }) {
    return (
        <>
            <div className="mr-4 ml-4 h-screen grid grid-cols-2 items-center justify-center hidden sm:grid">
                <div className='flex flex-col items-center justify-center'>
                    <Link href="/admin/info/login">
                        <img className='w-[400px]' src="/img/Logo2.png"/>
                    </Link>
                    <Link 
                        href="/" 
                        className='bg-gray-500 text-white px-4 py-2 rounded-md'>
                        홈페이지로 돌아가기
                    </Link>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {children}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center sm:hidden">
                <Link href="/admin/info/login">
                    <h1 className="mt-10 p-4 text-5xl font-bold">
                        <span className='text-red-500'>S</span>
                        <span className='text-gray-900'>OFT-</span>
                        <span className='text-orange-800'>L</span>
                        <span className='text-gray-900 pr-5'>AB </span>
                        <span className='text-amber-600'>H</span>
                        <span className='text-gray-900'>UM</span>
                    </h1>
                </Link>
                <Link 
                    href="/" 
                    className='mb-20 bg-gray-500 text-white px-4 py-2 rounded-md'>
                    홈페이지로 돌아가기
                </Link>
                {children}
            </div>
        </>
    );
}
