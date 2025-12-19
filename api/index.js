import { calendarSpotData, monthData, holidayReminderData, mockDelay } from './mockData.js';

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
  },

  // 获取节日提醒设置
  getHolidayReminderSettings() {
    return mockDelay({
      code: 666,
      data: holidayReminderData.data.userSettings
    });
  },

  // 保存节日提醒设置
  saveHolidayReminderSettings(params) {
    return mockDelay({
      code: 666,
      data: {
        ...holidayReminderData.data.userSettings,
        ...params
      }
    });
  },

  // 获取即将到来的节日提醒
  getUpcomingHolidayReminders() {
    return mockDelay({
      code: 666,
      data: holidayReminderData.data.upcomingReminders
    });
  },

  // 标记节日提醒为已读
  markHolidayReminderAsRead(params) {
    const { id } = params;
    const updatedReminders = holidayReminderData.data.upcomingReminders.map(reminder =>
      reminder.id === id ? { ...reminder, isRead: true } : reminder
    );

    return mockDelay({
      code: 666,
      data: updatedReminders
    });
  }
};

export default {
  calendarRequest
};