class DragAndDrop {
  constructor(ui, game) {
    this.ui = ui;
    this.game = game;
    this.draggedElement = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.bindEvents();
  }

  bindEvents() {
    const optionsContainer = this.ui.elements.options;
    
    // 禁用默认的拖放，统一使用pointer事件
    optionsContainer.addEventListener('dragstart', e => e.preventDefault());
    
    // 绑定指针事件
    optionsContainer.addEventListener('pointerdown', e => this.handlePointerDown(e));
    document.addEventListener('pointermove', e => this.handlePointerMove(e));
    document.addEventListener('pointerup', e => this.handlePointerUp(e));
    document.addEventListener('pointercancel', e => this.handlePointerUp(e));
  }

  handlePointerDown(event) {
    if (!event.target.classList.contains('option')) {
      return;
    }

    // 设置指针捕获以确保接收所有后续事件
    event.target.setPointerCapture(event.pointerId);
    
    this.draggedElement = event.target;
    const rect = this.draggedElement.getBoundingClientRect();
    
    // 计算点击位置相对于元素左上角的偏移
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;
    
    // 设置拖动状态
    this.draggedElement.style.position = 'fixed';
    this.draggedElement.style.zIndex = '1000';
    this.draggedElement.classList.add('dragging');
    
    // 直接设置初始位置
    this.draggedElement.style.left = (event.clientX - this.offsetX) + 'px';
    this.draggedElement.style.top = (event.clientY - this.offsetY) + 'px';
  }

  handlePointerMove(event) {
    if (!this.draggedElement) {
      return;
    }

    // 更新位置
    this.draggedElement.style.left = (event.clientX - this.offsetX) + 'px';
    this.draggedElement.style.top = (event.clientY - this.offsetY) + 'px';

    // 检查是否在答题区域内
    const questionArea = this.ui.elements.questionArea;
    const rect = questionArea.getBoundingClientRect();
    
    if (this.isInRect(event.clientX, event.clientY, rect)) {
      questionArea.classList.add('drop-active');
    } else {
      questionArea.classList.remove('drop-active');
    }
  }

  handlePointerUp(event) {
    if (!this.draggedElement) {
      return;
    }

    const questionArea = this.ui.elements.questionArea;
    const rect = questionArea.getBoundingClientRect();
    
    // 检查是否在答题区域内放下
    if (this.isInRect(event.clientX, event.clientY, rect)) {
      const word = this.draggedElement.textContent;
      const isCorrect = this.game.checkAnswer(word);
      
      if (isCorrect) {
        this.draggedElement.style.visibility = 'hidden';
      }
    }
    
    // 清理状态
    this.draggedElement.style.position = '';
    this.draggedElement.style.zIndex = '';
    this.draggedElement.style.left = '';
    this.draggedElement.style.top = '';
    this.draggedElement.classList.remove('dragging');
    questionArea.classList.remove('drop-active');
    
    this.draggedElement = null;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  isInRect(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }
}