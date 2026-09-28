# My Dashboard — GitHub Pages 主页

零依赖、免构建的多文件个人主页，无需打包工具、无需 API 密钥，静态托管即可运行。

## 目录结构

```
├── index.html          # 页面结构骨架（引入下列 CSS / JS）
├── css/
│   ├── base.css        # 设计变量 / 深浅主题 / reset / 页头页脚
│   ├── components.css  # 布局网格 / 卡片 / 各功能组件样式
│   └── responsive.css  # 响应式媒体查询（必须最后引入以保持覆盖优先级）
└── js/                 # 传统 script 按依赖顺序加载（非 ES modules，兼容旧版 Safari）
    ├── storage.js      # 设置与日历标记持久化（localStorage）
    ├── lunar.js        # 农历算法（1900-2100）与节日表
    ├── shapes.js       # 日历标记的 SVG 形状图标
    ├── theme.js        # 深浅色主题
    ├── date.js         # 日期卡片
    ├── clock.js        # 时间卡片（翻转 / 上滑动画）
    ├── weather.js      # 天气卡片（Open-Meteo）
    ├── calendar.js     # 日历卡片（农历 / 标记弹层）
    ├── timer.js        # 倒计时（番茄钟）
    ├── settings.js     # 设置抽屉
    ├── scale.js        # 卡片内容动态缩放（ResizeObserver）
    └── main.js         # 初始化入口（必须最后加载）
```

模块间通过传统 script 的全局词法作用域共享变量与函数（文件头注释标明了各自的依赖与全局导出），新增/修改功能只需改动对应模块文件。

## 功能

| 卡片 | 功能 |
|------|------|
| 📅 日期 | 年月日 / 星期 / 农历（干支 + 生肖）/ 传统节日 |
| ⏰ 时间 | 时分秒实时时钟，支持 **卡片翻转** 或 **数字上滑** 两种动画 |
| 🗓 日历 | 农历日历，可设置以周日或周一开始；点击任意一天可添加 **颜色标记 + 文字标签** |
| ⏱ 倒计时 | 番茄钟，4 个预设（默认 5 / 10 / 20 / 30 分钟，可在设置中修改），环形进度条 + 结束提示音 |
| 🌤 天气 | Open-Meteo 免费接口（免密钥），自动定位，含体感 / 湿度 / 风速 / 三日预报 |

右上角 ⚙️ 设置面板可：切换深浅色（跟随系统 / 手动）、切换时间动画、设置周起始日、**添加或删除任意卡片**、修改倒计时预设。所有设置与日历标记保存在浏览器本地（localStorage）。

## 响应式（横竖屏自适应）

- **桌面 / iPad mini 横屏（≥1024px）**：三列布局，日历横跨两列
- **平板竖屏 / 中等宽度（720–1023px）**：双列布局，天气卡片通栏
- **手机竖屏（<720px）**：单列堆叠
- **横屏低高度（如 iPad / 手机横屏）**：自动进入紧凑模式——缩小时钟数字、圆环与卡片内边距，尽量一屏容纳
- 系统会根据 `orientation` 与视口宽度自动切换，无需手动设置

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库（如 `username.github.io`，或任意仓库）。
2. 把 `index.html`、`css/`、`js/` 上传/推送到仓库根目录：
   ```bash
   git init
   git add index.html css js
   git commit -m "init dashboard"
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```
3. 若仓库名为 `username.github.io` → 直接访问 `https://username.github.io`；
   若是其他仓库 → 打开仓库 **Settings → Pages**，Source 选 `main` 分支 `/ (root)`，保存后访问 `https://username.github.io/<仓库名>`。

## 数据说明

- 农历算法内置 1900–2100 年数据，完全本地计算，离线可用。
- 天气数据来自 [Open-Meteo](https://open-meteo.com)（免费、无需注册）；定位失败时回退为北京。
