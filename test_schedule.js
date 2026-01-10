// 测试日程管理功能
console.log('测试日程管理功能...');

// 模拟添加日程
const testSchedule = {
  id: Date.now().toString(),
  title: '测试日程',
  date: '2024-01-01',
  time: '10:00',
  description: '这是一个测试日程'
};

// 保存到本地存储
wx.setStorageSync('schedules', [testSchedule]);
console.log('添加测试日程成功');

// 从本地存储读取
const schedules = wx.getStorageSync('schedules');
console.log('读取日程:', schedules);

// 测试编辑
if (schedules.length > 0) {
  const updatedSchedule = {
    ...schedules[0],
    title: '更新后的测试日程'
  };
  wx.setStorageSync('schedules', [updatedSchedule]);
  console.log('编辑测试日程成功');
}

// 测试删除
wx.setStorageSync('schedules', []);
console.log('删除所有日程成功');

console.log('测试完成');