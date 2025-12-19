import { calendarSpotData, monthData, memoData, mockDelay } from './mockData.js';

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

// 备忘录相关请求
export const memoRequest = {
  // 获取所有备忘录
  getAllMemos() {
    return mockDelay(memoData);
  },

  // 根据日期获取备忘录
  getMemosByDate(date) {
    const filteredMemos = memoData.data.filter(memo => memo.date === date);
    return mockDelay({
      code: 666,
      data: filteredMemos
    });
  },

  // 添加备忘录
  addMemo(memo) {
    const newMemo = {
      id: Date.now(),
      ...memo,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    memoData.data.push(newMemo);
    return mockDelay({
      code: 666,
      data: newMemo
    });
  },

  // 更新备忘录
  updateMemo(id, memo) {
    const index = memoData.data.findIndex(item => item.id === id);
    if (index !== -1) {
      memoData.data[index] = {
        ...memoData.data[index],
        ...memo,
        updateTime: new Date().toISOString()
      };
      return mockDelay({
        code: 666,
        data: memoData.data[index]
      });
    }
    return mockDelay({
      code: 500,
      message: '备忘录不存在'
    });
  },

  // 删除备忘录
  deleteMemo(id) {
    const index = memoData.data.findIndex(item => item.id === id);
    if (index !== -1) {
      memoData.data.splice(index, 1);
      return mockDelay({
        code: 666,
        data: { id }
      });
    }
    return mockDelay({
      code: 500,
      message: '备忘录不存在'
    });
  }
};

export default {
  calendarRequest,
  memoRequest
};