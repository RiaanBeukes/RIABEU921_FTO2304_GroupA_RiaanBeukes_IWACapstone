import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js" //imports added

let matches = books;   //let added
let page = 1;          //lat added

const range = [1,2];   //const range added

if (!books || !Array.isArray(books)) throw new Error('Source required');
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

const day = {            //const added
  dark: '10, 10, 20',
  light: '255, 255, 255',
};

const night = {        //const added
  dark: '255, 255, 255',
  light: '10, 10, 20',
};

const fragment = document.createDocumentFragment(); //added const
const extracted = books.slice(0, 36);

function createPreview(book) {
  const { author, image, title, id } = book;
  const previewElement = document.createElement('div');
 
  return previewElement;
}

for (let i = 0; i < extracted.length; i++) {
  const { author, image, title, id } = extracted[i];
  const preview = createPreview({
    author,
    id,
    image,
    title,
  });

  fragment.appendChild(preview);
}

const dataListItems = document.querySelector('[data-list-items]');

dataListItems.appendChild(fragment);   

const genresElement = document.createDocumentFragment();
let element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Genres';
genresElement.appendChild(element);

for (const [id, name] of Object.entries(genres)) {
  const element = document.createElement('option');
  element.value = id;
  element.innerText = name;
  genresElement.appendChild(element);
}

const dataSearchGenres = document.createElement('select');

dataSearchGenres.appendChild(genresElement);

const authorsElement = document.createDocumentFragment();
element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Authors';
authorsElement.appendChild(element);

for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement('option');
  element.value = id;
  element.innerText = name;
  authors.appendChild(element);
}

const dataSearchAuthors = document.createElement('select');

dataSearchAuthors.appendChild(authorsElement);
//=======================================================info missing
const dataListButton = document.querySelector("selector-here");

dataListButton.disabled = !(matches.length - (page * BOOKS_PER_PAGE) > 0);

dataListButton.innerHTML = /* html */ [
  '<span>Show more</span>',
  `<span class="list__remaining"> (${matches.length - (page * BOOKS_PER_PAGE) > 0 ? matches.length - (page * BOOKS_PER_PAGE) : 0})</span>`,
];

dataSearchCancel.addEventListener('click', () => {
  dataSearchOverlay.open = false;
});

dataSettingsCancel.addEventListener('click', () => {
  document.querySelector(data-settings-overlay).open = false;
});

dataSettingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  actions.settings.submit();
});

dataListClose.addEventListener('click', () => {
  dataListActive.open = false;
});

dataListButton.addEventListener('click', () => {
  document.querySelector('[data-list-items]').appendChild(
    createPreviewsFragment(matches, page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)
  );
  actions.list.updateRemaining();
  page = page + 1;
});

dataHeaderSearch.addEventListener('click', () => {
  data_search_overlay.open = true;
  data-search-title.focus();
});

dataSearchForm.addEventListener('click', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of booksList) {
    const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || book.author === filters.author;
    const genreMatch = filters.genre === 'any' || (filters.genre && book.genres.includes(filters.genre));

    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }
  }

  if (result.length < 1) {
    data-list-message.classList.add('list__message_show');
  } else {
    data-list-message.classList.remove('list__message_show');
  }

  dataListItems.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const extracted = source.slice(range[0], range[1]);

  for (const { author, image, title, id } of extracted) {
    const { author: authorId, id, image, title } = props;
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = /* html */ `
      <img
          class="preview__image"
          src="${image}"
      />
      
      <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[authorId]}</div>
      </div>
    `;

    fragment.appendChild(element);
  }

  dataListItems.appendChild(fragment);

  const initial = matches.length - (page * BOOKS_PER_PAGE);
  const remaining = hasRemaining ? initial : 0;
  dataListButton.disabled = initial > 0;

  dataListButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${remaining})</span>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  dataSearchOverlay.open = false;
});

dataSettingsOverlay.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);
  document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
  document.documentElement.style.setProperty('--color-light', css[result.theme].light);
  document.querySelector(dataSettingsOverlay).open = false;
});

dataListItems.addEventListener('click', () => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active;

  for (const node of pathArray) {
    if (active) break;
    const previewId = node?.dataset?.preview;

    for (const singleBook of books) {
      if (singleBook.id === previewId) active = singleBook;
    }
  }

  if (!active) return;
  dataListActive.open = true;
  dataListBlur = data_list_image = active.image;
  dataListTitle = active.title;
  dataListsSubtitle = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
  dataListDescription = active.description;
});