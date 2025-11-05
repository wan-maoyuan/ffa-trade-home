# 策略页面实现说明

## 概述

根据 Figma 原型设计，完成了产品与服务的策略子页面的完整实现，包含四个轮播页面，严格按照设计稿的布局和样式。

## 实现的功能

### 1. 四个策略轮播页面

#### 第 1 页：单头寸策略评价
- 文件：`src/components/strategy-pages/SinglePositionEvaluation.tsx`
- 功能：展示做多策略的评价信息
- 包含内容：
  - 策略标签（做多胜率统计、盈亏比）
  - 策略卡片（做多建议）
  - 6 个指标卡片（日期、当前值、综合价差比等）

#### 第 2 页：单头寸策略展示
- 文件：`src/components/strategy-pages/SinglePositionChart.tsx`
- 功能：展示实际价格与预测价格的对比图表
- 包含内容：
  - 年份选择和查询控制
  - 实际价格 VS 预测价格图表
  - X 轴和 Y 轴标签
  - 图例说明

#### 第 3 页：双头寸策略评价
- 文件：`src/components/strategy-pages/DoublePositionEvaluation.tsx`
- 功能：展示基差缩小策略的评价信息
- 包含内容：
  - 策略标签（基差缩小胜率统计、盈亏比）
  - 策略卡片（C5TC 做空 + P4TC 做多）
  - 8 个指标卡片（日期、C5TC+1 当前值、P4TC+1 当前值、基差等）

#### 第 4 页：双头寸策略展示
- 文件：`src/components/strategy-pages/DoublePositionChart.tsx`
- 功能：展示三个对比图表
- 包含内容：
  - 三个并排的图表对比
  - 5TC_C+1MON 图表
  - 基差实际值图表
  - 基差比例图表

### 2. 轮播功能

- 使用 Swiper 库实现页面轮播
- 底部有 4 个圆形指示器，可以点击切换页面
- 支持左右滑动切换
- 当前页面的指示器高亮显示（蓝色）

### 3. 样式实现

所有样式严格按照 Figma 设计稿实现：
- 颜色：主色调 #2e56a3（蓝色）
- 字体：DengXian、Microsoft YaHei、Source Han Sans CN
- 布局：精确还原 Figma 设计的位置和尺寸
- 阴影和圆角：完全匹配设计稿
- 响应式设计：支持不同屏幕尺寸

## 图片资源

### 使用的 Figma MCP 图片资源（7 天有效期）

以下图片资源直接从 Figma 获取，有效期为 7 天。如需长期使用，建议下载到本地 `src/assets/images/` 目录：

1. **策略卡片背景图**
   - URL: `https://www.figma.com/api/mcp/asset/8bf65e56-a1ee-4003-9f5e-49183c04a4b3`
   - 用途：单头寸和双头寸策略卡片的背景

2. **图表线条图片**
   - 单头寸图表线 1: `https://www.figma.com/api/mcp/asset/ceb63b63-29b6-4c36-be41-49e94ea1b3f8`
   - 单头寸图表线 2: `https://www.figma.com/api/mcp/asset/cf69431c-3c93-4b61-8b70-e4697715b861`
   - 双头寸图表 1: `https://www.figma.com/api/mcp/asset/4e649ae9-c471-486e-85c2-8f172f1f4e8f`
   - 双头寸图表 2: `https://www.figma.com/api/mcp/asset/4ee4dcfa-51ca-44eb-9059-054b8174e5ca`
   - 双头寸图表 3: `https://www.figma.com/api/mcp/asset/5cd3e836-1c1d-4a61-96b5-7b0df7c114c8`

### 如何下载图片资源到本地

如果需要永久使用这些图片资源，可以按以下步骤操作：

1. 在浏览器中打开图片 URL
2. 保存图片到 `src/assets/images/` 目录
3. 更新组件中的导入语句，例如：
   ```typescript
   import cardBg from '../assets/images/strategy-card-bg.jpg'
   ```

## 文件结构

```
src/components/
├── StrategyPanel.tsx              # 策略面板主组件（包含轮播容器）
├── StrategyPanel.css              # 策略面板样式
└── strategy-pages/                # 策略子页面目录
    ├── SinglePositionEvaluation.tsx   # 第1页：单头寸策略评价
    ├── SinglePositionChart.tsx        # 第2页：单头寸策略展示
    ├── DoublePositionEvaluation.tsx   # 第3页：双头寸策略评价
    ├── DoublePositionChart.tsx        # 第4页：双头寸策略展示
    └── StrategyPage.css               # 策略子页面通用样式
```

## 访问方式

在应用中访问策略页面：
1. 点击导航栏的"产品与服务"
2. 点击"策略"卡片
3. 或者直接访问 URL：`/product-service/strategy`

## 轮播控制

- **手动切换**：点击底部的圆形按钮（1、2、3、4）
- **滑动切换**：在页面上左右滑动
- **自动高亮**：当前页面的按钮会显示为蓝色（#2e56a3）

## 技术栈

- **React 18** + **TypeScript**
- **Swiper 11.0.5**：实现轮播功能
- **CSS**：自定义样式（非 Tailwind）
- **Vite**：构建工具

## 开发和测试

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 设计原则

1. **严格还原设计稿**：所有布局、颜色、字体、尺寸都按照 Figma 设计稿实现
2. **组件化开发**：每个轮播页面都是独立的组件，易于维护
3. **响应式设计**：支持不同屏幕尺寸的自适应
4. **性能优化**：使用 React 组件优化，避免不必要的重新渲染
5. **代码规范**：遵循项目的 ESLint 规则和 TypeScript 类型检查

## 后续优化建议

1. **图片资源本地化**：将 Figma MCP 的临时图片资源下载到本地
2. **图表库集成**：使用 ECharts 或 Chart.js 等图表库替代静态图片，实现动态数据展示
3. **数据接口对接**：将硬编码的数据替换为 API 接口数据
4. **动画效果**：添加页面切换动画和元素动画效果
5. **加载状态**：添加数据加载和错误处理
6. **单元测试**：为组件添加单元测试

## 注意事项

- Figma MCP 图片资源有效期为 7 天，建议尽快下载到本地
- 所有组件都使用了 TypeScript，确保类型安全
- 样式文件使用了 CSS 而非 Tailwind，保持项目风格一致
- 轮播功能需要 Swiper 库支持，已在 package.json 中配置

## 问题排查

如果遇到问题，请检查：
1. 是否正确安装了所有依赖（`npm install`）
2. 图片资源是否能正常加载
3. 浏览器控制台是否有错误信息
4. 路由配置是否正确

## 联系方式

如有任何问题或建议，请联系开发团队。

