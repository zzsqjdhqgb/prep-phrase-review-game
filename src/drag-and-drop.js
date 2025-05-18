class DragAndDrop {
  constructor(ui, game) {
    this.ui = ui;
    this.game = game;
    this.currentDragged = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.initialPosition = null;
    this.bindDragEvents();
    this.bindTouchEvents();
  }

  bindDragEvents() {
    const optionsContainer = this.ui.elements.options;
    const questionArea = this.ui.elements.questionArea;

    optionsContainer.addEventListener('dragstart', (event) => this.handleDragStart(event));
    questionArea.addEventListener('dragover', (event) => this.handleDragOver(event));
    questionArea.addEventListener('dragleave', (event) => this.handleDragLeave(event));
    questionArea.addEventListener('drop', (event) => this.handleDrop(event));
    document.addEventListener('dragend', (event) => this.handleDragEnd(event));
  }

  bindTouchEvents() {
    const optionsContainer = this.ui.elements.options;
    
    optionsContainer.addEventListener('touchstart', (event) => this.handleTouchStart(event), { passive: false });
    document.addEventListener('touchmove', (event) => this.handleTouchMove(event), { passive: false });
    document.addEventListener('touchend', (event) => this.handleTouchEnd(event));
    document.addEventListener('touchcancel', (event) => this.resetDraggedElement(false));
  }

  handleDragStart(event) {
    if (event.target.classList.contains('option')) {
      this.currentDragged = event.target;
      event.target.classList.add('dragging');
      event.dataTransfer.setData('text/plain', event.target.textContent);
      event.dataTransfer.effectAllowed = 'move';
      
      // 添加过渡效果
      this.currentDragged.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    }
  }

  handleDragOver(event) {
    event.preventDefault();
    const questionArea = this.ui.elements.questionArea;
    const rect = questionArea.getBoundingClientRect();
    const { clientX, clientY } = event;

    // 检查是否在题目区域内
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      questionArea.classList.add('drop-active');
      event.dataTransfer.dropEffect = 'move';
    } else {
      questionArea.classList.remove('drop-active');
      event.dataTransfer.dropEffect = 'none';
    }
  }

  handleDragLeave(event) {
    const questionArea = this.ui.elements.questionArea;
    const rect = questionArea.getBoundingClientRect();
    const { clientX, clientY } = event;

    // 确保真的离开了区域（不是进入子元素）
    if (
      clientX <= rect.left ||
      clientX >= rect.right ||
      clientY <= rect.top ||
      clientY >= rect.bottom
    ) {
      questionArea.classList.remove('drop-active');
      if (this.currentDragged) {
        // 重置拖动元素的样式
        this.currentDragged.style.transform = '';
        this.currentDragged.style.opacity = '';
      }
    }
  }

  handleDrop(event) {
    event.preventDefault();
    const questionArea = this.ui.elements.questionArea;
    questionArea.classList.remove('drop-active');

    if (this.currentDragged) {
      const word = this.currentDragged.textContent;
      const isCorrect = this.game.checkAnswer(word);
      
      if (isCorrect) {
        this.currentDragged.style.visibility = 'hidden';
      }

      this.currentDragged.classList.remove('dragging');
      this.currentDragged = null;
    }
  }

  handleDragEnd(event) {
    if (this.currentDragged) {
      // 移除所有拖动相关的样式
      this.currentDragged.classList.remove('dragging');
      this.currentDragged.style.transform = '';
      this.currentDragged.style.opacity = '';
      this.currentDragged.style.transition = '';
      this.currentDragged = null;
    }
    // 确保移除判定区域的样式
    this.ui.elements.questionArea.classList.remove('drop-active');
  }

  handleTouchStart(event) {
    const touch = event.touches[0];
    const target = event.target;
    
    if (target.classList.contains('option')) {
      event.preventDefault();
      this.currentDragged = target;
      
      // 保存初始位置
      const rect = target.getBoundingClientRect();
      this.initialPosition = {
        left: rect.left,
        top: rect.top
      };
      
      this.touchStartX = touch.clientX - rect.left;
      this.touchStartY = touch.clientY - rect.top;
      
      requestAnimationFrame(() => {
        target.style.position = 'fixed';
        target.style.zIndex = '1000';
        target.style.width = rect.width + 'px';
        target.classList.add('dragging');
      });
    }
  }

  handleTouchMove(event) {
    if (this.currentDragged) {
      event.preventDefault();
      const touch = event.touches[0];
      const questionArea = this.ui.elements.questionArea;
      const rect = questionArea.getBoundingClientRect();
      
      requestAnimationFrame(() => {
        this.currentDragged.style.left = (touch.clientX - this.touchStartX) + 'px';
        this.currentDragged.style.top = (touch.clientY - this.touchStartY) + 'px';
        
        // 检查是否在题目区域内
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          questionArea.classList.add('drop-active');
        } else {
          questionArea.classList.remove('drop-active');
        }
      });
    }
  }

  handleTouchEnd(event) {
    if (this.currentDragged) {
      const touch = event.changedTouches[0];
      const questionArea = this.ui.elements.questionArea;
      const rect = questionArea.getBoundingClientRect();
      
      questionArea.classList.remove('drop-active');
      
      // 检查是否在题目区域内放下
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        const word = this.currentDragged.textContent;
        const isCorrect = this.game.checkAnswer(word);
        
        if (isCorrect) {
          this.resetDraggedElement(true);
        } else {
          this.resetDraggedElement(false);
        }
      } else {
        this.resetDraggedElement(false);
      }
    }
  }

  resetDraggedElement(isCorrect) {
    if (!this.currentDragged) return;
    
    if (isCorrect) {
      this.currentDragged.style.visibility = 'hidden';
    } else {
      // 如果答错或未放置到正确位置，返回原位置
      this.currentDragged.style.position = '';
      this.currentDragged.style.zIndex = '';
      this.currentDragged.style.width = '';
      
      if (this.initialPosition) {
        const currentRect = this.currentDragged.getBoundingClientRect();
        const dx = this.initialPosition.left - currentRect.left;
        const dy = this.initialPosition.top - currentRect.top;
        
        requestAnimationFrame(() => {
          this.currentDragged.style.transform = '';
          this.currentDragged.style.left = '';
          this.currentDragged.style.top = '';
        });
      }
    }
    
    this.currentDragged.classList.remove('dragging');
    this.currentDragged = null;
    this.initialPosition = null;
  }
}