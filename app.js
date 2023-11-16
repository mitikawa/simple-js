import sumoWrestlers, { sumoRanks } from './data.js';

document.addEventListener('DOMContentLoaded', function () {
  const eastWrestlersList = document.getElementById('eastWrestlers');
  const westWrestlersList = document.getElementById('westWrestlers');
  const wrestlerDetails = document.getElementById('wrestlerDetails');
  const wrestlerImage = document.getElementById('wrestlerImage');
  const name = document.getElementById('name');
  const height = document.getElementById('height');
  const weight = document.getElementById('weight');

  wrestlerDetails.addEventListener('drop', handleDrop);
  wrestlerDetails.addEventListener('dragover', handleDragOver);

  function renderWrestlers() {
    renderSideRow(eastWrestlersList, 'East');
    renderSideRow(westWrestlersList, 'West');

    sumoRanks.forEach((rank) => {
      const eastRankRow = document.createElement('tr');
      const westRankRow = document.createElement('tr');
      eastRankRow.innerHTML = `<td class="rankRow" colspan="2">${rank}</td>`;
      westRankRow.innerHTML = `<td class="rankRow" colspan="2">${rank}</td>`;

      eastWrestlersList.appendChild(eastRankRow);
      westWrestlersList.appendChild(westRankRow);

      const eastWrestlers = sumoWrestlers.filter(
        (wrestler) => wrestler.side === 'E' && wrestler.rank === rank
      );
      const westWrestlers = sumoWrestlers.filter(
        (wrestler) => wrestler.side === 'W' && wrestler.rank === rank
      );

      eastWrestlers.forEach((wrestler) => {
        const eastWrestlerRow = createWrestlerRow(wrestler);
        eastWrestlersList.appendChild(eastWrestlerRow);
      });

      westWrestlers.forEach((wrestler) => {
        const westWrestlerRow = createWrestlerRow(wrestler);
        westWrestlersList.appendChild(westWrestlerRow);
      });

      const difference = eastWrestlers.length - westWrestlers.length;
      if (difference < 0) {
        for (let index = 0; index < -difference; index++) {
          const element = createEmptyRow();
          eastWrestlersList.appendChild(element);
        }
      }

      if (difference > 0) {
        for (let index = 0; index < difference; index++) {
          const element = createEmptyRow();
          westWrestlersList.appendChild(element);
        }
      }
    });
  }

  function renderSideRow(wrestlersList, side) {
    const sideRow = document.createElement('tr');
    sideRow.innerHTML = `<th class="sideRow" colspan="2">${side}</th>`;
    wrestlersList.appendChild(sideRow);
  }

  function createWrestlerRow(wrestler) {
    const wrestlerRow = document.createElement('tr');
    wrestlerRow.innerHTML = `<td id="${wrestler.id}" class="wrestlerRow" draggable="true">${wrestler.position} - ${wrestler.name}</td>`;
    wrestlerRow.addEventListener('dragstart', handleDragStart);
    return wrestlerRow;
  }

  function createEmptyRow() {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td class="emptyRow"></td>';
    return emptyRow;
  }

  function showWrestlerDetails(wrestler) {
    wrestlerImage.src = wrestler.image;
    wrestlerImage.alt = `${wrestler.name} Image`;
    name.innerText = `Name: ${wrestler.name}`;
    height.innerText = `Height: ${wrestler.stats.height}`;
    weight.innerText = `Weight: ${wrestler.stats.weight}`;
  }

  function handleDragStart(ev) {
    const wrestlerId = ev.target.id;
    ev.dataTransfer.setData('text', wrestlerId);
  }

  function handleDragOver(ev) {
    ev.preventDefault();
    return false;
  }

  function handleDrop(ev) {
    ev.preventDefault();
    const wrestlerId = ev.dataTransfer.getData('text');
    const droppedWrestler = sumoWrestlers.find((wrestler) => wrestler.id.toString() === wrestlerId);

    if (this.id === 'wrestlerDetails' && droppedWrestler) {
      showWrestlerDetails(droppedWrestler);
    }
    return false;
  }

  renderWrestlers();
});
