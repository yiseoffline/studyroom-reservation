import React, { useEffect } from 'react';
import { Navbar } from 'flowbite-react';
import Logo from '../../assets/logo.png';
import useAuth from '../../hooks/useAuth';
import { useIsAdminData, useMyInfo } from '../../api/user.api';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const { loggedIn, logout } = useAuth();
  const { data: myInfo } = useMyInfo();
  const { data: isAdmin, refetch } = useIsAdminData();

  useEffect(() => {
    if (loggedIn) {
      refetch();
    }
  }, [loggedIn, refetch]);

  // 출석체크용 아이디
  const isCesStudyroom = myInfo?.username === 'ces_studyroom';

  return (
    <Navbar fluid rounded className="border-b-2">
      <Navbar.Brand href="/">
        <img src={Logo} className="mr-3 h-6 sm:h-9" alt="cse logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          컴퓨터공학부 세미나실 예약 시스템
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {/* 출석 체크용 아이디라면 */}
        {isCesStudyroom ? (
          <>
            <Navbar.Link href="/selectRoom">출석 체크</Navbar.Link>
            <Navbar.Link href="/">이용 규칙</Navbar.Link>
            {loggedIn ? (
              <Navbar.Link href="/" onClick={logout}>
                로그아웃
              </Navbar.Link>
            ) : (
              <Navbar.Link href="/login">로그인</Navbar.Link>
            )}
          </>
        ) : (
          <>
            {isAdmin === true && (
              <Navbar.Link href="/selectRoom">출석 체크</Navbar.Link>
            )}
            <Navbar.Link href="/roompage">세미나실 예약</Navbar.Link>
            <Navbar.Link
              href={loggedIn ? '/check' : '#'}
              className={!loggedIn ? 'pointer-events-none text-gray-400' : ''}>
              내 신청 현황
            </Navbar.Link>
            <Navbar.Link
              href={loggedIn ? '/otp' : '#'}
              className={!loggedIn ? 'pointer-events-none text-gray-400' : ''}>
              내 QR코드
            </Navbar.Link>
            <Navbar.Link href="/">이용 규칙</Navbar.Link>
            {loggedIn && (
              <Navbar.Link href="/password">비밀번호 변경</Navbar.Link>
            )}
            {loggedIn ? (
              <Navbar.Link href="/" onClick={logout}>
                로그아웃
              </Navbar.Link>
            ) : (
              <Navbar.Link href="/login">로그인</Navbar.Link>
            )}
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
