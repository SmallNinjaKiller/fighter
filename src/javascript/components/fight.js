import { controls } from '../../constants/controls';

const doubleChance = Math.random() * 1 + 1;

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
  });
}

export function getDamage(attacker, defender) {
  // return damage
  return getHitPower(attacker) - getBlockPower(defender);
}

export function getHitPower(fighter) {
  // return hit power
  return power = fighter.attack * doubleChance;
}

export function getBlockPower(fighter) {
  // return block power
  return power = fighter.defence * doubleChance;
}
