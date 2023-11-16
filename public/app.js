import { sumoWrestlers, sumoRanks } from './data.js';

document.addEventListener('DOMContentLoaded', function () {
  const eastWrestlersList = document.getElementById('eastWrestlers');
  const westWrestlersList = document.getElementById('westWrestlers');
  const leftDetails = document.getElementById('leftDetails');
  const rightDetails = document.getElementById('rightDetails');

  leftDetails.addEventListener('drop', handleDrop);
  leftDetails.addEventListener('dragover', handleDragOver);
  rightDetails.addEventListener('drop', handleDrop);
  rightDetails.addEventListener('dragover', handleDragOver);

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

  function showWrestlerDetails(detailsId, wrestler) {
    const details = document.getElementById(detailsId);
    const promise = getWrestlerInfo(wrestler.sumoKyoukaiId);
    promise.then((kyoukaiInfo) => {
      details.querySelector('img').src = 'https://www.sumo.or.jp' + kyoukaiInfo.src;
      details.querySelector('img').alt = `${wrestler.name} Image`;
      details.querySelector('p.name').innerText = `Name: ${wrestler.name}`;
      details.querySelector('p.height').innerText = `Height: ${kyoukaiInfo.height}`;
      details.querySelector('p.weight').innerText = `Weight: ${kyoukaiInfo.weight}`;
      details.setAttribute('currentWrestlerId', wrestler.id)
    })
  }

  function handleDragStart(ev) {
    const wrestlerId = ev.target.id;
    ev.dataTransfer.setData('text', wrestlerId);
  }

  function handleDragOver(ev) {
    ev.preventDefault();
    return false;
  }

  function getOtherDetailsDiv(detailsId) {
    if (detailsId === 'leftDetails') {
      return document.getElementById('rightDetails');
    }
    else if (detailsId === 'rightDetails') {
      return document.getElementById('leftDetails');
    } else return false;
  }

  function handleDrop(ev) {
    ev.preventDefault();
    const wrestlerId = ev.dataTransfer.getData('text');
    const droppedWrestler = sumoWrestlers.find((wrestler) => wrestler.id.toString() === wrestlerId);

    if (this.className === 'wrestlerDetails' && droppedWrestler) {
      const other = getOtherDetailsDiv(this.id);
      if (other.getAttribute('currentWrestlerId') === droppedWrestler.id.toString()) {
        console.log("Same wrestler as other div.");
        return false;
      } else {
        showWrestlerDetails(this.id, droppedWrestler);
      }
    }
    return false;
  }

  renderWrestlers();

  async function getWrestlerInfo(wrestlerId) {
    try {
      const response = await fetch(`http://localhost:8000/get-wrestler-info?id=${wrestlerId}`);
      const result = await response.json();

      if (result.success) {
        return { 'height': result.height, 'weight': result.weight, 'src': result.imageSource }
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

});
