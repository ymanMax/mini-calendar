import { calendarRequest } from '../api/index.js';

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
    // 当前选中的日期
    selectedDate: '',
  },
  
  onLoad() {
    // 页面加载时获取日历标记数据
    this.getCalendarSpots();
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
    // 格式化选中的日期为YYYY-MM-DD格式
    const selectedDate = `${detail.year}-${detail.month.toString().padStart(2, '0')}-${detail.day.toString().padStart(2, '0')}`;
    this.setData({
      selectedDate: selectedDate
    });
  },
  
  // 打开添加日程弹窗
  openScheduleModal() {
    this.selectComponent('#scheduleComponent').openAddModal();
  },
  
  // 打开日程列表
  openScheduleList() {
    this.selectComponent('#scheduleComponent').openList();
  },
  
  // 日程变化时的回调
  onScheduleChange({ detail }) {
    console.log('日程变化:', detail.schedules);
    // 更新日历标记
    this.updateSpotMap(detail.schedules);
  },
  
  // 更新日历标记
  updateSpotMap(schedules) {
    const spotMap = {};
    schedules.forEach(schedule => {
      const [year, month, day] = schedule.date.split('-');
      const key = `y${year}m${month}d${day}`;
      spotMap[key] = true;
    });
    this.setData({ spotMap });
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
});
