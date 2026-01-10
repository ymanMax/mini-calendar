Component({
  data: {
    schedules: [],
    showModal: false,
    editingSchedule: null,
    formData: {
      title: '',
      date: '',
      time: '',
      description: ''
    }
  },

  attached() {
    // 页面加载时从本地存储获取日程数据
    this.loadSchedules();
  },

  methods: {
    // 从本地存储加载日程
    loadSchedules() {
      try {
        const schedules = wx.getStorageSync('schedules') || [];
        this.setData({
          schedules: schedules
        });
      } catch (error) {
        console.error('加载日程失败:', error);
      }
    },

    // 保存日程到本地存储
    saveSchedules() {
      try {
        wx.setStorageSync('schedules', this.data.schedules);
      } catch (error) {
        console.error('保存日程失败:', error);
      }
    },

    // 显示添加日程弹窗
    showAddModal() {
      this.setData({
        showModal: true,
        editingSchedule: null,
        formData: {
          title: '',
          date: '',
          time: '',
          description: ''
        }
      });
    },

    // 隐藏弹窗
    hideModal() {
      this.setData({
        showModal: false
      });
    },

    // 阻止事件冒泡
    stopPropagation() {
      // 空函数，用于阻止事件冒泡
    },

    // 输入框变化事件
    onInputChange(e) {
      const { name } = e.currentTarget.dataset;
      const { value } = e.detail;
      this.setData({
        [`formData.${name}`]: value
      });
    },

    // 日期选择事件
    onDateChange(e) {
      this.setData({
        'formData.date': e.detail.value
      });
    },

    // 时间选择事件
    onTimeChange(e) {
      this.setData({
        'formData.time': e.detail.value
      });
    },

    // 编辑日程
    editSchedule(e) {
      const { id } = e.currentTarget.dataset;
      const schedule = this.data.schedules.find(item => item.id === id);
      if (schedule) {
        this.setData({
          showModal: true,
          editingSchedule: schedule,
          formData: {
            title: schedule.title,
            date: schedule.date,
            time: schedule.time,
            description: schedule.description
          }
        });
      }
    },

    // 删除日程
    deleteSchedule(e) {
      const { id } = e.currentTarget.dataset;
      const schedules = this.data.schedules.filter(item => item.id !== id);
      this.setData({
        schedules: schedules
      });
      this.saveSchedules();
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
    },

    // 保存日程
    saveSchedule() {
      const { formData, editingSchedule, schedules } = this.data;

      // 表单校验
      if (!formData.title.trim()) {
        wx.showToast({
          title: '请输入日程标题',
          icon: 'none'
        });
        return;
      }

      if (!formData.date) {
        wx.showToast({
          title: '请选择日期',
          icon: 'none'
        });
        return;
      }

      if (!formData.time) {
        wx.showToast({
          title: '请选择时间',
          icon: 'none'
        });
        return;
      }

      if (editingSchedule) {
        // 编辑现有日程
        const updatedSchedules = schedules.map(item => {
          if (item.id === editingSchedule.id) {
            return {
              ...item,
              title: formData.title,
              date: formData.date,
              time: formData.time,
              description: formData.description
            };
          }
          return item;
        });
        this.setData({
          schedules: updatedSchedules
        });
        wx.showToast({
          title: '编辑成功',
          icon: 'success'
        });
      } else {
        // 添加新日程
        const newSchedule = {
          id: Date.now().toString(),
          title: formData.title,
          date: formData.date,
          time: formData.time,
          description: formData.description
        };
        this.setData({
          schedules: [...schedules, newSchedule]
        });
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
      }

      // 保存到本地存储
      this.saveSchedules();
      // 隐藏弹窗
      this.hideModal();
    }
  }
});