import {
  loadFont,
  loadSoundEffect,
  SekiroDangerousPallet,
} from '../src/sekiro';

const fontFamily = 'HOT-GFGyosho Std E';

Promise.all([
  loadFont(
    fontFamily,
    `url(${require('../src/sekiro/assets/HOT-GFGyoshoStd-E-2.ttf')})`,
  ),
  loadSoundEffect(require('../src/sekiro/assets/effect.mp3')),
]).then(([_, bgm]) => {
  const dangerous = new SekiroDangerousPallet({ bgm, text: { fontFamily } });
  document.body.appendChild(dangerous.getView());
  const button = document.querySelector('#play');
  button.removeAttribute('disabled');
  button.textContent = 'play';
  button.addEventListener('click', () => {
    dangerous.play();
  });
});
