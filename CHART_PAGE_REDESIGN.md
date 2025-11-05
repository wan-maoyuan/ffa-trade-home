# 单头寸策略展示页面 - 重新设计

## 更新时间
2025-11-05

## 更新背景

根据用户提供的设计稿，对策略页面的第二个轮播图（单头寸策略展示）进行了完全重新设计，以匹配目标样式。

## 设计对比

### 之前的设计
- ❌ 垂直布局，控制区域在顶部
- ❌ 图表容器较小
- ❌ 标题在顶部
- ❌ 简单的横向控制栏

### 新设计
- ✅ 左右分栏布局
- ✅ 左侧垂直控制面板
- ✅ 标题在右侧中间位置
- ✅ 大图表区域，占据主要空间
- ✅ 三点菜单和查询按钮
- ✅ 更专业的视觉效果

## 主要改进

### 1. 布局架构重构

#### 左侧控制面板
```
┌─────────────┐
│ 年份: 2025  │
│ [国内运费]  │
│ ─────────   │
│ 实际价格VS  │
│ 预测价格    │
└─────────────┘
```

#### 右侧主内容区
```
┌────────────────────────────────────┐
│ [查询]  单头寸策略展示    ⋮        │
│                                    │
│  ┌──────────────────────────────┐ │
│  │                              │ │
│  │     图表区域                 │ │
│  │                              │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

### 2. 组件结构

#### 新增组件元素

**左侧面板：**
- `chart-left-panel` - 左侧控制面板容器
- `chart-control-item` - 控制项容器
- `chart-control-select-new` - 年份选择器
- `chart-button-vertical` - 垂直按钮（国内运费）
- `chart-section-divider` - 分隔线
- `chart-section-label` - 区域标签

**右侧内容：**
- `chart-right-content` - 右侧内容容器
- `chart-header-row` - 头部行（标题、按钮、菜单）
- `chart-button-query` - 查询按钮
- `chart-page-title` - 页面标题
- `chart-menu-dots` - 三点菜单
- `chart-main-container` - 图表主容器
- `chart-wrapper` - 图表包装器
- `chart-plot-area` - 绘图区域
- `chart-y-axis-new` - Y轴标签
- `chart-x-axis-new` - X轴标签
- `chart-legend-new` - 图例

### 3. 样式特性

#### 左侧面板
```css
.chart-left-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px;
  min-width: 200px;
}
```

#### 图表容器
```css
.chart-main-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}
```

#### 三点菜单
```css
.chart-menu-dots {
  display: flex;
  gap: 4px;
  cursor: pointer;
}

.chart-menu-dots .dot {
  width: 4px;
  height: 4px;
  background: #949595;
  border-radius: 50%;
}
```

### 4. 响应式设计

#### 桌面端 (> 1200px)
- 左右分栏布局
- 左侧固定宽度，右侧自适应
- 大图表区域

#### 平板端 (768px - 1200px)
- 左侧面板改为横向排列
- 图表区域调整尺寸
- 保持核心功能

#### 移动端 (< 768px)
- 垂直堆叠布局
- 按钮改为全宽
- 图表自适应缩放

## 技术实现细节

### Flexbox 布局
```css
.single-position-chart-page-new {
  display: flex;
  gap: 24px;
}
```
- 使用 Flexbox 实现灵活的左右布局
- 右侧内容区自动填充剩余空间

### 绝对定位标题
```css
.chart-button-query {
  position: absolute;
  left: 0;
}

.chart-page-title {
  margin: 0 auto;
}

.chart-menu-dots {
  position: absolute;
  right: 0;
}
```
- 使用绝对定位实现左中右三元素布局
- 标题始终居中

### 毛玻璃效果
```css
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(10px);
```
- 半透明背景
- 背景模糊效果
- 现代化视觉体验

### 图表区域布局
```css
.chart-plot-area {
  position: relative;
  flex: 1;
  margin-left: 40px;
  margin-bottom: 30px;
}
```
- 为 Y 轴预留 40px 空间
- 为 X 轴预留 30px 空间
- 图表自适应填充

## 文件变更

### 修改的文件

1. **`src/components/strategy-pages/SinglePositionChart.tsx`**
   - 完全重构组件结构
   - 新的 JSX 布局
   - 左右分栏设计

2. **`src/components/strategy-pages/StrategyPage.css`**
   - 添加约 40 个新 CSS 类
   - 响应式媒体查询
   - 保留旧样式作为备份

### 新增的 CSS 类

| 类名 | 用途 |
|------|------|
| `.single-position-chart-page-new` | 新版主容器 |
| `.chart-left-panel` | 左侧控制面板 |
| `.chart-right-content` | 右侧内容区 |
| `.chart-header-row` | 头部行 |
| `.chart-button-query` | 查询按钮 |
| `.chart-page-title` | 页面标题 |
| `.chart-menu-dots` | 三点菜单 |
| `.chart-main-container` | 图表主容器 |
| `.chart-wrapper` | 图表包装器 |
| `.chart-plot-area` | 绘图区域 |
| `.chart-y-axis-new` | Y 轴（新） |
| `.chart-x-axis-new` | X 轴（新） |
| `.chart-legend-new` | 图例（新） |

## 视觉效果

### 颜色方案
- **主色**: #2e56a3（蓝色）
- **背景**: rgba(255, 255, 255, 0.85)（半透明白）
- **文字**: #212a37（深灰）
- **次要文字**: #949595（浅灰）

### 阴影效果
- **按钮**: `0 2px 8px rgba(46,86,163,0.25)`
- **容器**: `0 2px 16px rgba(0, 0, 0, 0.08)`

### 圆角
- **按钮**: 4px
- **容器**: 8px
- **选择器**: 4px

## 浏览器兼容性

- ✅ Chrome 76+
- ✅ Firefox 70+
- ✅ Safari 9+
- ✅ Edge 17+

**注意**: `backdrop-filter` 在某些旧版浏览器可能不支持，会优雅降级。

## 性能指标

- ✅ 构建成功
- ✅ 无 TypeScript 错误
- ✅ 无 ESLint 警告
- ✅ CSS 增加约 4KB
- ✅ 无性能损失

## 使用说明

### 查看效果

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问策略页面：
   - 导航至"产品与服务" → "策略"
   - 点击底部 "2" 号按钮切换到此页面

### 功能说明

- **年份选择**: 点击下拉框选择年份
- **国内运费**: 切换运费类型
- **查询按钮**: 执行查询操作
- **三点菜单**: 更多操作选项
- **图例**: 显示在图表右上角

## 后续优化建议

### 功能增强
1. **下拉菜单实现**: 年份选择器添加实际下拉功能
2. **三点菜单**: 实现菜单弹出层
3. **数据交互**: 连接后端 API
4. **图表工具**: 添加缩放、拖拽等功能

### 视觉优化
1. **动画**: 添加页面切换动画
2. **加载状态**: 数据加载时的占位符
3. **交互反馈**: 更丰富的悬停效果
4. **主题切换**: 支持深色模式

### 性能优化
1. **图片优化**: 使用 WebP 格式
2. **懒加载**: 图表按需加载
3. **代码分割**: 减小初始加载体积

## 测试清单

- [x] 布局正确显示
- [x] 响应式设计工作正常
- [x] 按钮可点击
- [x] 图表正确渲染
- [x] 无控制台错误
- [x] 构建成功
- [ ] 跨浏览器测试
- [ ] 移动设备测试
- [ ] 交互功能测试

## 回滚方案

如需回滚到旧版本：
1. 将 `single-position-chart-page-new` 改回 `single-position-chart-page`
2. 旧的 CSS 样式已保留在文件中
3. 或使用 Git 回退到之前的提交

## 相关文件

- 组件: `src/components/strategy-pages/SinglePositionChart.tsx`
- 样式: `src/components/strategy-pages/StrategyPage.css`
- 主面板: `src/components/StrategyPanel.tsx`

---

**设计师**: 根据用户提供的原型  
**开发人员**: AI Assistant  
**审核状态**: 待用户确认  
**版本**: 2.0.0

