import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box } from '@mui/material';
import { addMinutes, format } from 'date-fns';
import { collection, getDocs, query } from 'firebase/firestore';

import { fs } from '../../firebase';

const timeTableConfig = {
  startTime: {
    hour: 8,
    minute: 30,
  },
  endTime: {
    hour: 22,
    minute: 30,
  },
  intervalMinute: 30,
  maxReservationSlots: 4,
};

function createTimeTable(config) {
  const { startTime, endTime, intervalMinute } = config;
  const start = new Date();
  start.setHours(startTime.hour, startTime.minute, 0, 0);

  const end = new Date();
  end.setHours(endTime.hour, endTime.minute, 0, 0);

  const timeTable = [];

  let currentTime = start;
  while (currentTime <= end) {
    timeTable.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, intervalMinute);
  }

  if (timeTable[timeTable.length - 1] !== format(end, 'HH:mm')) {
    timeTable[timeTable.length - 1] = format(end, 'HH:mm');
  }

  return timeTable;
}

const FirstTable = ({
  times,
  partitionsTop,
  getSlotSelected,
  reservedSlots,
}) => (
  <TableContainer
    sx={{
      width: '90%',
      height: '100%',
      minWidth: '650px',
      marginLeft: '1%',
      marginRight: 'auto',
      marginTop: '30px',
    }}>
    <Table>
      <TableHead className="fixedPartitions">
        <TableRow>
          {times.map((time, timeIndex) => (
            <TableCell
              key={timeIndex}
              align="center"
              width={200}
              className="fixedPartitions"
              sx={{ height: 60 }} // 슬롯 한 칸의 세로 길이를 50px로 설정
            >
              {time}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {partitionsTop.map(partition => (
          <TableRow key={partition}>
            {times.map((time, timeIndex) => {
              const isSelected = getSlotSelected(partition, timeIndex);
              const isSelectable = true;
              const isReserved = reservedSlots[partition].includes(timeIndex);

              return (
                <TableCell
                  key={timeIndex}
                  sx={{
                    borderLeft: '1px solid #ccc',
                    backgroundColor: isSelected
                      ? '#4B89DC'
                      : isReserved
                        ? '#C1C1C3'
                        : !isSelectable
                          ? '#aaa'
                          : 'transparent',
                    height: 70, // 슬롯 한 칸의 세로 길이를 50px로 설정
                  }}
                />
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const SecondTable = ({
  times,
  partitionsBottom,
  getSlotSelected,
  reservedSlots,
}) => (
  <TableContainer
    sx={{
      width: '90%',
      height: '100%',
      minWidth: '650px',
      marginLeft: '1%',
      marginRight: 'auto',
      marginTop: '30px',
    }}>
    <Table>
      <TableHead className="fixedPartitions">
        <TableRow>
          {times.map((time, timeIndex) => (
            <TableCell
              key={timeIndex}
              align="center"
              width={200}
              className="fixedPartitions"
              sx={{ height: 60 }} // 슬롯 한 칸의 세로 길이를 50px로 설정
            >
              {time}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {partitionsBottom.map(partition => (
          <TableRow key={partition}>
            {times.map((time, timeIndex) => {
              const isSelected = getSlotSelected(partition, timeIndex);
              const isSelectable = true;
              const isReserved = reservedSlots[partition].includes(timeIndex);

              return (
                <TableCell
                  key={timeIndex}
                  sx={{
                    borderLeft: '1px solid #ccc',
                    backgroundColor: isSelected
                      ? '#4B89DC'
                      : isReserved
                        ? '#C1C1C3'
                        : !isSelectable
                          ? '#aaa'
                          : 'transparent',
                    height: 70,
                  }}
                />
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// const LeftDownTable = () => (
//   <Box marginLeft={'30px'} marginTop={'100px'}>
//     <div>room1</div>
//     <br></br>
//     <br></br>
//     <div>room2</div>
//   </Box>
// );
// const LeftDownTable = () => (
//   <Box
//     display="flex"
//     flexDirection="column"
//     marginLeft={'30px'}
//     marginTop={'100px'}>
//     <Button
//       key={1}
//       variant="contained"
//       color="primary"
//       sx={{ marginBotton: '8px' }}>
//       {`room${1}`}
//     </Button>
//     <br></br>
//     <Button
//       key={2}
//       variant="contained"
//       color="primary"
//       sx={{ marginBotton: '8px' }}>
//       {`room${2}`}
//     </Button>
//   </Box>
// );

const Status = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();

  const [selectedPartition] = useState(null);
  const [startTimeIndex] = useState(null);
  const [endTimeIndex] = useState(null);

  const times = useMemo(() => createTimeTable(timeTableConfig), []);

  const [reservedSlots, setReservedSlots] = useState({
    room1_306: [],
    room2_306: [],
    room3_306: [],
    room4_306: [],
    room1_428: [],
    room2_428: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const getSlotSelected = useCallback(
    (partition, timeIndex) => {
      if (!startTimeIndex || !endTimeIndex) return false;
      if (selectedPartition !== partition) return false;
      if (!(startTimeIndex <= timeIndex && timeIndex <= endTimeIndex))
        return false;

      return true;
    },
    [startTimeIndex, endTimeIndex, selectedPartition],
  );

  // const toggleSlot = useCallback(
  //   (partition, timeIndex) => {
  //     const isExist = getSlotSelected(partition, timeIndex);
  //     console.log(partition, timeIndex, isExist);

  //     if (!startTimeIndex && !endTimeIndex) {
  //       setSelectedPartition(partition);
  //       setStartTimeIndex(timeIndex);
  //       setEndTimeIndex(timeIndex);
  //       return;
  //     }

  //     if (selectedPartition !== partition) {
  //       setSelectedPartition(partition);
  //       setStartTimeIndex(timeIndex);
  //       setEndTimeIndex(timeIndex);
  //       return;
  //     }

  //     setSelectedPartition(partition);
  //     setStartTimeIndex(timeIndex);
  //     setEndTimeIndex(timeIndex);
  //   },
  //   [getSlotSelected, setStartTimeIndex, setEndTimeIndex, selectedPartition],
  // );

  const fetchData = async () => {
    try {
      const q = query(collection(fs, 'roomsEx'));
      const querySnapshot = await getDocs(q);
      const reservedSlots = {
        room1_306: [],
        room2_306: [],
        room3_306: [],
        room4_306: [],
        room1_428: [],
        room2_428: [],
      }; // 각 방마다 독립적인 예약 슬롯 배열 초기화
      querySnapshot.forEach(doc => {
        const { name, startTime, endTime } = doc.data();
        const startIdx = times.findIndex(
          time => time === `${startTime[0]}:${startTime[1]}`,
        );
        const endIdx = times.findIndex(
          time => time === `${endTime[0]}:${endTime[1]}`,
        );
        for (let i = startIdx; i <= endIdx; i++) {
          reservedSlots[name].push(i); // 해당 방의 예약 슬롯 배열에 추가
        }
      });
      console.log(reservedSlots);
      setReservedSlots(reservedSlots);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const partitionsTop = useMemo(
    () => ['room1_306', 'room2_306', 'room3_306', 'room4_306'],
    [],
  );

  const partitionsBottom = useMemo(() => ['room1_428', 'room2_428'], []);

  return (
    <>
      <Typography variant="h5" fontWeight={10} component="div" align="center">
        예약 현황
      </Typography>
      <div
        className="bg-gray-100 h-50 inline-block"
        style={{ marginLeft: '10px' }}>
        {year}년 {month}월 {day}일 {hour}시 {minute}분
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Box marginRight="16px">
          {' '}
          {/* 오른쪽에 간격 추가 */}
          <Box marginLeft={'30px'} marginTop={'40px'}>
            <div>306호</div>
            <br></br>
            <br></br>
            <div>room1</div>
            <br></br>
            <br></br>
            <div>room2</div>
            <br></br>
            <br></br>
            <div>room3</div>
            <br></br>
            <br></br>
            <div>room4</div>
          </Box>
        </Box>
        <FirstTable
          times={times}
          partitionsTop={partitionsTop}
          getSlotSelected={getSlotSelected}
          reservedSlots={reservedSlots}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Box marginRight="16px">
          {' '}
          {/* 오른쪽에 간격 추가 */}
          <Box marginLeft={'30px'} marginTop={'40px'}>
            <div>428호</div>
            <br></br>
            <br></br>
            <div>room1</div>
            <br></br>
            <br></br>
            <div>room2</div>
          </Box>
        </Box>
        <SecondTable
          times={times}
          partitionsBottom={partitionsBottom}
          getSlotSelected={getSlotSelected}
          reservedSlots={reservedSlots}
          sx={{ marginTop: '16px' }}
        />
      </div>
    </>
  );
};

export default Status;
