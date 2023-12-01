import { sumoWrestlers, sumoRanks } from './data.js';

document.addEventListener('DOMContentLoaded', async function () {
  const eastWrestlersList = document.getElementById('eastBanzuke') as HTMLTableElement;
  const westWrestlersList = document.getElementById('westBanzuke') as HTMLTableElement;

  var eastList: { name: string, rank: string, position: number, side: string }[] = [];
  var westList: { name: string, rank: string, position: number, side: string }[] = [];

  const banzuke = await getBanzukeInfo();

  if (banzuke) {
    var banzukeEastList = banzuke.eastList;
    var banzukeWestList = banzuke.westList;
  } else {
    console.error('Error fetching banzuke info.')
  }
  eastList = createWrestlerListFromBanzukeList(banzukeEastList);
  westList = createWrestlerListFromBanzukeList(banzukeWestList);

  function createWrestlerListFromBanzukeList(list: { name: string, rank: string, position: number, side: string }[]) {
    const wrestlerList = [];
    for (const row of list) {
      var rank: string = '';
      var position: number = 0;

      if (row.rank == 'Y') {
        rank = 'Yokozuna';
        position = row.position;
      } else if (row.rank == 'O') {
        rank = 'Ozeki';
        position = row.position;
      } else if (row.rank == 'S') {
        rank = 'Sekiwake';
        position = row.position;
      } else if (row.rank == 'K') {
        rank = 'Komusubi';
        position = row.position;
      } else {
        rank = 'Maegashira';
        position = Number(row.rank.slice(1,))
      }
      const wrestlerRow = { name: row.name, rank: rank, position: position, side: row.side };
      wrestlerList.push(wrestlerRow);
    }
    return wrestlerList;
  }


  function renderWrestlers(eastList: { name: string, rank: string, position: number, side: string }[], westList: { name: string, rank: string, position: number, side: string }[]) {
    renderSideRow(eastWrestlersList, 'East');
    renderSideRow(westWrestlersList, 'West');

    sumoRanks.forEach((rank) => {
      const eastRankRow = document.createElement('tr');
      const westRankRow = document.createElement('tr');
      eastRankRow.innerHTML = `<td class="banzukeRankRow" colspan="2">${rank}</td>`;
      westRankRow.innerHTML = `<td class="banzukeRankRow" colspan="2">${rank}</td>`;

      eastWrestlersList.appendChild(eastRankRow);
      westWrestlersList.appendChild(westRankRow);

      const eastWrestlers = eastList.filter(
        (wrestler) => wrestler.side === 'E' && wrestler.rank === rank
      );
      const westWrestlers = westList.filter(
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
    const banzukeSideRow = document.createElement('tr');
    banzukeSideRow.innerHTML = `<th class="banzukeSideRow" colspan="2">${side}</th>`;
    wrestlersList.appendChild(banzukeSideRow);
  }

  function createWrestlerRow(wrestler: any) {
    const wrestlerRow = document.createElement('tr');
    if (wrestler.name === '') {
      wrestlerRow.innerHTML = '<td class="emptyRow"></td>';
    } else {
      wrestlerRow.innerHTML = `<td class="banzukeWrestlerRow" draggable="true">${wrestler.position} - ${wrestler.name}</td>`;
    }
    return wrestlerRow;
  }

  function createEmptyRow() {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td class="banzukeEmptyRow"></td>';
    return emptyRow;
  }

  async function getBanzukeInfo() {
    try {
      const response = await fetch(`http://localhost:8000/get-banzuke-info`);
      const result = await response.json();

      if (result) {
        return { 'eastList': result.eastList, 'westList': result.westList }
      } else {
        console.error('Error:', result.error);
      }
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }

  renderWrestlers(eastList, westList);
});