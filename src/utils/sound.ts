class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.sounds = {
      move: new Audio('/maze/sounds/move.mp3'),
      hit: new Audio('/maze/sounds/hit.mp3'),
      win: new Audio('/maze/sounds/win.mp3'),
    };

    // 预加载所有音效
    Object.values(this.sounds).forEach(audio => {
      audio.load();
      audio.volume = 0.3;  // 设置适中的音量
    });
  }

  play(soundName: 'move' | 'hit' | 'win') {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;  // 重置音频播放位置
      sound.play().catch(e => console.log('Sound play failed:', e));
    }
  }
}

export const soundManager = new SoundManager();
