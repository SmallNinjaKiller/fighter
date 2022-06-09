import { controls } from '../../constants/controls';

const doubleChance = Math.random() * 1 + 1;

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    const leftHealthIndicator = document.getElementById('left-fighter-indicator');
    const rightHealthIndicator = document.getElementById('right-fighter-indicator');
    const firstFighterData = getModifyData(firstFighter);
    const secondFighterData = getModifyData(secondFighter);
    let pressed = new Set();

    document.addEventListener('keydown', function (event) {
      pressed.add(event.code);
      switch (true) {
        case pressed.has(controls.PlayerOneAttack):
          getAttack(firstFighterData, secondFighterData, rightHealthIndicator, pressed);
          break;
        case pressed.has(controls.PlayerTwoAttack):
          getAttack(secondFighterData, firstFighterData, leftHealthIndicator, pressed);
          break;
        case controls.PlayerOneCriticalHitCombination.every((code) => pressed.has(code)):
          getCriticalAttack(firstFighterData, secondFighterData, rightHealthIndicator);
          break;
        case controls.PlayerTwoCriticalHitCombination.every((code) => pressed.has(code)):
          getCriticalAttack(secondFighterData, firstFighterData, leftHealthIndicator);
          break;
      }
      if (firstFighterData.health <= 0) {
        return resolve(secondFighterData);
      } else if (secondFighterData.health <= 0) {
        return resolve(firstFighterData);
      }
    });

    document.addEventListener('keyup', function (event) {
      pressed.delete(event.code);
    });
  });
}

// export function getDamage(attacker, defender) {
//   // return damage
//   return getHitPower(attacker) - getBlockPower(defender);
// }

// export function getHitPower(fighter) {
//   // return hit power
//   return power = fighter.attack * doubleChance;
// }

// export function getBlockPower(fighter) {
//   // return block power
//   return power = fighter.defence * doubleChance;
// }

export function getDamage(attacker, defender) {
  return Math.max(0 , getHitPower(attacker) - getBlockPower(defender));
  // return damage
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() * 1 + 1;
  return fighter.attack * criticalHitChance;
  // return hit power
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() * 1 + 1;
  return fighter.defense * dodgeChance;
  // return block power
}

export function attackBlocked(pressed) {
  return pressed.has(controls.PlayerOneBlock) || pressed.has(controls.PlayerTwoBlock);
}

export function getAttack(attacker, defender, position, pressed) {
  if (attackBlocked(pressed)) return;
  defender.health -= getDamage(attacker, defender)
  modifyHealthIndicator(defender, position);
}

export function getCriticalAttack(atacker, defender, position) {
  if (CriticalCooldown(atacker)) return;

  defender.health -= atacker.attack * 2;
  modifyHealthIndicator(defender, position);

  atacker.resetCooldown();
}

export function CriticalCooldown(firstFighter) {
  const Seconds = (new Date() - firstFighter.Cooldown) / 1000;
  return Seconds < 10;
}

export function modifyHealthIndicator(defender, position) {
  const { maxHealth } = defender;
  if (defender.health <= 0) {
    defender.health = 0;
  }
  position.innerText = Math.round(defender.health);
  const barWidth = Math.max(0, (defender.health * 100) / maxHealth);
  position.style.width = `${barWidth}%`;
}

export function getModifyData(fighter) {
  return {
    ...fighter,
    maxHealth: fighter.health,
    Cooldown: new Date() + 10000,
    resetCooldown() {
      this.Cooldown = new Date();
    },
  };
}
