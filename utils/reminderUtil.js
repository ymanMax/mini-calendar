// 节日提醒工具
// 提供节日提醒的设置、取消和通知功能

// 存储键名
const REMINDER_STORAGE_KEY = 'holiday_reminders';

// 默认提醒设置
const DEFAULT_REMINDER_SETTINGS = {
  enabled: true,        // 是否启用提醒
  advanceDays: 1,       // 提前几天提醒
  time: '09:00',        // 提醒时间
  types: {
    traditional: true,  // 中国传统节日
    international: true,// 国际节日
    solarTerm: false    // 二十四节气
  }
};

// 获取提醒设置
function getReminderSettings() {
  try {
    const settings = wx.getStorageSync(REMINDER_STORAGE_KEY);
    return settings ? JSON.parse(settings) : DEFAULT_REMINDER_SETTINGS;
  } catch (error) {
    console.error('获取提醒设置失败:', error);
    return DEFAULT_REMINDER_SETTINGS;
  }
}

// 保存提醒设置
function saveReminderSettings(settings) {
  try {
    wx.setStorageSync(REMINDER_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('保存提醒设置失败:', error);
    return false;
  }
}

// 启用提醒
function enableReminder() {
  const settings = getReminderSettings();
  settings.enabled = true;
  return saveReminderSettings(settings);
}

// 禁用提醒
function disableReminder() {
  const settings = getReminderSettings();
  settings.enabled = false;
  return saveReminderSettings(settings);
}

// 设置提前提醒天数
function setAdvanceDays(days) {
  const settings = getReminderSettings();
  settings.advanceDays = Math.max(0, Math.min(7, days)); // 限制在0-7天
  return saveReminderSettings(settings);
}

// 设置提醒时间
function setReminderTime(time) {
  const settings = getReminderSettings();
  settings.time = time;
  return saveReminderSettings(settings);
}

// 设置提醒类型
function setReminderType(type, enabled) {
  const settings = getReminderSettings();
  if (settings.types.hasOwnProperty(type)) {
    settings.types[type] = enabled;
    return saveReminderSettings(settings);
  }
  return false;
}

// 检查是否需要提醒
function checkReminders(date) {
  const settings = getReminderSettings();
  if (!settings.enabled) {
    return [];
  }

  // 计算提前提醒的日期
  const targetDate = new Date(date);
  targetDate.setDate(targetDate.getDate() + settings.advanceDays);

  return getRemindersForDate(targetDate, settings.types);
}

// 获取指定日期的提醒
function getRemindersForDate(date, types) {
  const { getHolidayByDate } = require('./holidayData');
  const holiday = getHolidayByDate(date);

  if (holiday && types[holiday.type]) {
    return [{
      date: date,
      holiday: holiday,
      message: `即将到来的${holiday.type === 'traditional' ? '中国传统节日' :
                      holiday.type === 'international' ? '国际节日' : '节气'}: ${holiday.name}`
    }];
  }

  return [];
}

// 显示提醒通知
function showReminderNotification(reminder) {
  // 使用微信小程序的showToast或showModal显示通知
  wx.showModal({
    title: '节日提醒',
    content: reminder.message,
    showCancel: false,
    confirmText: '知道了'
  });
}

// 检查并显示提醒
function checkAndShowReminders() {
  const today = new Date();
  const reminders = checkReminders(today);

  reminders.forEach(reminder => {
    showReminderNotification(reminder);
  });

  return reminders;
}

module.exports = {
  getReminderSettings,
  saveReminderSettings,
  enableReminder,
  disableReminder,
  setAdvanceDays,
  setReminderTime,
  setReminderType,
  checkReminders,
  getRemindersForDate,
  showReminderNotification,
  checkAndShowReminders
};
