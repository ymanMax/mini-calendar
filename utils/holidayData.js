// 节日数据 - 包含中国传统节日和国际节日
// 数据结构: { [dateKey]: { name: '节日名称', type: 'traditional|international|solarTerm' } }
// dateKey 格式: 'MM-DD' (每年重复) 或 'YYYY-MM-DD' (特定年份)

const holidayData = {
  // 中国传统节日 (农历转公历，这里按公历日期近似)
  '01-01': { name: '元旦', type: 'international' },
  '02-14': { name: '情人节', type: 'international' },
  '03-08': { name: '妇女节', type: 'international' },
  '03-12': { name: '植树节', type: 'international' },
  '04-01': { name: '愚人节', type: 'international' },
  '05-01': { name: '劳动节', type: 'international' },
  '05-04': { name: '青年节', type: 'international' },
  '06-01': { name: '儿童节', type: 'international' },
  '07-01': { name: '建党节', type: 'international' },
  '08-01': { name: '建军节', type: 'international' },
  '09-10': { name: '教师节', type: 'international' },
  '10-01': { name: '国庆节', type: 'international' },
  '11-11': { name: '双十一', type: 'international' },
  '12-25': { name: '圣诞节', type: 'international' },

  // 中国传统节日 (按公历日期近似)
  '01-22': { name: '春节', type: 'traditional' }, // 2023年春节
  '02-05': { name: '元宵节', type: 'traditional' },
  '04-05': { name: '清明节', type: 'traditional' },
  '05-20': { name: '端午节', type: 'traditional' },
  '08-29': { name: '中秋节', type: 'traditional' },
  '10-23': { name: '重阳节', type: 'traditional' },

  // 二十四节气
  '02-04': { name: '立春', type: 'solarTerm' },
  '02-19': { name: '雨水', type: 'solarTerm' },
  '03-06': { name: '惊蛰', type: 'solarTerm' },
  '03-21': { name: '春分', type: 'solarTerm' },
  '04-05': { name: '清明', type: 'solarTerm' },
  '04-20': { name: '谷雨', type: 'solarTerm' },
  '05-06': { name: '立夏', type: 'solarTerm' },
  '05-21': { name: '小满', type: 'solarTerm' },
  '06-06': { name: '芒种', type: 'solarTerm' },
  '06-21': { name: '夏至', type: 'solarTerm' },
  '07-07': { name: '小暑', type: 'solarTerm' },
  '07-23': { name: '大暑', type: 'solarTerm' },
  '08-08': { name: '立秋', type: 'solarTerm' },
  '08-23': { name: '处暑', type: 'solarTerm' },
  '09-08': { name: '白露', type: 'solarTerm' },
  '09-23': { name: '秋分', type: 'solarTerm' },
  '10-08': { name: '寒露', type: 'solarTerm' },
  '10-23': { name: '霜降', type: 'solarTerm' },
  '11-07': { name: '立冬', type: 'solarTerm' },
  '11-22': { name: '小雪', type: 'solarTerm' },
  '12-07': { name: '大雪', type: 'solarTerm' },
  '12-22': { name: '冬至', type: 'solarTerm' }
};

// 获取指定日期的节日信息
function getHolidayByDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // 先检查特定年份的节日
  const specificDateKey = `${year}-${month}-${day}`;
  if (holidayData[specificDateKey]) {
    return holidayData[specificDateKey];
  }

  // 再检查每年重复的节日
  const generalDateKey = `${month}-${day}`;
  if (holidayData[generalDateKey]) {
    return holidayData[generalDateKey];
  }

  return null;
}

module.exports = {
  holidayData,
  getHolidayByDate
};
