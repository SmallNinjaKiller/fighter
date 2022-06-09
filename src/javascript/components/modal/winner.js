import { showModal } from "./modal";

export function showWinnerModal(fighter) {
  // call showModal function 

  showModal({ title: fighter.name, bodyElement: `Winner is ${fighter.name}`, onClose: () => { location.reload() } })
}
