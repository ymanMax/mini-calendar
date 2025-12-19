// mini-calendar项目mock数据

// 天气数据
export const weatherData = {
  code: 666,
  data: {
    today: {
      date: '2024-12-19',
      weather: '晴',
      temperature: '15°',
      high: '20°',
      low: '8°',
      wind: '东北风 3-4级',
      humidity: '45%'
    },
    forecast: [
      { date: '2024-12-19', weather: '晴', high: '20°', low: '8°', icon: 'sunny' },
      { date: '2024-12-20', weather: '多云', high: '18°', low: '7°', icon: 'cloudy' },
      { date: '2024-12-21', weather: '阴', high: '16°', low: '6°', icon: 'overcast' },
      { date: '2024-12-22', weather: '小雨', high: '14°', low: '5°', icon: 'rainy' },
      { date: '2024-12-23', weather: '晴', high: '17°', low: '6°', icon: 'sunny' },
      { date: '2024-12-24', weather: '晴', high: '19°', low: '7°', icon: 'sunny' },
      { date: '2024-12-25', weather: '多云', high: '18°', low: '8°', icon: 'cloudy' }
    ]
  }
};

// 天气建议数据
export const weatherSuggestions = {
  code: 666,
  data: {
    sunny: {
      title: '晴天建议',
      content: '天气晴朗，适宜外出活动。建议涂抹防晒霜，戴太阳镜。'
    },
    cloudy: {
      title: '多云建议',
      content: '天气多云，温度适宜。适合户外运动和散步。'
    },
    overcast: {
      title: '阴天建议',
      content: '天气阴沉，可能会有降雨。建议携带雨具，注意保暖。'
    },
    rainy: {
      title: '雨天建议',
      content: '今天有雨，出门请携带雨具。路滑请注意交通安全。'
    }
  }
};

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
