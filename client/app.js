const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const boards = [
  'https://bogbody.biz/4ad8ebd552ea094f701df169b6e07875fa3e41c72627fe8e842d9a06b83e0923', // Josh’s board
  'https://bogbody.biz/1e4bed50500036e8e2baef40cb14019c2d49da6dfee37ff146e45e5c783e0123' //  Robin's board
];

const feedDialog = $('#Feed');
const main = $('main');
const settingsDialog = $('#Settings');

// Functions -----------------------------------------------------------------------------------------------------------

function createBoardArticle(boardUrl, fragment) {
  const article = document.createElement('article');
  article.setAttribute('data-board', boardUrl);
  article.attachShadow({ mode: 'open' });
  article.shadowRoot.appendChild(fragment);
  return article;
}

function resizeArticle(article) {
  const rowHeight = parseInt(
    window.getComputedStyle(main).getPropertyValue('grid-auto-rows')
  );
  const rowSpan = Math.ceil(article.getBoundingClientRect().height / rowHeight);
  article.style.gridRowEnd = `span ${rowSpan}`;
}

function resizeArticles() {
  for (let board of $$('main article')) {
    resizeArticle(board);
  }
}

// Set up events -------------------------------------------------------------------------------------------------------

$('#OpenSettings').addEventListener('click', () => {
  settingsDialog.showModal();
});

$('#OpenFeed').addEventListener('click', () => {
  feedDialog.showModal();
});

const parser = new DOMParser();
for (const boardUrl of boards) {
  const savedHtml = window.localStorage.getItem(boardUrl);
  if (savedHtml) {
    const fragment = parser
      .parseFromString(savedHtml, 'text/html')
      .querySelector('template').content;
    main.appendChild(createBoardArticle(boardUrl, fragment));
  } else {
    console.log(`Fetching ${boardUrl}...`);
    window
      .fetch(boardUrl, {
        header: {
          'Spring-Version': '83'
        },
        method: 'GET',
        mode: 'cors'
      })
      .then((response) => response.text())
      .then((html) => {
        window.localStorage.setItem(boardUrl, html);
        main.appendChild(createBoardArticle(boardUrl, html));
      });
  }
}

window.addEventListener('resize', () => resizeArticles());
resizeArticles();
