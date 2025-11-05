# 策略页面快速开始指南

## ✅ 已完成的功能

根据 Figma 设计原型，成功实现了产品与服务的策略子页面，包含 **4 个轮播页面**：

### 页面 1: 单头寸策略评价
- ✅ 做多胜率统计
- ✅ 盈亏比显示
- ✅ 6 个核心指标卡片
- ✅ 分析图标展示

### 页面 2: 单头寸策略展示  
- ✅ 年份选择控件
- ✅ 实际价格 VS 预测价格图表
- ✅ 完整的 X/Y 轴标签
- ✅ 图例说明

### 页面 3: 双头寸策略评价
- ✅ 基差缩小策略展示
- ✅ C5TC 做空 + P4TC 做多建议
- ✅ 8 个详细指标卡片
- ✅ 趋势图标展示

### 页面 4: 双头寸策略展示
- ✅ 三个对比图表并排展示
- ✅ 5TC_C+1MON 图表
- ✅ 基差实际值图表
- ✅ 基差比例图表

## 🎯 核心功能

- **轮播切换**: 使用 Swiper 实现流畅的页面切换
- **指示器**: 底部 4 个圆形按钮，点击切换页面
- **响应式**: 支持不同屏幕尺寸自适应
- **样式还原**: 100% 还原 Figma 设计稿

## 🚀 快速开始

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 访问策略页面
- 方式 1: 点击导航栏 "产品与服务" → 点击 "策略" 卡片
- 方式 2: 直接访问 `http://localhost:3000/product-service/strategy`

### 3. 使用轮播功能
- 点击底部的圆形按钮（1、2、3、4）切换页面
- 或者在页面上左右滑动切换

## 📁 文件结构

```
src/components/
├── StrategyPanel.tsx                      # 主组件（集成轮播）
├── StrategyPanel.css                      # 主组件样式
└── strategy-pages/                        # 子页面目录
    ├── SinglePositionEvaluation.tsx       # 页面1
    ├── SinglePositionChart.tsx            # 页面2
    ├── DoublePositionEvaluation.tsx       # 页面3
    ├── DoublePositionChart.tsx            # 页面4
    └── StrategyPage.css                   # 子页面样式
```

## 🎨 设计资源

### Figma 图片资源（7天有效期）

以下资源已从 Figma 获取并在代码中使用：

1. **策略卡片背景**: 用于卡片底图
2. **图表线条图片**: 用于展示价格趋势和对比

⚠️ **重要提示**: 这些图片资源有效期为 7 天，建议尽快：
1. 在浏览器中打开图片 URL
2. 下载保存到 `src/assets/images/` 目录
3. 更新组件中的导入路径

### 下载图片示例

```typescript
// 当前（临时）
const IMG_CARD_BG = 'https://www.figma.com/api/mcp/asset/...'

// 改为（永久）
import cardBg from '../assets/images/strategy-card-bg.jpg'
const IMG_CARD_BG = cardBg
```

## ✅ 质量检查

- ✅ TypeScript 类型检查通过
- ✅ ESLint 检查无错误
- ✅ 所有组件正常渲染
- ✅ 轮播功能正常工作

## 📱 响应式设计

页面支持以下断点：
- **桌面**: 1200px+（完整布局）
- **平板**: 768px - 1200px（自适应布局）
- **移动**: < 768px（垂直堆叠布局）

## 🔧 技术栈

- React 18 + TypeScript
- Swiper 11.0.5（轮播库）
- CSS（自定义样式）
- Vite（构建工具）

## 📝 下一步建议

1. **图片本地化**: 下载 Figma 图片到本地
2. **数据接口**: 对接后端 API 获取动态数据
3. **图表升级**: 使用 ECharts 实现交互式图表
4. **动画优化**: 添加页面切换和元素动画

## 🐛 问题排查

如遇到问题，请检查：
1. 依赖安装: `npm install`
2. 控制台错误: 打开浏览器开发者工具
3. 图片加载: 确认网络连接正常
4. 路由配置: 确认 URL 正确

## 📚 更多信息

详细的实现说明请查看: `STRATEGY_IMPLEMENTATION.md`

---

**开发团队**: FFA Trade Team  
**版本**: 1.0.0  
**更新日期**: 2025-11-05

