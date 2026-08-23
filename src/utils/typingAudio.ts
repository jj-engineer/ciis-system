// Web Audio API Synthesizer - Sound completely disabled/silenced per system preferences
export type TypingSoundMode = 'off';

class TypingAudioEngine {
  public setSoundMode(_mode: TypingSoundMode) {
    // Sound disabled
  }

  public getSoundMode(): TypingSoundMode {
    return 'off';
  }

  public setVolume(_vol: number) {
    // Sound disabled
  }

  public playKeystroke(_isSpace: boolean = false, _isBackspace: boolean = false) {
    // Sound disabled
  }

  public playError() {
    // Error buzz/sound completely removed
  }
}

export const typingAudio = new TypingAudioEngine();
