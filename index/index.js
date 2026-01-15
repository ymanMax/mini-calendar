import { calendarRequest, scheduleRequest } from '../api/index.js';

const app = getApp();

// 本地存储键名
const STORAGE_KEY = 'mini-calendar-schedules';

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

    // 日程管理相关数据
    selectedDate: '', // 当前选中的日期
    schedules: [], // 当前日期的日程列表
    newScheduleTitle: '', // 新日程标题
    newScheduleContent: '', // 新日程内容
    editingScheduleId: null, // 当前编辑的日程ID
  },

  onLoad() {
    // 页面加载时获取日历标记数据
    this.getCalendarSpots();
    // 加载本地存储的日程数据
    this.loadSchedulesFromStorage();
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
    // 格式化选中的日期为 'YYYY-MM-DD' 格式
    const selectedDate = `${detail.year}-${String(detail.month).padStart(2, '0')}-${String(detail.day).padStart(2, '0')}`;
    this.setData({
      selectedDate: selectedDate
    });
    // 获取该日期的日程
    this.getSchedulesByDate(selectedDate);
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

  // ========== 日程管理方法 ==========

  // 从本地存储加载日程数据
  loadSchedulesFromStorage() {
    try {
      const storedSchedules = wx.getStorageSync(STORAGE_KEY);
      if (storedSchedules) {
        console.log('从本地存储加载日程数据:', storedSchedules);
      }
    } catch (e) {
      console.error('加载本地存储失败:', e);
    }
  },

  // 将日程数据保存到本地存储
  saveSchedulesToStorage(schedules) {
    try {
      wx.setStorageSync(STORAGE_KEY, schedules);
      console.log('日程数据已保存到本地存储');
    } catch (e) {
      console.error('保存到本地存储失败:', e);
    }
  },

  // 根据日期获取日程
  getSchedulesByDate(date) {
    scheduleRequest.getSchedulesByDate(date).then(res => {
      if (res.code === 666) {
        console.log(`获取${date}的日程成功:`, res.data);
        this.setData({
          schedules: res.data
        });
        // 将数据保存到本地存储
        this.saveSchedulesToStorage(res.data);
      }
    }).catch(err => {
      console.error('获取日程失败:', err);
    });
  },

  // 输入框输入事件 - 标题
  onTitleInput(e) {
    this.setData({
      newScheduleTitle: e.detail.value
    });
  },

  // 输入框输入事件 - 内容
  onContentInput(e) {
    this.setData({
      newScheduleContent: e.detail.value
    });
  },

  // 添加日程
  addSchedule() {
    const { selectedDate, newScheduleTitle, newScheduleContent } = this.data;

    // 验证输入
    if (!selectedDate) {
      wx.showToast({
        title: '请先选择日期',
        icon: 'none'
      });
      return;
    }

    if (!newScheduleTitle.trim()) {
      wx.showToast({
        title: '请输入日程标题',
        icon: 'none'
      });
      return;
    }

    // 创建新日程
    const newSchedule = {
      date: selectedDate,
      title: newScheduleTitle.trim(),
      content: newScheduleContent.trim() || '',
      type: 'personal'
    };

    // 调用 API 添加日程
    scheduleRequest.addSchedule(newSchedule).then(res => {
      if (res.code === 666) {
        console.log('添加日程成功:', res.data);
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
        // 重新获取当前日期的日程
        this.getSchedulesByDate(selectedDate);
        // 清空输入框
        this.setData({
          newScheduleTitle: '',
          newScheduleContent: ''
        });
      }
    }).catch(err => {
      console.error('添加日程失败:', err);
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      });
    });
  },

  // 编辑日程
  editSchedule(e) {
    const scheduleId = e.currentTarget.dataset.id;
    const schedule = this.data.schedules.find(item => item.id === scheduleId);

    if (schedule) {
      this.setData({
        editingScheduleId: scheduleId,
        newScheduleTitle: schedule.title,
        newScheduleContent: schedule.content
      });
      // 显示编辑提示
      wx.showToast({
        title: '请修改日程',
        icon: 'none'
      });
    }
  },

  // 删除日程
  deleteSchedule(e) {
    const scheduleId = e.currentTarget.dataset.id;
    const { selectedDate } = this.data;

    // 确认删除
    wx.showModal({
      title: '确认删除',
      content: '您确定要删除这个日程吗？',
      success: (modalRes) => {
        if (modalRes.confirm) {
          // 调用 API 删除日程
          scheduleRequest.deleteSchedule(scheduleId).then(res => {
            if (res.code === 666) {
              console.log('删除日程成功:', res.data);
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
              // 重新获取当前日期的日程
              this.getSchedulesByDate(selectedDate);
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          }).catch(err => {
            console.error('删除日程失败:', err);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          });
        }
      }
    });
  }
});
