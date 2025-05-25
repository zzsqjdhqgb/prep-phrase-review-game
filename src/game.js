class URLParamsManager {
  static getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      db: urlParams.get('db'),
      rawdb: urlParams.get('rawdb')
    };
  }

  static async loadPhrases() {
    const { db, rawdb } = this.getParams();
    
    if (rawdb) {
      try {
        // 解码时先用 atob 解码 base64，再用 decodeURIComponent 解码 Unicode
        const jsonString = decodeURIComponent(atob(rawdb));
        const data = JSON.parse(jsonString);
        if (!Array.isArray(data) || !this.validatePhraseData(data)) {
          throw new Error('Invalid phrase data format');
        }
        return data;
      } catch (error) {
        console.error('Failed to decode base64 data:', error);
        return null;
      }
    }

    if (db) {
      try {
        const response = await fetch(db);
        const data = await response.json();
        if (!Array.isArray(data) || !this.validatePhraseData(data)) {
          throw new Error('Invalid phrase data format');
        }
        return data;
      } catch (error) {
        console.error('Failed to load custom phrases file:', error);
        return null;
      }
    }

    // 默认加载 data/example.json
    try {
      const response = await fetch('data/example.json');
      const data = await response.json();
      if (!Array.isArray(data) || !this.validatePhraseData(data)) {
        throw new Error('Invalid phrase data format');
      }
      return data;
    } catch (error) {
      console.error('Failed to load default phrases:', error);
      return null;
    }
  }

  static validatePhraseData(data) {
    return data.every(phrase => 
      typeof phrase === 'object' &&
      typeof phrase.full === 'string' &&
      typeof phrase.sentence === 'string' &&
      typeof phrase.answer === 'string' &&
      Array.isArray(phrase.options)
    );
  }
}

class Game {
  constructor(ui) {
    this.score = 0;
    this.currentIndex = 0;
    this.phrases = [];
    this.ui = ui;
    this.isCompleted = false;
  }

  async init() {
    const phrases = await URLParamsManager.loadPhrases();
    if (!phrases) {
      this.ui.showError('题库加载失败，请检查数据格式或网络连接');
      return;
    }
    
    // 初始化题目状态
    this.phrases = phrases.map(phrase => ({
      ...phrase,
      errorCount: 0,
      attempted: false,
      scored: false
    }));

    this.ui.updateScore(this.score);
    this.ui.showPhrase(this.phrases[this.currentIndex]);
    this.ui.bindEvents(this);
  }

  checkAnswer(answer) {
    const currentPhrase = this.phrases[this.currentIndex];
    const isCorrect = answer === currentPhrase.answer;
    
    // 标记题目已尝试
    currentPhrase.attempted = true;
    
    if (!isCorrect) {
      // 增加错误计数
      currentPhrase.errorCount = (currentPhrase.errorCount || 0) + 1;
    } else if (!currentPhrase.scored && currentPhrase.errorCount === 0) {
      // 只有在第一次答对且之前没有答错时才得分
      this.score++;
      currentPhrase.scored = true;
      this.ui.updateScore(this.score);
    }

    this.ui.showFeedback(isCorrect);
    
    if (isCorrect) {
      this.ui.showCorrectAnswer(currentPhrase.answer, currentPhrase.full);
      this.checkCompletion();
    }

    return isCorrect;
  }

  checkCompletion() {
    const allAttempted = this.phrases.every(phrase => phrase.attempted);
    if (allAttempted && !this.isCompleted) {
      this.isCompleted = true;
      this.showCompletionScreen();
    }
  }

  showCompletionScreen() {
    // 按错误次数排序的错题列表
    const wrongPhrases = this.phrases
      .filter(phrase => phrase.errorCount > 0)
      .sort((a, b) => b.errorCount - a.errorCount);

    // 生成错题练习链接
    const reviewPhrases = wrongPhrases.map(({ full, sentence, answer, options }) => ({
      full, sentence, answer, options
    }));
    
    // 使用 encodeURIComponent 处理 Unicode 字符
    const base64Data = btoa(encodeURIComponent(JSON.stringify(reviewPhrases)));
    const reviewLink = `${window.location.pathname}?rawdb=${base64Data}`;

    this.ui.showCompletion({
      totalQuestions: this.phrases.length,
      correctFirstTime: this.score,
      wrongPhrases,
      reviewLink
    });
  }

  nextPhrase() {
    if (this.currentIndex < this.phrases.length - 1 && !this.isCompleted) {
      this.currentIndex++;
      this.ui.showPhrase(this.phrases[this.currentIndex]);
      this.ui.elements.nextButton.disabled = true;
    }
  }
}