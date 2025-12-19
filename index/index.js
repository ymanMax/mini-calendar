import { calendarRequest } from '../api/index.js';
const { getReminderSettings, saveReminderSettings, checkAndShowReminders } = require('../utils/reminderUtil');

const app = getApp();

Page({
  data: {
    spotMap: {},
    // 例子，今天之后的日期不能被选中
    // disabledDate({ day, month, year }) {
    //   const now = new Date();
    //   const date = new Date(year, month - 1, day);
    //   return date > now;
    // },
    // 需要改变日期时所使用的字段
    changeTime: '',
    // 存储已经获取过的日期
    dateListMap: [],
    // 提醒设置
    reminderSettings: {},
    // 显示提醒设置界面
    showReminderSettings: false
  },

  onLoad() {
    // 页面加载时获取日历标记数据
    this.getCalendarSpots();
    // 加载提醒设置
    this.loadReminderSettings();
    // 检查并显示提醒
    checkAndShowReminders();
  },

  // 加载提醒设置
  loadReminderSettings() {
    const settings = getReminderSettings();
    this.setData({
      reminderSettings: settings
    });
  },
  
  // 获取日历标记数据
  getCalendarSpots() {
    calendarRequest.getCalendarSpots().then(res => {
      if (res.code === 666) {
        // 转换数据格式为组件需要的格式
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
  
  // 获取日期数据，通常用来请求后台接口获取数据
  getDateList({ detail }) {
    // 检查是否已经获取过该月的数据
    if (this.filterGetList(detail)) {
      // 获取月份数据
      const { setYear, setMonth } = detail;
      calendarRequest.getMonthData({
        year: setYear,
        month: setMonth
      }).then(res => {
        if (res.code === 666) {
          console.log('获取月份数据成功:', res.data);
          // 这里可以处理月份数据，比如更新日历显示
        }
      }).catch(err => {
        console.error('获取月份数据失败:', err);
      });
    }
  },
  // 过滤重复月份请求的方法
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
  // 日期改变的回调
  selectDay({ detail }) {
    console.log(detail, 'selectDay detail');
  },
  // 展开收起时的回调
  openChange({ detail }) {
    console.log(detail, 'openChange detail');
  },
  changetime() {
    this.setData({
      changeTime: '2022/1/1',
    });
  },

  // 切换提醒设置界面显示
  toggleReminderSettings() {
    this.setData({
      showReminderSettings: !this.data.showReminderSettings
    });
  },

  // 启用/禁用提醒
  toggleReminderEnabled() {
    const newSettings = {
      ...this.data.reminderSettings,
      enabled: !this.data.reminderSettings.enabled
    };
    saveReminderSettings(newSettings);
    this.setData({
      reminderSettings: newSettings
    });
  },

  // 设置提前提醒天数
  setAdvanceDays(e) {
    const days = parseInt(e.detail.value);
    const newSettings = {
      ...this.data.reminderSettings,
      advanceDays: days
    };
    saveReminderSettings(newSettings);
    this.setData({
      reminderSettings: newSettings
    });
  },

  // 设置提醒时间
  setReminderTime(e) {
    const time = e.detail.value;
    const newSettings = {
      ...this.data.reminderSettings,
      time: time
    };
    saveReminderSettings(newSettings);
    this.setData({
      reminderSettings: newSettings
    });
  },

  // 设置提醒类型
  toggleReminderType(e) {
    const type = e.currentTarget.dataset.type;
    const newSettings = {
      ...this.data.reminderSettings,
      types: {
        ...this.data.reminderSettings.types,
        [type]: !this.data.reminderSettings.types[type]
      }
    };
    saveReminderSettings(newSettings);
    this.setData({
      reminderSettings: newSettings
    });
  },
});
