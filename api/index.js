import { calendarSpotData, monthData, weatherData, weatherSuggestions, mockDelay } from './mockData.js';

// 日历相关请求
export const calendarRequest = {
  // 获取日历标记数据
  getCalendarSpots() {
    return mockDelay(calendarSpotData);
  },

  // 获取月份数据
  getMonthData(params) {
    const { year, month } = params;
    const monthKey = year + '-' + month.toString().padStart(2, '0');
    
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

// 天气相关请求
export const weatherRequest = {
  // 获取当天天气信息
  getTodayWeather() {
    return mockDelay(weatherData);
  },

  // 获取天气预报
  getWeatherForecast() {
    return mockDelay(weatherData);
  },

  // 获取天气建议
  getWeatherSuggestions() {
    return mockDelay(weatherSuggestions);
  }
};

export default {
  calendarRequest,
  weatherRequest
};
