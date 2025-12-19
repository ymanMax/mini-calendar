import { calendarSpotData, monthData, scheduleData, mockDelay } from './mockData.js';

// 日历相关请求
export const calendarRequest = {
  // 获取日历标记数据
  getCalendarSpots() {
    return mockDelay(calendarSpotData);
  },

  // 获取月份数据
  getMonthData(params) {
    const { year, month } = params;
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

    // 模拟从月份数据中获取对应月份的数据
    const monthInfo = monthData.data[monthKey] || {
      month: monthKey,
      days: new Date(year, month, 0).getDate(),
      events: []
    };

    return mockDelay({
      code: 666,
      data: monthInfo
    });
  }
};

// 日程相关请求
export const scheduleRequest = {
  // 获取所有日程
  getAllSchedules() {
    return mockDelay(scheduleData);
  },

  // 根据日期获取日程
  getSchedulesByDate(date) {
    const filteredData = scheduleData.data.filter(item => item.date === date);
    return mockDelay({
      code: 666,
      data: filteredData
    });
  },

  // 添加日程
  addSchedule(schedule) {
    const newId = Math.max(...scheduleData.data.map(item => item.id), 0) + 1;
    const newSchedule = {
      id: newId,
      ...schedule,
      isCompleted: false
    };
    scheduleData.data.push(newSchedule);
    return mockDelay({
      code: 666,
      data: newSchedule
    });
  },

  // 更新日程
  updateSchedule(id, schedule) {
    const index = scheduleData.data.findIndex(item => item.id === id);
    if (index !== -1) {
      scheduleData.data[index] = {
        ...scheduleData.data[index],
        ...schedule
      };
      return mockDelay({
        code: 666,
        data: scheduleData.data[index]
      });
    }
    return mockDelay({
      code: 404,
      message: '日程不存在'
    });
  },

  // 删除日程
  deleteSchedule(id) {
    const index = scheduleData.data.findIndex(item => item.id === id);
    if (index !== -1) {
      const deleted = scheduleData.data.splice(index, 1)[0];
      return mockDelay({
        code: 666,
        data: deleted
      });
    }
    return mockDelay({
      code: 404,
      message: '日程不存在'
    });
  }
};

export default {
  calendarRequest,
  scheduleRequest
};