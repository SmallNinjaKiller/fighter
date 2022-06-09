import { showModal } from "./modal";

export function showWinnerModal(fighter) {
  // call showModal function 
  
  showModal({
    title: fighter.name,
    bodyElement: `Winner is ${fighter.name}`,
    onClose: () => {
      const root = document.getElementById('root');
      root.innerHTML = 'Reload page for a new game';
    }
  })
}
