class UI {
  constructor() {
    this.elements = {
      score: document.querySelector('#score'),
      sentence: document.querySelector('#sentence'),
      phrase: document.querySelector('#phrase'),
      options: document.querySelector('#options'),
      feedback: document.querySelector('#feedback'),
      nextButton: document.querySelector('#next'),
      questionArea: document.querySelector('#question-area'),
      completionArea: document.querySelector('#completion-area')
    };
    this.currentBlank = null;
  }

  updateScore(score) {
    this.elements.score.textContent = `得分：${score}`;
  }

  showPhrase(phrase) {
    // 创建并显示填空句子
    this.elements.sentence.innerHTML = '';
    const parts = phrase.sentence.split(/\{\{blank\}\}/);
    
    // 添加第一部分文本
    this.elements.sentence.appendChild(document.createTextNode(parts[0]));
    
    // 创建填空区域
    const blank = document.createElement('span');
    blank.className = 'word-blank';
    blank.dataset.answer = phrase.answer;
    this.currentBlank = blank;
    this.elements.sentence.appendChild(blank);
    
    // 添加剩余文本（如果有）
    if (parts[1]) {
      this.elements.sentence.appendChild(document.createTextNode(parts[1]));
    }

    // 重置选项
    this.elements.options.innerHTML = '';
    const shuffledOptions = [...phrase.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(option => {
      const optionElement = document.createElement('div');
      optionElement.textContent = option;
      optionElement.classList.add('option');
      optionElement.setAttribute('draggable', true);
      optionElement.style.visibility = 'visible'; // 确保新选项可见
      this.elements.options.appendChild(optionElement);
    });

    // 确保选项容器可见
    this.elements.options.style.display = 'flex';

    // 重置完整词组显示
    this.elements.phrase.classList.add('hidden');
    this.elements.phrase.classList.remove('show');
    this.elements.phrase.textContent = '';

    // 重置反馈
    this.elements.feedback.textContent = '';
    this.elements.feedback.className = 'feedback';
    this.elements.nextButton.disabled = true;
  }

  hideAllOptions() {
    // 直接隐藏整个选项容器
    this.elements.options.style.display = 'none';
  }

  showCorrectAnswer(word, fullPhrase) {
    if (this.currentBlank) {
      this.currentBlank.textContent = word;
      this.currentBlank.classList.add('filled');
    }

    this.elements.phrase.textContent = `完整词组：${fullPhrase}`;
    this.elements.phrase.classList.remove('hidden');
    setTimeout(() => {
      this.elements.phrase.classList.add('show');
    }, 50);

    this.hideAllOptions();
  }

  showFeedback(isCorrect) {
    this.elements.feedback.textContent = isCorrect ? '正确！' : '请再试一次！';
    this.elements.feedback.style.color = isCorrect ? '#27ae60' : '#e74c3c';
    this.elements.nextButton.disabled = !isCorrect;
  }

  showError(message) {
    this.elements.feedback.textContent = message;
    this.elements.feedback.style.color = '#e74c3c';
  }

  showCompletion({ totalQuestions, correctFirstTime, wrongPhrases, reviewLink }) {
    // 隐藏答题区域
    this.elements.questionArea.style.display = 'none';
    
    // 隐藏反馈和下一题按钮
    this.elements.feedback.style.display = 'none';
    this.elements.nextButton.style.display = 'none';
    
    // 创建完成页面内容
    const completionHTML = `
      <div class="completion-content">
        <h2>练习完成！</h2>
        <div class="stats">
          <p>总题数：${totalQuestions}</p>
          <p>首次答对：${correctFirstTime}</p>
          <p>正确率：${Math.round((correctFirstTime / totalQuestions) * 100)}%</p>
        </div>
        ${wrongPhrases.length > 0 ? `
          <div class="wrong-phrases">
            <h3>错题统计</h3>
            <button id="review-button" class="review-button">练习错题</button>
            <ul class="wrong-list">
              ${wrongPhrases.map(phrase => `
                <li>
                  <span class="full-phrase">${phrase.full}</span>
                  <span class="error-count">错误：${phrase.errorCount}次</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : '<p class="perfect-score">恭喜你全部答对！</p>'}
      </div>
    `;

    // 显示完成页面
    this.elements.completionArea.innerHTML = completionHTML;
    this.elements.completionArea.style.display = 'block';

    // 绑定错题练习按钮事件
    if (wrongPhrases.length > 0) {
      document.querySelector('#review-button').addEventListener('click', () => {
        window.location.href = reviewLink;
      });
    }
  }

  bindEvents(game) {
    this.elements.nextButton.addEventListener('click', () => game.nextPhrase());
  }
}