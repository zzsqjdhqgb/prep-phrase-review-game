class Game {
  constructor(ui) {
    this.score = 0;
    this.currentIndex = 0;
    this.phrases = [];
    this.ui = ui;
  }

  async init() {
    await this.loadPhrases();
    this.ui.updateScore(this.score);
    this.ui.showPhrase(this.phrases[this.currentIndex]);
    this.ui.bindEvents(this);
  }

  async loadPhrases() {
    try {
      const response = await fetch('phrases.json');
      this.phrases = await response.json();
    } catch (error) {
      console.error('Failed to load phrases:', error);
    }
  }

  nextPhrase() {
    this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
    this.ui.showPhrase(this.phrases[this.currentIndex]);
    this.ui.elements.nextButton.disabled = true;
  }

  checkAnswer(answer) {
    const currentPhrase = this.phrases[this.currentIndex];
    if (answer === currentPhrase.answer) {
      this.score++;
      this.ui.updateScore(this.score);
      this.ui.showFeedback(true);
      this.ui.showCorrectAnswer(currentPhrase.answer, currentPhrase.full);
      return true;
    } else {
      this.ui.showFeedback(false);
      return false;
    }
  }
}