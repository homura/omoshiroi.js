import anime, { AnimeTimelineInstance } from 'animejs';
import { defaultsDeep } from 'lodash';
import { AdvancedBloomFilter } from 'pixi-filters';
import { DeepPartial } from '../type-utils';

const PIXI = require('pixi.js');

interface Playable {
  play(): void;
}

interface Config {
  stage: {
    height: number;
    width: number;
  };
  text: {
    content: string;
    fontSize: number;
    fontFamily: string | string[];
  };
  /**
   * rgb color
   */
  fill: number;

  bgm: SoundEffect;
}

export type Options = DeepPartial<Config>;

export interface SoundEffect {
  play(onStart: () => void): void;
}

function getDummySoundEffect() {
  return { play: (cb) => cb() };
}

export class SekiroDangerousPallet {
  private app: PIXI.Application;
  private config: Config;
  private track: AnimeTimelineInstance;

  private bgm: SoundEffect;

  constructor(options?: Options) {
    this.config = {
      fill: 0xff4444,
      stage: { height: 320, width: 320 },
      text: { content: '危', fontSize: 160, fontFamily: 'arial' },
      bgm: getDummySoundEffect(),
    };

    this.setOptions(options);
  }

  private drawText(fontSize: number): PIXI.Text {
    const textConfig = this.config.text;
    const text = new PIXI.Text(
      textConfig.content,
      new PIXI.TextStyle({
        fill: this.config.fill,
        fontSize,
        fontFamily: textConfig.fontFamily,
      }),
    );

    text.anchor.set(0.5);
    const { width, height } = this.config.stage;
    text.x = width / 2;
    text.y = height / 2;

    return text;
  }

  private drawBackground(width: number, height: number): PIXI.DisplayObject {
    const rect = new PIXI.Graphics();
    rect.beginFill(this.config.fill);
    rect.drawRect(0, 0, width, height);
    rect.endFill();

    return rect;
  }

  // TODO
  private drawParticles(): PIXI.Container {
    // const particleCount = 1500;
    //
    // const sprites: Sprite[] = Array.from({ length: particleCount }).map(() => {
    //   const source = `assets/smoke0`;
    //   const sprite = Sprite.from(Texture.from(source));
    //   sprite.scale.set(3);
    //   sprite.anchor.set(0.5);
    //
    //   sprite.tint = 0x000000;
    //   return sprite;
    // });

    // anime({
    //   duration,
    //   // targets: sprites,
    //   easing: 'linear',
    //   angle: [() => Math.random() * 360, () => Math.random() * 360],
    //   delay: () => Math.random() * duration,
    //   // alpha: () => Math.random() * 0.25 + 0.75,
    //   x: [
    //     (_, i, n) => anime.random((width / n) * i - 140, (width / n) * i + 140),
    //     (_, i, n) => anime.random((width / n) * i - 140, (width / n) * i + 140),
    //   ],
    //   y: [() => anime.random(height, height + 20), () => anime.random(0, -40)],
    //   autoplay: false,
    // });

    return new PIXI.Sprite(PIXI.Texture.WHITE);
  }

  private drawFilledText(fontSize: number, width: number, height: number) {
    const container = new PIXI.Container();
    const text = this.drawText(fontSize);
    const bg = this.drawBackground(width, height);

    container.mask = text;
    container.addChild(bg, text);

    return [container, text];
  }

  private makeTrack(): void {
    const fontSize = this.config.text.fontSize;
    const { width, height } = this.config.stage;

    const [mainContainer, mainText] = this.drawFilledText(
      fontSize,
      width,
      height,
    );
    const filter = new AdvancedBloomFilter({
      quality: 20,
      threshold: 0.1,
    });
    mainContainer.filters = [filter];
    mainContainer.mask = mainText;

    const [shadowContainer, shadowText] = this.drawFilledText(
      fontSize,
      width,
      height,
    );

    this.app.stage.removeChildren();
    this.app.stage.addChild(mainContainer, shadowContainer);

    this.track = anime
      .timeline({ duration: 800, autoplay: false })
      .add(
        {
          targets: mainText,
          duration: 550,
          width: [mainText.width * 0.75, mainText.width],
          height: [mainText.height * 0.75, mainText.height],
          easing: 'linear',
        },
        0,
      )
      .add(
        {
          targets: mainText,
          alpha: 0,
          delay: 250,
          easing: 'linear',
        },
        0,
      )
      .add(
        {
          targets: shadowText,
          duration: 550,
          width: [shadowText.width * 0.75, shadowText.width * 2],
          height: [shadowText.height * 0.75, shadowText.height * 2],
          alpha: [0.25, 0],
          easing: 'linear',
        },
        0,
      );
  }

  play(): void {
    this.bgm.play(() => {
      this.track.restart();
    });
  }

  getView(): HTMLCanvasElement {
    return this.app.view;
  }

  setOptions(options: Options): void {
    this.config = defaultsDeep(options, this.config);
    const stage = this.config.stage;
    this.app = new PIXI.Application({
      width: stage.width,
      height: stage.height,
      transparent: true,
    });
    this.bgm = this.config.bgm;
    this.makeTrack();
  }
}
