// 센서 데이터 관리 클래스
class SensorManager {
  constructor() {
    this.currentData = null;
    this.history = [];
    this.mode = 'working';
    this.isRunning = false;
    this.interval = null;

    this.initialize();
  }

  initialize() {
    // 초기 히스토리 데이터 생성 (30분, 30초 간격)
    const now = Date.now();
    for (let i = 60; i >= 0; i--) {
      const timestamp = now - i * 30 * 1000;
      const data = this.generateData(this.history[this.history.length - 1]);
      data.timestamp = timestamp;
      this.history.push(data);
    }

    this.currentData = this.history[this.history.length - 1];
  }

  generateData(prevData) {
    const base = prevData || {
      eyePressure: 17,
      blinkRate: 15,
      brightness: 700,
      fatigueScore: 75,
      microMotion: 0.8
    };

    const modeMultiplier = this.mode === 'driving' ? 1.2 : 1.0;

    return {
      timestamp: Date.now(),
      eyePressure: Math.max(12, Math.min(25,
        base.eyePressure + (Math.random() - 0.5) * 0.5
      )).toFixed(1),
      blinkRate: Math.round(Math.max(10, Math.min(20,
        base.blinkRate + (Math.random() - 0.5) * 2
      ))),
      brightness: Math.round(Math.max(200, Math.min(1200,
        base.brightness + (Math.random() - 0.5) * 50
      ))),
      fatigueScore: Math.round(Math.max(0, Math.min(100,
        base.fatigueScore + (Math.random() - 0.3) * 2 * modeMultiplier
      )))),
      microMotion: Math.max(0, Math.min(2,
        0.8 + (Math.random() - 0.5) * 0.3
      )).toFixed(1)
    };
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.interval = setInterval(() => {
      const newData = this.generateData(this.currentData);
      this.currentData = newData;
      this.history.push(newData);

      // 최근 60개만 유지
      if (this.history.length > 60) {
        this.history = this.history.slice(-60);
      }

      // 이벤트 발생
      window.dispatchEvent(new CustomEvent('sensorUpdate', {
        detail: this.currentData
      }));
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isRunning = false;
    }
  }

  setMode(mode) {
    this.mode = mode;
  }

  getHistory() {
    return this.history;
  }

  getCurrent() {
    return this.currentData;
  }

  calculateRisk() {
    if (!this.currentData) return { level: 'low', score: 0, factors: [] };

    const { eyePressure, blinkRate, brightness, fatigueScore } = this.currentData;

    let score = 0;
    let factors = [];

    // 피로도 (40%)
    if (fatigueScore >= 80) {
      factors.push({ type: 'fatigue', severity: 'critical', percentage: 60 });
      score += fatigueScore * 0.4;
    } else if (fatigueScore >= 60) {
      factors.push({ type: 'fatigue', severity: 'warning', percentage: 25 });
      score += fatigueScore * 0.4;
    } else {
      score += fatigueScore * 0.4;
    }

    // 안압 (25%)
    if (eyePressure > 21 || eyePressure < 10) {
      factors.push({ type: 'pressure', severity: 'critical', percentage: 15 });
      score += 80 * 0.25;
    } else if (eyePressure > 18 || eyePressure < 12) {
      factors.push({ type: 'pressure', severity: 'warning', percentage: 0 });
      score += 60 * 0.25;
    } else {
      score += 30 * 0.25;
    }

    // 깜빡임 (20%)
    if (blinkRate < 12) {
      factors.push({ type: 'blinking', severity: 'warning', percentage: 0 });
      score += 70 * 0.2;
    } else if (blinkRate > 18) {
      score += 40 * 0.2;
    } else {
      score += 20 * 0.2;
    }

    // 조도 (15%)
    if (brightness > 1000) {
      factors.push({ type: 'brightness', severity: 'warning', percentage: 0 });
      score += 65 * 0.15;
    } else if (brightness < 300) {
      score += 55 * 0.15;
    } else {
      score += 25 * 0.15;
    }

    score = Math.round(score);

    let level = 'low';
    if (score >= 70) level = 'high';
    else if (score >= 50) level = 'medium';

    return { level, score, factors };
  }
}

// 전역 센서 매니저 인스턴스
const sensorManager = new SensorManager();
