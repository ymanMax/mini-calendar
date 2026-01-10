// component/schedule/schedule.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentDate: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
    showList: false,
    isEdit: false,
    formData: {
      title: '',
      date: '',
      time: '',
      content: ''
    },
    schedules: [],
    editingId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开添加日程弹窗
    openAddModal() {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const timeStr = today.toTimeString().split(' ')[0].substring(0, 5);
      
      this.setData({
        showModal: true,
        isEdit: false,
        formData: {
          title: '',
          date: dateStr,
          time: timeStr,
          content: ''
        },
        editingId: ''
      });
    },

    // 打开编辑日程弹窗
    openEditModal(e) {
      const schedule = e.currentTarget.dataset.schedule;
      this.setData({
        showModal: true,
        isEdit: true,
        formData: {
          title: schedule.title,
          date: schedule.date,
          time: schedule.time,
          content: schedule.content
        },
        editingId: schedule.id
      });
    },

    // 打开日程列表
    openList() {
      this.loadSchedules();
      this.setData({
        showList: true
      });
    },

    // 关闭弹窗
    closeModal() {
      this.setData({
        showModal: false
      });
    },

    // 关闭列表
    closeList() {
      this.setData({
        showList: false
      });
    },

    // 阻止冒泡
    stopPropagation() {
      // 空函数，用于阻止事件冒泡
    },

    // 输入框变化
    onInputChange(e) {
      const name = e.currentTarget.dataset.name;
      const value = e.detail.value;
      this.setData({
        [`formData.${name}`]: value
      });
    },

    // 日期选择器变化
    onDateChange(e) {
      this.setData({
        'formData.date': e.detail.value
      });
    },

    // 时间选择器变化
    onTimeChange(e) {
      this.setData({
        'formData.time': e.detail.value
      });
    },

    // 表单提交
    submitForm(e) {
      const { title, date, time, content } = this.data.formData;
      
      // 表单校验
      if (!title.trim()) {
        wx.showToast({
          title: '请输入日程标题',
          icon: 'none'
        });
        return;
      }

      if (this.data.isEdit) {
        this.updateSchedule();
      } else {
        this.addSchedule();
      }
    },

    // 加载日程列表
    loadSchedules() {
      const schedules = wx.getStorageSync('schedules') || [];
      
      // 如果有当前日期筛选条件，则只显示该日期的日程
      let filteredSchedules = schedules;
      if (this.data.currentDate) {
        filteredSchedules = schedules.filter(item => item.date === this.data.currentDate);
      }
      
      // 按时间排序
      filteredSchedules.sort((a, b) => {
        const timeA = a.time.replace(':', '');
        const timeB = b.time.replace(':', '');
        return timeA - timeB;
      });
      
      this.setData({
        schedules: filteredSchedules
      });
    },

    // 添加日程
    addSchedule() {
      const { title, date, time, content } = this.data.formData;
      const schedules = wx.getStorageSync('schedules') || [];
      
      const newSchedule = {
        id: Date.now().toString(),
        title: title.trim(),
        date: date,
        time: time,
        content: content.trim(),
        createTime: new Date().toISOString()
      };
      
      schedules.push(newSchedule);
      wx.setStorageSync('schedules', schedules);
      
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
      
      this.closeModal();
      this.loadSchedules();
      this.triggerEvent('scheduleChange', { schedules });
    },

    // 更新日程
    updateSchedule() {
      const { title, date, time, content } = this.data.formData;
      const schedules = wx.getStorageSync('schedules') || [];
      
      const index = schedules.findIndex(item => item.id === this.data.editingId);
      if (index !== -1) {
        schedules[index] = {
          ...schedules[index],
          title: title.trim(),
          date: date,
          time: time,
          content: content.trim(),
          updateTime: new Date().toISOString()
        };
        
        wx.setStorageSync('schedules', schedules);
        
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
        
        this.closeModal();
        this.loadSchedules();
        this.triggerEvent('scheduleChange', { schedules });
      }
    },

    // 删除日程
    deleteSchedule(e) {
      let scheduleId;
      if (e.currentTarget && e.currentTarget.dataset) {
        scheduleId = e.currentTarget.dataset.id;
      } else {
        scheduleId = this.data.editingId;
      }
      
      wx.showModal({
        title: '确认删除',
        content: '确定要删除这个日程吗？',
        success: (res) => {
          if (res.confirm) {
            const schedules = wx.getStorageSync('schedules') || [];
            const filteredSchedules = schedules.filter(item => item.id !== scheduleId);
            
            wx.setStorageSync('schedules', filteredSchedules);
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            
            this.closeModal();
            this.loadSchedules();
            this.triggerEvent('scheduleChange', { schedules: filteredSchedules });
          }
        }
      });
    },

    // 打开指定日期的日程
    openDateSchedule(date) {
      this.setData({
        currentDate: date
      });
      this.openList();
    }
  },

  /**
   * 生命周期函数--监听属性变化
   */
  observers: {
    'currentDate': function(newDate) {
      if (newDate && this.data.showList) {
        this.loadSchedules();
      }
    }
  }
});