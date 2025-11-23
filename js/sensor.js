// 센서 데이터 관리 클래스 (정적 분석 결과 반영)
class SensorManager {
  constructor() {
    this.currentData = this.getStaticSensorData();
    this.history = this.getStaticSensorHistory();
    this.mode = 'working'; // 모드는 유지
    this.isRunning = false;
    this.interval = null;
  }

  // 정적 센서 데이터 반환 (분석 결과에 기반)
  getStaticSensorData() {
    // 피로도 분석 결과 (예시)
    const fatigueScore = 65; // Yellow (보통) 레벨에 해당하는 점수
    const fatigueLevel = 'Yellow';
    const fatigueRecommendations = [
      '규칙적인 휴식과 스트레칭으로 눈의 피로를 관리하세요.',
      '충분한 수면 시간을 확보하는 것이 중요합니다.',
    ];
    const fatigueFactors = [
      { name: 'sleepTime', description: '수면 시간 부족', impact: 'increase', value: 6 },
      { name: 'luminance', description: '주변 조도 적정', impact: 'neutral', value: 700 },
      { name: 'blinkRate', description: '눈 깜빡임 부족', impact: 'increase', value: 10 },
      { name: 'dryEye', description: '안구 건조 없음', impact: 'decrease', value: 0 },
    ];

    // 녹내장 분석 결과 (예시)
    const glaucomaProbability = 0.45; // MEDIUM 레벨에 해당하는 확률
    const glaucomaLevel = 'MEDIUM';
    const glaucomaRecommendations = [
      '정기적인 안과 검진을 통해 눈 건강을 관리하세요.',
      '안압에 주의가 필요합니다. 스트레스를 줄이고 충분한 휴식을 취하세요.',
    ];
    const glaucomaFactors = [
      { name: 'intraocularPressure', description: '안압 높음', impact: 'increase', value: 20, coefficient: 2.39 },
      { name: 'visionLoss', description: '시력 손실 없음', impact: 'decrease', value: 0, coefficient: 1.81 },
      { name: 'age', description: '나이 (45세)', impact: 'increase', value: 45, coefficient: 0.83 },
      { name: 'familyHistory', description: '가족력 없음', impact: 'decrease', value: 0, coefficient: 0.93 }, // 임시 양수
      { name: 'steroid', description: '스테로이드 사용 없음', impact: 'decrease', value: 0, coefficient: 0.29 }, // 임시 양수
      { name: 'presbyopia', description: '노안 없음', impact: 'decrease', value: 0, coefficient: 0.07 },
      { name: 'temperature', description: '주변 온도 적정', impact: 'neutral', value: 25, coefficient: 0.01 },
    ];

    return {
      timestamp: Date.now(),
      eyePressure: 20, // 녹내장 분석의 예시 안압
      blinkRate: 10, // 피로도 분석의 예시 깜빡임
      brightness: 700, // 피로도 분석의 예시 조도
      fatigueScore: fatigueScore, // 피로도 분석 결과 점수
      microMotion: 0.8, // 임시 값
      sleepTime: 6, // 피로도 분석의 예시 수면 시간
      dryEye: 0, // 피로도 분석의 예시 안구 건조

      // 분석 결과 객체 추가
      fatigueAnalysis: {
        score: fatigueScore,
        level: fatigueLevel,
        factors: fatigueFactors,
        recommendations: fatigueRecommendations,
      },
      glaucomaAnalysis: {
        probability: glaucomaProbability,
        level: glaucomaLevel,
        factors: glaucomaFactors,
        recommendations: glaucomaRecommendations,
      },
    };
  }

  // 정적 센서 히스토리 반환 (차트용 더미 데이터)
  getStaticSensorHistory() {
    const history = [];
    const now = Date.now();
    for (let i = 60; i >= 0; i--) {
      const timestamp = now - i * 30 * 1000;
      history.push({
        timestamp: timestamp,
        eyePressure: 17 + Math.sin(i / 10) * 2, // 시뮬레이션된 안압 변화
        blinkRate: 15 + Math.cos(i / 5) * 3, // 시뮬레이션된 깜빡임 변화
        brightness: 700 + Math.sin(i / 7) * 100, // 시뮬레이션된 조도 변화
        fatigueScore: 70 + Math.sin(i / 8) * 15, // 시뮬레이션된 피로도 변화
        microMotion: 0.8 + Math.random() * 0.2, // 시뮬레이션된 미세 움직임
      });
    }
    return history;
  }

  // 동적 시뮬레이션 로직 제거
  start() {
    console.log('SensorManager: Static data mode. No real-time simulation.');
    // 초기 데이터 로드 후 이벤트 발생
    window.dispatchEvent(new CustomEvent('sensorUpdate', {
      detail: this.currentData
    }));
  }

  stop() {
    console.log('SensorManager: Simulation stopped.');
  }

  setMode(mode) {
    this.mode = mode;
    console.log(`SensorManager: Mode set to ${mode}`);
  }

  getHistory() {
    return this.history;
  }

  getCurrent() {
    return this.currentData;
  }

  // calculateRisk 함수 제거 (분석 결과 객체에 포함됨)
}

// 전역 센서 매니저 인스턴스
const sensorManager = new SensorManager();