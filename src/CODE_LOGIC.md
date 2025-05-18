# 面向对象的代码逻辑设计

## 总体设计
游戏代码采用面向对象的设计模式，将功能划分为多个类，每个类负责特定的功能模块。通过类的封装和方法的划分，代码结构清晰，易于维护和扩展。

---

## 类的设计

### 1. **Game 类**
负责游戏的整体逻辑和状态管理。

#### 属性
- `score`：当前得分。
- `currentIndex`：当前题目索引。
- `phrases`：题库数据。
- `ui`：UI 类的实例，用于操作界面。

#### 方法
- `constructor()`：初始化游戏状态。
- `init()`：加载题库并初始化游戏。
- `loadPhrases()`：从 JSON 文件加载题库数据。
- `nextPhrase()`：加载下一题。
- `checkAnswer(answer)`：检查用户答案是否正确。

---

### 2. **UI 类**
负责界面的更新和事件绑定。

#### 属性
- `elements`：存储页面中需要操作的 DOM 元素（如句子区域、选项区域、反馈区域等）。

#### 方法
- `constructor()`：初始化 DOM 元素。
- `updateScore(score)`：更新得分显示。
- `showPhrase(phrase)`：显示当前题目。
- `showFeedback(isCorrect)`：显示答题反馈。
- `bindEvents()`：绑定拖放和触摸事件。

---

### 3. **DragAndDrop 类**
负责处理拖放和触摸交互。

#### 属性
- `currentDragged`：当前被拖动的单词。

#### 方法
- `constructor()`：初始化拖放事件。
- `handleDragStart(event)`：处理拖动开始事件。
- `handleDragOver(event)`：处理拖动经过事件。
- `handleDrop(event)`：处理单词放置事件。
- `handleTouchStart(event)`：处理触摸开始事件。
- `handleTouchMove(event)`：处理触摸移动事件。
- `handleTouchEnd(event)`：处理触摸结束事件。

---

## CSS 样式结构
游戏的样式设计采用响应式布局，支持桌面和移动设备。

### 1. **布局样式**
- `#game-container`：游戏主容器
  - 最大宽度：800px
  - 居中显示
  - 统一字体：Arial

### 2. **游戏元素样式**
- `#score`：得分显示
  - 大字体显示（24px）
  - 底部间距

- `#sentence`：句子显示区域
  - 中等字体（20px）
  - 边框样式
  - 最小高度确保视觉稳定

- `#options`：选项区域
  - Flex 布局
  - 居中对齐
  - 选项间距

- `.option`：单个选项
  - 内边距和边框
  - 鼠标手型光标
  - 悬停效果

### 3. **反馈和控制**
- `#feedback`：反馈信息
  - 固定最小高度
  - 中等字体（18px）

- `#next`：下一题按钮
  - 绿色背景
  - 白色文字
  - 悬停效果

### 4. **响应式设计**
- 移动设备适配
  - 更大的点击区域
  - 更大的字体
  - 优化的按钮尺寸

---

## 代码逻辑流程

1. **初始化游戏**
   - 创建 `Game` 类的实例。
   - 调用 `init()` 方法加载题库并初始化界面。

2. **加载题目**
   - `Game` 类调用 `loadPhrases()` 方法从 JSON 文件加载题库。
   - 调用 `UI` 类的 `showPhrase()` 方法显示当前题目。

3. **拖放交互**
   - `DragAndDrop` 类绑定拖放和触摸事件。
   - 用户拖动或触摸单词，将其放置到空白处。

4. **检查答案**
   - `Game` 类调用 `checkAnswer()` 方法检查答案是否正确。
   - 调用 `UI` 类的 `showFeedback()` 方法显示反馈。
   - 如果正确，更新得分并加载下一题。

5. **下一题**
   - 用户点击“下一题”按钮，`Game` 类调用 `nextPhrase()` 方法加载下一题。

---

## 文件结构
```
prep-phrase-review-game/
│
├── index.html       # 游戏主页面
├── phrases.json     # 动态加载的题库文件
├── README.md        # 项目说明文档
├── LICENSE          # 许可证
├── src/             # 源代码文件夹
│   ├── CODE_LOGIC.md    # 代码逻辑文档
│   ├── game.js          # 游戏逻辑代码
│   ├── ui.js            # 界面操作代码
│   ├── drag-and-drop.js # 拖放交互代码
│   └── styles.css       # 样式文件
```

---

## 未来扩展
- **多语言支持**：通过加载不同语言的 JSON 文件实现。
- **计时功能**：在 `Game` 类中添加计时器逻辑。
- **用户数据保存**：将用户得分和进度存储到本地存储或服务器。

---

通过以上设计，代码逻辑清晰，模块职责明确，便于后续功能扩展和维护。

# 介词词组复习游戏 - 技术实现文档

## 架构设计

### 1. 系统架构
项目采用经典的 MVC 设计模式变体：
- **Model (Game类)**：管理数据和业务逻辑
- **View (UI类)**：负责界面渲染和用户交互
- **Controller (DragAndDrop类)**：处理拖放交互逻辑

### 2. 数据流
```
┌────────────┐    加载题库     ┌──────────┐
│ phrases.json├──────────────→ │  Game类   │
└────────────┘               └──────┬─────┘
                                   │
                                   │ 数据传递
                                   ▼
┌────────────┐    渲染控制    ┌──────────┐
│   UI类     │ ←────────────→ │用户界面   │
└─────┬──────┘               └──────────┘
      │
      │ 事件处理
      ▼
┌────────────┐
│DragAndDrop类│
└────────────┘
```

## 核心类实现

### 1. Game 类
```javascript
class Game {
  // 属性定义
  private score: number;          // 当前得分
  private currentIndex: number;   // 当前题目索引
  private phrases: Array<Phrase>; // 题库数据
  private ui: UI;                // UI实例引用

  // 核心方法
  async init(): Promise<void> {
    - 初始化游戏状态
    - 加载题库数据
    - 显示第一题
  }

  async loadPhrases(): Promise<void> {
    - 异步加载题库JSON
    - 解析并存储题目数据
  }

  checkAnswer(answer: string): boolean {
    - 验证用户答案
    - 更新得分
    - 触发UI更新
  }

  nextPhrase(): void {
    - 切换到下一题
    - 重置界面状态
  }
}
```

### 2. UI 类
```javascript
class UI {
  // 元素引用
  private elements: {
    score: HTMLElement;
    sentence: HTMLElement;
    phrase: HTMLElement;
    options: HTMLElement;
    feedback: HTMLElement;
    nextButton: HTMLElement;
  }

  // 状态追踪
  private currentBlank: HTMLElement | null;

  // 核心方法
  showPhrase(phrase: Phrase): void {
    - 解析句子模板
    - 创建填空区域
    - 渲染选项按钮
  }

  showCorrectAnswer(word: string, fullPhrase: string): void {
    - 填充正确答案
    - 显示完整词组
    - 添加动画效果
  }

  showFeedback(isCorrect: boolean): void {
    - 显示反馈信息
    - 更新按钮状态
  }
}
```

### 3. DragAndDrop 类
```javascript
class DragAndDrop {
  // 状态追踪
  private currentDragged: HTMLElement | null;
  private touchStartX: number;
  private touchStartY: number;

  // 事件处理
  bindDragEvents(): void {
    - 绑定拖放事件监听器
    - 处理拖动开始/结束
  }

  bindTouchEvents(): void {
    - 绑定触摸事件监听器
    - 处理触摸交互
  }

  handleDrop(event: DragEvent): void {
    - 处理答案验证
    - 更新UI状态
  }
}
```

## 数据结构

### 1. 题库数据格式
```typescript
interface Phrase {
  sentence: string;    // 包含{{blank}}占位符的句子
  answer: string;      // 正确答案
  options: string[];   // 可选答案列表
  full: string;        // 完整词组
}
```

### 2. 状态管理
```typescript
interface GameState {
  score: number;           // 当前得分
  currentIndex: number;    // 当前题目索引
  isAnswerCorrect: boolean;// 答案是否正确
  isGameComplete: boolean; // 是否完成所有题目
}
```

## 交互流程

### 1. 初始化流程
1. 加载页面结构
2. 实例化核心类
3. 加载题库数据
4. 渲染初始界面

### 2. 答题流程
1. 用户拖动选项
2. 系统检测放置位置
3. 验证答案正确性
4. 更新界面状态
5. 显示反馈信息

### 3. 题目切换流程
1. 用户点击下一题
2. 重置界面状态
3. 加载新题目
4. 刷新选项显示

## 样式系统

### 1. 布局结构
- 采用 Flexbox 布局
- 响应式设计
- 移动端优先

### 2. 交互样式
```css
// 关键样式类
.word-blank {
  - 填空区域样式
  - 状态过渡动画
}

.option {
  - 选项按钮样式
  - 拖放状态样式
}

// 动画效果
@keyframes fillIn {
  - 答案填充动画
  - 渐变过渡效果
}
```

### 3. 响应式设计
```css
// 移动端适配
@media (hover: none) {
  - 更大的触摸区域
  - 优化的按钮尺寸
  - 适配的字体大小
}
```

## 性能优化

### 1. 代码优化
- 使用事件委托
- 避免频繁DOM操作
- 优化动画性能

### 2. 资源优化
- 异步加载题库
- 延迟加载非关键资源
- 缓存机制利用

## 扩展性设计

### 1. 题库扩展
- 支持动态加载
- 多语言题库
- 难度分级

### 2. 功能扩展
- 统计分析
- 学习进度
- 错题本

## 测试策略

### 1. 单元测试
- 核心类方法测试
- 数据处理测试
- 状态管理测试

### 2. 集成测试
- 类间交互测试
- 事件流程测试
- 异常处理测试

### 3. 兼容性测试
- 多浏览器测试
- 移动设备测试
- 触摸屏测试