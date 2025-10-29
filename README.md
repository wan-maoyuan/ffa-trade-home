# AQUABRIDGE - 一站式衍生品综合服务商

这是一个基于React和TypeScript构建的现代化金融平台首页，完全按照Figma设计原型实现的AQUABRIDGE品牌页面。

## 项目特性

- 🎨 **品牌化设计** - 基于Figma原型设计，完美还原AQUABRIDGE品牌视觉
- 📱 **响应式布局** - 完美适配桌面端和移动端设备
- ⚡ **高性能** - 使用Vite构建工具，快速开发和构建
- 🔧 **TypeScript支持** - 完整的类型安全支持
- 🎯 **模块化架构** - 组件化开发，易于维护和扩展

## 页面结构

### 1. 导航栏 (Navbar)
- AQUABRIDGE品牌Logo
- 导航菜单：首页、产品与服务、投资者关系、关于我们
- 用户操作区域：语言切换、搜索、用户头像
- 毛玻璃效果和现代化设计

### 2. 主页面 (Hero)
- 全屏背景图片
- 品牌标题：AQUABRIDGE
- 品牌标语：一站式衍生品综合服务商
- 渐变遮罩和装饰元素

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式方案**: CSS Modules
- **包管理**: npm

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── Carousel.tsx     # 轮播图组件
│   ├── SignalModule.tsx # 信号模块组件
│   ├── StrategyModule.tsx # 策略模块组件
│   └── *.css           # 组件样式文件
├── styles/             # 全局样式
│   ├── index.css       # 基础样式
│   └── App.css         # 应用样式
├── types/              # TypeScript类型定义
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 设计规范

### 颜色系统
- 主色调: #007bff (蓝色)
- 成功色: #28a745 (绿色)
- 警告色: #ffc107 (黄色)
- 危险色: #dc3545 (红色)
- 中性色: #6c757d (灰色)

### 间距系统
- 基础间距: 8px
- 组件内边距: 1rem (16px)
- 模块间距: 2rem (32px)
- 页面边距: 2rem (32px)

### 圆角系统
- 小圆角: 4px
- 中圆角: 8px
- 大圆角: 12px
- 完全圆角: 50%

## 开发规范

### 组件开发
- 使用函数式组件
- 优先使用TypeScript
- 保持组件单一职责
- 使用CSS Modules管理样式

### 代码质量
- 遵循ESLint规则
- 使用Prettier格式化代码
- 编写清晰的注释
- 保持代码简洁

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com
