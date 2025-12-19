# mini-calendar
功能完善的微信小程序日历组件，支持标点标记、展开收缩、日期禁用等功能，使用简单灵活。

## 项目截图

![示例图](cnblogsImg.gif)

## 功能特性

- **标点标记**：支持在特定日期添加标点标记，有两种颜色可选（青色和橙色）
- **展开收缩**：支持日历的展开和收缩功能，可自定义默认状态
- **日期禁用**：支持通过函数自定义禁用某些日期
- **快速回到今天**：支持一键快速回到今天的日期
- **自定义周起始日**：支持设置一周的起始日（1-7，默认为7即周日）
- **响应式交互**：支持选中日期、切换月份等交互操作

## 技术栈

- **开发框架**：微信小程序原生框架
- **组件化开发**：使用微信小程序自定义组件开发模式
- **数据处理**：使用JavaScript进行数据处理和格式转换
- **UI设计**：使用微信小程序原生组件和自定义样式进行UI设计

## 项目结构

```
mini-calendar/
├── api/                # API请求相关文件
│   ├── index.js        # API请求入口文件
│   └── mockData.js     # 模拟数据文件
├── component/           # 自定义组件文件夹
│   └── calendar/        # 日历组件文件夹
│       ├── calendar.js  # 日历组件逻辑文件
│       ├── calendar.json # 日历组件配置文件
│       ├── calendar.wxml # 日历组件结构文件
│       ├── calendar.wxs # 日历组件工具函数文件
│       └── calendar.wxss # 日历组件样式文件
├── index/               # 组件演示页面文件夹
│   ├── index.js        # 演示页面逻辑文件
│   ├── index.json      # 演示页面配置文件
│   ├── index.wxml      # 演示页面结构文件
│   └── index.wxss      # 演示页面样式文件
├── app.js              # 小程序入口文件
├── app.json            # 小程序配置文件
├── app.wxss            # 小程序全局样式文件
├── project.config.json  # 小程序项目配置文件
├── project.private.config.json  # 小程序私有配置文件
├── sitemap.json        # 小程序站点地图文件
├── LICENSE             # 项目许可证文件
├── .gitignore          # Git忽略文件
├── .eslintrc.js        # ESLint配置文件
└── README.md           # 项目说明文档
```

## 使用方法

### 1. 安装组件

将 `/component/calendar` 文件夹复制到你的微信小程序项目中。

### 2. 引入组件

在需要使用日历组件的页面配置文件（如 `page.json`）中引入组件：

```json
{
  "usingComponents": {
    "calendar": "../component/calendar/calendar"
  }
}
```

### 3. 使用组件

在页面结构文件（如 `page.wxml`）中使用日历组件：

```xml
<calendar 
  spotMap="{{spotMap}}" 
  defaultTime="{{defaultTime}}" 
  title="{{title}}" 
  goNow="{{goNow}}" 
  defaultOpen="{{defaultOpen}}" 
  showShrink="{{showShrink}}" 
  disabledDate="{{disabledDate}}" 
  changeTime="{{changeTime}}" 
  firstDayOfWeek="{{firstDayOfWeek}}" 
  bind:getDateList="onGetDateList" 
  bind:selectDay="onSelectDay" 
  bind:openChange="onOpenChange" 
/>
```

### 4. 配置组件

在页面逻辑文件（如 `page.js`）中配置组件的属性和事件处理函数：

```javascript
Page({
  data: {
    spotMap: {}, // 标点的日期对象
    defaultTime: '', // 标记的日期，默认为今日
    title: '', // 日历的标题
    goNow: true, // 是否有快速回到今天的功能
    defaultOpen: false, // 是否是打开状态
    showShrink: true, // 是否显示收缩展开功能
    disabledDate: null, // 要禁用的日期函数
    changeTime: '', // 要改变的日期
    firstDayOfWeek: 7, // 周起始日（1-7，默认为7即周日）
  },
  
  // 渲染某个月份时触发
  onGetDateList(e) {
    console.log('渲染月份:', e.detail);
  },
  
  // 选中日期时触发
  onSelectDay(e) {
    console.log('选中日期:', e.detail);
  },
  
  // 日历展开收缩时触发
  onOpenChange(e) {
    console.log('日历状态:', e.detail);
  },
});
```

## 组件属性

| 属性名         | 说明                                                                                                                         | 类型                                                   | 默认值   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- |
| spotMap        | 标点的日期对象，属性名为具体日期如：y2000m10d10，属性值为'spot'或'deep-spot'，颜色分别为青色和橙色                           | Object                                                 | {}       |
| defaultTime    | 标记的日期，默认为今日，传入格式推荐为'2022/1/2'或'2022/01/02'，否则在 ios 上可能会出现识别错误的情况                        | String                                                 | ''       |
| title          | 日历的标题，默认无                                                                                                           | String                                                 | ''       |
| goNow          | 是否有快速回到今天的功能                                                                                                     | Boolean                                                | true     |
| defaultOpen    | 是否是打开状态                                                                                                               | Boolean                                                | false    |
| showShrink     | 是否显示收缩展开功能                                                                                                             | Boolean                                                | true     |
| disabledDate   | 要禁用的日期函数，日历在渲染时会主动调用该方法参数为{ day, month, year }对象，当方法返回 true 时会禁用该日期。使用方法见示例 | ({ day: number, month: number, year: number }) => void | ()=>void |
| changeTime     | 要改变的日期，改变即生效。用于 Data 构造函数的第一个参数 传入格式推荐为'2022/1/2'或'2022/01/02'                              | String                                                 | ''       |
| firstDayOfWeek | 周起始日                                                                                                                     | Number 1 ~ 7                                           | 7        |

## 组件事件

| 事件名           | 说明                                                                                                                | 参数值                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| bind:getDateList | 渲染某个月份， setMonth：渲染的月，setYear：渲染的年 。注意：不能代指现在的月份，在加载时会获取当前月以及上下两月的 | {setMonth: number,setYear: number}          |
| bind:selectDay   | 选中日期的年月日                                                                                                    | { day: number, month: number, year: number} |
| bind:openChange  | 日历切换的状态，true 打开; false 关闭 展开收缩时触发的事件                                                          | { open: boolean }                           |

## 联系作者

> 微信：gg6630gg
