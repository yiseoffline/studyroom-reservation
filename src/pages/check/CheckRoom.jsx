import React, { useEffect, useState } from 'react';
import { Button, Popover, Typography } from '@mui/material';
import axios from 'axios';
import { Table } from 'flowbite-react';

import '../login/LoginPage';
import './CheckRoom.css';

import { useMe } from '../../api/user.api';

const Check = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: user } = useMe();
  const [reservations, setReservations] = useState([]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // 자신의 모든 예약 조회
  const checkReservation = async () => {
    try {
      const response = await axios.get(
        'https://api.studyroom.jisub.kim/reservations/me',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      setReservations(response.data.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkReservation();
  }, []);

  return (
    <div>
      <div className="felx text-center font-bold text-3xl mt-20">
        내 신청 현황
      </div>

      <div id="table" className="overflow-x-auto mt-10">
        <Table className="border">
          <Table.Head
            style={{ fontSize: 15 }}
            className="text-black text-center">
            <Table.HeadCell>예약자</Table.HeadCell>
            <Table.HeadCell>호실</Table.HeadCell>
            <Table.HeadCell>날짜</Table.HeadCell>
            <Table.HeadCell>시작 시간</Table.HeadCell>
            <Table.HeadCell>종료 시간</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">삭제</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {reservations.map((reservation, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center text-gray-900">
                <Table.Cell>{user ? user.username : '-'}</Table.Cell>
                <Table.Cell>{reservation.roomName}</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>{reservation.startDateTime}</Table.Cell>
                <Table.Cell>{reservation.endDateTime}</Table.Cell>
                <Table.Cell>
                  <a
                    href="#"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    삭제
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div id="popover" className="mt-6">
        <Button
          style={{
            backgroundColor: '#002D56',
            marginLeft: 15,
            marginTop: 20,
            marginBottom: 40,
          }}
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}>
          내 노쇼 현황
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}>
          <Typography sx={{ p: 2 }}>
            * 현재 예약 취소 없이 세미나실을 방문하지 않은 횟수는 n번 입니다.
            <br />
            (3회 초과 시 세미나실 예약이 제한 됩니다)
          </Typography>
        </Popover>
      </div>
    </div>
  );
};

export default Check;
