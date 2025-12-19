import { calendarRequest, memoRequest } from '../api/index.js';

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
    // 备忘录相关数据
    memos: [],
    selectedDate: '',
    showMemoModal: false,
    currentMemo: null,
    memoContent: '',
  },

  onLoad() {
    // 页面加载时获取日历标记数据
    this.getCalendarSpots();
    // 加载备忘录数据
    this.loadMemos();
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

  // 加载备忘录
  loadMemos() {
    memoRequest.getAllMemos().then(res => {
      if (res.code === 666) {
        this.setData({
          memos: res.data
        });
        // 同时保存到本地存储
        wx.setStorageSync('memos', res.data);
      }
    }).catch(err => {
      console.error('获取备忘录失败:', err);
      // 尝试从本地存储加载
      const localMemos = wx.getStorageSync('memos');
      if (localMemos) {
        this.setData({
          memos: localMemos
        });
      }
    });
  },

  // 根据日期加载备忘录
  loadMemosByDate(date) {
    memoRequest.getMemosByDate(date).then(res => {
      if (res.code === 666) {
        this.setData({
          memos: res.data
        });
      }
    }).catch(err => {
      console.error('根据日期获取备忘录失败:', err);
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
    const { year, month, day } = detail;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    this.setData({
      selectedDate: dateStr
    });
    // 加载该日期的备忘录
    this.loadMemosByDate(dateStr);
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

  // 显示添加备忘录弹窗
  showAddMemoModal() {
    if (!this.data.selectedDate) {
      wx.showToast({
        title: '请先选择日期',
        icon: 'none'
      });
      return;
    }
    this.setData({
      showMemoModal: true,
      currentMemo: null,
      memoContent: ''
    });
  },

  // 显示编辑备忘录弹窗
  showEditMemoModal(e) {
    const memo = e.currentTarget.dataset.memo;
    this.setData({
      showMemoModal: true,
      currentMemo: memo,
      memoContent: memo.content
    });
  },

  // 关闭备忘录弹窗
  closeMemoModal() {
    this.setData({
      showMemoModal: false,
      currentMemo: null,
      memoContent: ''
    });
  },

  // 输入备忘录内容
  onMemoInput(e) {
    this.setData({
      memoContent: e.detail.value
    });
  },

  // 保存备忘录
  saveMemo() {
    const { selectedDate, memoContent, currentMemo } = this.data;

    if (!memoContent.trim()) {
      wx.showToast({
        title: '请输入备忘录内容',
        icon: 'none'
      });
      return;
    }

    if (currentMemo) {
      // 编辑现有备忘录
      memoRequest.updateMemo(currentMemo.id, {
        content: memoContent,
        date: selectedDate
      }).then(res => {
        if (res.code === 666) {
          wx.showToast({
            title: '更新成功'
          });
          this.loadMemosByDate(selectedDate);
          this.closeMemoModal();
          // 更新本地存储
          const memos = wx.getStorageSync('memos') || [];
          const index = memos.findIndex(item => item.id === currentMemo.id);
          if (index !== -1) {
            memos[index] = res.data;
            wx.setStorageSync('memos', memos);
          }
        }
      }).catch(err => {
        console.error('更新备忘录失败:', err);
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
      });
    } else {
      // 添加新备忘录
      memoRequest.addMemo({
        date: selectedDate,
        content: memoContent
      }).then(res => {
        if (res.code === 666) {
          wx.showToast({
            title: '添加成功'
          });
          this.loadMemosByDate(selectedDate);
          this.closeMemoModal();
          // 更新本地存储
          const memos = wx.getStorageSync('memos') || [];
          memos.push(res.data);
          wx.setStorageSync('memos', memos);
        }
      }).catch(err => {
        console.error('添加备忘录失败:', err);
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        });
      });
    }
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // 删除备忘录
  deleteMemo(e) {
    const memoId = e.currentTarget.dataset.id;
    const { selectedDate } = this.data;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条备忘录吗？',
      success: (res) => {
        if (res.confirm) {
          memoRequest.deleteMemo(memoId).then(res => {
            if (res.code === 666) {
              wx.showToast({
                title: '删除成功'
              });
              this.loadMemosByDate(selectedDate);
              // 更新本地存储
              const memos = wx.getStorageSync('memos') || [];
              const filteredMemos = memos.filter(item => item.id !== memoId);
              wx.setStorageSync('memos', filteredMemos);
            }
          }).catch(err => {
            console.error('删除备忘录失败:', err);
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
