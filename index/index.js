import { calendarRequest } from '../api/index.js';
import { weatherRequest } from '../api/index.js';

const app = getApp();

Page({
  data: {
    spotMap: {},
    // 天气数据
    todayWeather: null,
    weatherForecast: [],
    weatherSuggestions: null,
    // 转换后的天气数据，用于日历组件
    weatherMap: {},
    changeTime: '',
    dateListMap: [],
  },
  
  onLoad() {
    this.getCalendarSpots();
    this.getTodayWeather();
    this.getWeatherForecast();
    this.getWeatherSuggestions();
  },
  
  getCalendarSpots() {
    calendarRequest.getCalendarSpots().then(res => {
      if (res.code === 666) {
        const spotMap = {};
        Object.keys(res.data).forEach(date => {
          const [year, month, day] = date.split('-');
          const key = `y${year}m${month}d${day}`;
          spotMap[key] = res.data[date];
        });
        
        this.setData({
          spotMap: spotMap
        });
      }
    }).catch(err => {
      console.error('获取日历标记数据失败:', err);
    });
  },
  
  getTodayWeather() {
    weatherRequest.getTodayWeather().then(res => {
      if (res.code === 666) {
        this.setData({
          todayWeather: res.data.today
        });
      }
    }).catch(err => {
      console.error('获取当天天气信息失败:', err);
    });
  },
  
  getWeatherForecast() {
    weatherRequest.getWeatherForecast().then(res => {
      if (res.code === 666) {
        const forecast = res.data.forecast;
        const weatherMap = this.convertWeatherToMap(forecast);
        
        this.setData({
          weatherForecast: forecast,
          weatherMap: weatherMap
        });
      }
    }).catch(err => {
      console.error('获取天气预报失败:', err);
    });
  },
  
  getWeatherSuggestions() {
    weatherRequest.getWeatherSuggestions().then(res => {
      if (res.code === 666) {
        this.setData({
          weatherSuggestions: res.data
        });
      }
    }).catch(err => {
      console.error('获取天气建议失败:', err);
    });
  },
  
  // 将天气预报数据转换为日历可用的格式
  convertWeatherToMap(forecast) {
    const weatherMap = {};
    forecast.forEach(item => {
      const [year, month, day] = item.date.split('-');
      const key = `y${year}m${month}d${day}`;
      weatherMap[key] = item;
    });
    return weatherMap;
  },
  
  getDateList({ detail }) {
    if (this.filterGetList(detail)) {
      const { setYear, setMonth } = detail;
      calendarRequest.getMonthData({
        year: setYear,
        month: setMonth
      }).then(res => {
        if (res.code === 666) {
          console.log('获取月份数据成功:', res.data);
        }
      }).catch(err => {
        console.error('获取月份数据失败:', err);
      });
    }
  },
  
  filterGetList({ setYear, setMonth }) {
    const dateListMap = new Set(this.data.dateListMap);
    const key = `y${setYear}m${setMonth}`;
    if (dateListMap.has(key)) {
      return false;
    }
    dateListMap.add(key);
    this.setData({
      dateListMap: [...dateListMap],
    });
    return true;
  },
  
  selectDay({ detail }) {
    console.log(detail, 'selectDay detail');
  },
  
  openChange({ detail }) {
    console.log(detail, 'openChange detail');
  },
  
  changetime() {
    this.setData({
      changeTime: '2022/1/1',
    });
  },
});
