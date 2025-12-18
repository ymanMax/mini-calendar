// mini-calendar项目mock数据

// 日历标记数据
export const calendarSpotData = {
  code: 666,
  data: {
    '2024-01-15': 'deep-spot',
    '2024-01-20': 'spot',
    '2024-02-10': 'spot',
    '2024-02-14': 'deep-spot',
    '2024-03-08': 'spot',
    '2024-03-15': 'spot',
    '2024-04-01': 'deep-spot',
    '2024-04-05': 'spot',
    '2024-05-01': 'deep-spot',
    '2024-05-04': 'spot',
    '2024-06-01': 'spot',
    '2024-06-18': 'deep-spot',
    '2024-07-01': 'spot',
    '2024-07-15': 'spot',
    '2024-08-01': 'deep-spot',
    '2024-08-15': 'spot',
    '2024-09-10': 'spot',
    '2024-09-15': 'deep-spot',
    '2024-10-01': 'deep-spot',
    '2024-10-15': 'spot',
    '2024-11-11': 'deep-spot',
    '2024-11-15': 'spot',
    '2024-12-24': 'deep-spot',
    '2024-12-31': 'deep-spot'
  }
};

// 月份数据
export const monthData = {
  code: 666,
  data: {
    '2024-01': {
      month: '2024-01',
      days: 31,
      events: [
        { date: '2024-01-01', title: '元旦', type: 'holiday' },
        { date: '2024-01-15', title: '重要会议', type: 'meeting' },
        { date: '2024-01-20', title: '项目截止', type: 'deadline' }
      ]
    },
    '2024-02': {
      month: '2024-02',
      days: 29,
      events: [
        { date: '2024-02-10', title: '春节', type: 'holiday' },
        { date: '2024-02-14', title: '情人节', type: 'special' }
      ]
    },
    '2024-03': {
      month: '2024-03',
      days: 31,
      events: [
        { date: '2024-03-08', title: '妇女节', type: 'holiday' },
        { date: '2024-03-15', title: '消费者权益日', type: 'special' }
      ]
    }
  }
};

// 模拟延迟函数
export const mockDelay = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};