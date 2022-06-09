import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({ tagName: 'div', className: `fighter-preview___root ${positionClassName}` });

  // todo: show fighter info (image, name, health, etc.)
  return showFighterInfo(fighter, fighterElement);
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { src: source, title: name, alt: name };
  const imgElement = createElement({ tagName: 'img', className: 'fighter-preview___img', attributes });

  return imgElement;
}

function showFighterInfo(fighter, fighterElement) {
  if (fighter){
  const { name, health, attack, defense} = fighter;
  const infoElement = createElement({ tagName: 'div', className: 'fighter-preview___root___info' });
  const imgElement = createFighterImage(fighter);
  infoElement.innerHTML = `<h2>${name}</h2> <br> Health ${health} <br> Attack ${attack} <br> Deffence ${defense}`;

  fighterElement.append(imgElement);
  fighterElement.append(infoElement);
  }
  return fighterElement;
}