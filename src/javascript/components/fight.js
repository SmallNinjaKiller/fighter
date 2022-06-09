import { controls } from '../../constants/controls';

const DEFAULT_COOLDOWN = new Date() + 10000;

export async function fight(selectedFighters) {
  const fighters = getFightersExt(selectedFighters);

  const keysPressed = new Set();

  return new Promise((resolve) => {
    document.addEventListener('keydown', (e) => handleKeyUp(e, keysPressed, fighters, resolve));

    document.addEventListener('keyup', (e) => handleKeyDown(e, keysPressed));
  });
}

function handleKeyUp({ code }, keysPressed, fighters, resolve) {
  const leftHealthIndicator = document.getElementById('left-fighter-indicator');
  const rightHealthIndicator = document.getElementById('right-fighter-indicator');

  const [fighterOneExt, fighterTwoExt] = fighters;

  keysPressed.add(code);

  const isPlayerOneAttack = keysPressed.has(controls.PlayerOneAttack);
  const isPlayerTwoAttack = keysPressed.has(controls.PlayerTwoAttack);
  const isPlayerOneCombination = controls.PlayerOneCriticalHitCombination.every((code) => keysPressed.has(code));
  const isPlayerTwoCombination = controls.PlayerTwoCriticalHitCombination.every((code) => keysPressed.has(code));

  switch (true) {
    case isPlayerOneAttack:
      getAttack(fighterOneExt, fighterTwoExt, rightHealthIndicator, keysPressed);
      break;
    case isPlayerTwoAttack:
      getAttack(fighterTwoExt, fighterOneExt, leftHealthIndicator, keysPressed);
      break;
    case isPlayerOneCombination:
      getCriticalAttack(fighterOneExt, fighterTwoExt, rightHealthIndicator);
      break;
    case isPlayerTwoCombination:
      getCriticalAttack(fighterTwoExt, fighterOneExt, leftHealthIndicator);
      break;
  }

  if (fighterOneExt.health <= 0) {
    removeListeners();
    return resolve(fighterTwoExt);
  }

  if (fighterTwoExt.health <= 0) {
    removeListeners();
    return resolve(fighterOneExt);
  }
}

function handleKeyDown({ code }, keysPressed) {
  keysPressed.delete(code);
}

function getDamage(attacker, defender) {
  return Math.max(0, getHitPower(attacker) - getBlockPower(defender));
}

function getHitPower(fighter) {
  const criticalHitChance = Math.random() * 1 + 1;

  return fighter.attack * criticalHitChance;
}

function getBlockPower(fighter) {
  const dodgeChance = Math.random() * 1 + 1;

  return fighter.defense * dodgeChance;
}

function attackBlocked(pressed) {
  return pressed.has(controls.PlayerOneBlock) || pressed.has(controls.PlayerTwoBlock);
}

function getAttack(attacker, defender, position, pressed) {
  if (attackBlocked(pressed)) return;
  defender.health -= getDamage(attacker, defender);
  modifyHealthIndicator(defender, position);
}

function getCriticalAttack(atacker, defender, position) {
  if (isCooldownOver(atacker)) return;

  defender.health -= atacker.attack * 2;
  modifyHealthIndicator(defender, position);

  atacker.resetCooldown();
}

function isCooldownOver(fighter) {
  const cooldownInSeconds = (new Date() - fighter.cooldown) / 1000;

  return cooldownInSeconds < 10;
}

function modifyHealthIndicator(defender, position) {
  const { maxHealth } = defender;

  if (defender.health <= 0) {
    defender.health = 0;
  }

  position.innerText = Math.round(defender.health);
  const barWidth = Math.max(0, (defender.health * 100) / maxHealth);
  position.style.width = `${barWidth}%`;
}

function getFightersExt(fighters) {
  return fighters.map((fighter) => ({
    ...fighter,
    maxHealth: fighter.health,
    cooldown: DEFAULT_COOLDOWN,
    resetCooldown() {
      this.cooldown = new Date();
    }
  }));
}

function removeListeners() {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
}