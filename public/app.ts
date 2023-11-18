import { sumoWrestlers, sumoRanks } from './data.js';

document.addEventListener('DOMContentLoaded', function () {
  const eastWrestlersList = document.getElementById('eastWrestlers') as HTMLTableElement;
  const westWrestlersList = document.getElementById('westWrestlers') as HTMLTableElement;
  const leftDetails = document.getElementById('leftDetails') as HTMLDivElement;
  const rightDetails = document.getElementById('rightDetails') as HTMLDivElement;

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

  function renderSideRow(wrestlersList: HTMLTableElement, side: string) {
    const sideRow = document.createElement('tr');
    sideRow.innerHTML = `<th class="sideRow" colspan="2">${side}</th>`;
    wrestlersList.appendChild(sideRow);
  }

  function createWrestlerRow(wrestler: any) {
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

  function showWrestlerDetails(detailsId: string, wrestler: any) {
    const details = document.getElementById(detailsId) as HTMLDivElement;
    const promise = getWrestlerInfo(wrestler.sumoKyoukaiId);
    promise.then((kyoukaiInfo) => {
      if (kyoukaiInfo) {
        const img = details.querySelector('img') as HTMLImageElement;
        const name = details.querySelector('p.name') as HTMLParagraphElement;
        const height = details.querySelector('p.height') as HTMLParagraphElement;
        const weight = details.querySelector('p.weight') as HTMLParagraphElement;

        img.src = 'https://www.sumo.or.jp' + kyoukaiInfo.src;
        img.alt = `${wrestler.name} Image`;
        name.innerText = `Name: ${wrestler.name}`;
        height.innerText = `Height: ${kyoukaiInfo.height}`;
        weight.innerText = `Weight: ${kyoukaiInfo.weight}`;
        details.setAttribute('currentWrestlerId', wrestler.id);
      } else {
        console.error('Error fetching wrestler info.')
      }
    })
  }

  function handleDragStart(ev: DragEvent) {
    if (!ev.target) return;
    const wrestlerId = (ev.target as any).id;
    if (!ev.dataTransfer) return;
    ev.dataTransfer.setData('text', wrestlerId);
  }

  function handleDragOver(ev: DragEvent) {
    ev.preventDefault();
    return false;
  }

  function getOtherDetailsDiv(detailsId: string) {
    if (detailsId === 'leftDetails') {
      return document.getElementById('rightDetails');
    }
    else if (detailsId === 'rightDetails') {
      return document.getElementById('leftDetails');
    } else return false;
  }

  function handleDrop(this: HTMLElement, ev: DragEvent) : boolean {
    ev.preventDefault();
    if (!ev.dataTransfer) return false;
    const wrestlerId: string = ev.dataTransfer.getData('text');
    const droppedWrestler = sumoWrestlers.find((wrestler) => wrestler.id.toString() === wrestlerId);

    if (this.className === 'wrestlerDetails' && droppedWrestler) {
      const other = getOtherDetailsDiv(this.id) as HTMLDivElement;
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

  async function getWrestlerInfo(wrestlerId: string) {
    try {
      const response = await fetch(`http://localhost:8000/get-wrestler-info?id=${wrestlerId}`);
      const result = await response.json();

      if (result.success) {
        return { 'height': result.height, 'weight': result.weight, 'src': result.imageSource }
      } else {
        console.error('Error:', result.error);
      }
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }
});