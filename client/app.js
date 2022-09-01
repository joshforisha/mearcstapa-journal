const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const seconds = (x) => x * 60 * 1000;
const minutes = (x) => x * seconds(60);

const boards = [
  'https://bogbody.biz/45deb6f6d50b7b2e3a0aba5aa199823a3c0e64e5f604196e429bc41d683e0623', // Chase, designer
  'https://bogbody.biz/4ad8ebd552ea094f701df169b6e07875fa3e41c72627fe8e842d9a06b83e0923', // Josh
  'https://bogbody.biz/aba9bf0b5a98480cbfc9db2d536fb0d584e8144be5477afd762a13cc383e1123', // Matt Mills
  'https://bogbody.biz/a4813793a806d066c18f8a2d07a403393fecda667e5ccaa6fd76cfd5683e1023', // Maya
  'https://bogbody.biz/47e0f417f42634b42917124c8c9709714ac28c632830c2f96f8e52beb83e0623', // Peter, keymaster
  'https://0l0.lol/a1b78c1493c0393c629569742183906483ef0405a11c9e71afa7d3df583e0323', // Raphael
  'https://bogbody.biz/1e4bed50500036e8e2baef40cb14019c2d49da6dfee37ff146e45e5c783e0123', // Robin
  'https://bogbody.biz/db8a22f49c7f98690106cc2aaac15201608db185b4ada99b5bf4f222883e1223', // Roy
  'https://bogbody.biz/ac83c5127baf539b2132f032ed188c86d849c0023d2e7368ec1b5034383e0323', // Ryan
  'https://bogbody.biz/9158ffe2570fc9f12d214fe9c72d1ea10c7f217d5eee62a9958936b4483e0623' // Sunny
];

const feedDialog = $('#Feed');
const main = $('main');
const settingsDialog = $('#Settings');

// Functions -----------------------------------------------------------------------------------------------------------

function createBoard(boardUrl, fragment) {
  const section = document.createElement('section');
  section.setAttribute('data-board', boardUrl);
  section.attachShadow({ mode: 'open' });
  section.shadowRoot.appendChild(fragment);
  return section;
}

async function populateBoards(refresh = false) {
  const parser = new DOMParser();
  for (const boardUrl of boards) {
    let html = window.localStorage.getItem(boardUrl);
    if (html === null) {
      html = await window
        .fetch(boardUrl, {
          header: {
            'Spring-Version': '83'
          },
          method: 'GET',
          mode: 'cors'
        })
        .then((response) => response.text());
      window.localStorage.setItem(boardUrl, html);
    }

    const fragment = parser
      .parseFromString(html, 'text/html')
      .querySelector('template').content;

    const section = createBoard(boardUrl, fragment);
    main.appendChild(section);
    resizeSection(section);
  }
  // TODO: Synchronize promises to better handle refreshing
  setTimeout(() => populateBoards(true), minutes(10));
}

function resizeSection(section) {
  const rowHeight = parseInt(
    window.getComputedStyle(main).getPropertyValue('grid-auto-rows')
  );
  const rowSpan = Math.ceil(section.getBoundingClientRect().height / rowHeight);
  section.style.gridRowEnd = `span ${rowSpan}`;
}

function resizeSections() {
  for (let section of $$('main section')) {
    resizeSection(section);
  }
}

// Set up events -------------------------------------------------------------------------------------------------------

$('#OpenSettings').addEventListener('click', () => {
  settingsDialog.showModal();
});

$('#OpenFeed').addEventListener('click', () => {
  feedDialog.showModal();
});

populateBoards();

window.addEventListener('resize', () => resizeSections());
