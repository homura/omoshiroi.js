import { SoundEffect } from './main';

export async function loadSoundEffect(src: string): Promise<SoundEffect> {
  return new Promise((resolve) => {
    const audio = new Audio(src);
    audio.load();

    audio.oncanplaythrough = () => {
      resolve({
        play(cb) {
          audio.currentTime = 0;
          audio.play();
          audio.onplaying = cb;
        },
      });
    };
  });
}

export async function loadFont(family: string, source: string): Promise<void> {
  const font = await new FontFace(family, source).load();
  document.fonts.add(font);
}
