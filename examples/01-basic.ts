import { SekiroDangerousPallet } from '../src/sekiro';

const dangerous = new SekiroDangerousPallet();
const view = dangerous.getView();
document.body.appendChild(view);
document.querySelector('#play').addEventListener('click', () => {
  dangerous.play();
});
