// Assuming "books" and "BOOKS_PER_PAGE" are declared elsewhere
// and "css", "createPreview", and "createPreviewsFragment" functions are defined.

let matches = books; // Added missing "let" keyword to declare "matches" variable.
let page = 1;

if (!books || !Array.isArray(books)) throw new Error('Source required'); // Fixed logical OR operator.

// Assuming "range" is declared elsewhere.
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
};
                                            //===============CAT VERSION=================================
const night = {                             //==========================================================
    dark: '255, 255, 255',
    light: '10, 10, 20',
};

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);

for (let i = 0; i < extracted.length; i++) { // Added missing initialization for "i" and fixed the condition.
    const { author, image, title, id } = extracted[i]; // Fixed the object destructuring.
    const preview = createPreview({
        author,
        id,
        image,
        title,
    });

    fragment.appendChild(preview);
}

data-list-items.appendChild(fragment);

const genres = document.createDocumentFragment();
let element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Genres';
genres.appendChild(element);

for (const [id, name] of Object.entries(genres)) { // Fixed the "for...of" loop syntax.
    element = document.createElement('option');
    element.value = id; // Changed "value" to "id" to match the "for...of" loop.
    element.innerText = name; // Changed "text" to "name" to match the "for...of" loop.
    genres.appendChild(element);
}

data-search-genres.appendChild(genres);

const authors = document.createDocumentFragment();
element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Authors';
authors.appendChild(element);

for (const [id, name] of Object.entries(authors)) { // Fixed the "for...of" loop syntax.
    element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    authors.appendChild(element);
}

data-search-authors.appendChild(authors);

const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
document.documentElement.style.setProperty('--color-dark', css[theme].dark);
document.documentElement.style.setProperty('--color-light', css[theme].light);

data-list-button.textContent = `Show more (${matches.length - page * BOOKS_PER_PAGE})`; // Fixed template literals.

data-list-button.disabled = !(matches.length - page * BOOKS_PER_PAGE > 0); // Removed unnecessary brackets.

data-search-cancel.addEventListener('click', () => {
    data-search-overlay.open = false;
});

data-settings-cancel.addEventListener('click', () => {
    data-settings-overlay.open = false;
});

data-settings-form.addEventListener('submit', (event) => { // Fixed the event listener function.
    event.preventDefault();
    // Assuming "actions.settings.submit" is defined and performs some action here.
    // You can add the action implementation according to your requirements.
    data-settings-overlay.open = false;
});

data-list-close.addEventListener('click', () => {
    data-list-active.open = false;
});

data-list-button.addEventListener('click', () => { // Fixed the event listener function.
    const nextPage = page + 1;
    const startIndex = page * BOOKS_PER_PAGE;
    const endIndex = nextPage * BOOKS_PER_PAGE;
    const previewsFragment = createPreviewsFragment(matches, startIndex, endIndex);

    document.querySelector('[data-list-items]').appendChild(previewsFragment);
    actions.list.updateRemaining();
    page = nextPage;
});

data-header-search.addEventListener('click', () => {
    data-search-overlay.open = true;
    data-search-title.focus();
});

data-search-form.addEventListener('click', (event) => { // Fixed the event listener function.
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) { // Fixed the "for...of" loop syntax.
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase()); // Used logical OR operator.
        const authorMatch = filters.author === 'any' || book.author === filters.author;

        let genreMatch = filters.genre === 'any'; // Initialize genreMatch to "false" initially.

        for (const genre of book.genres) {
            if (genre === filters.genre) {
                genreMatch = true;
                break; // Exit the loop if the genre is found.
            }
        }

        if (titleMatch && authorMatch && genreMatch) {
            result.push(book);
        }
    }

    const display = result.length;
    if (display < 1) {
        data-list-message.classList.add('list__message_show');
    } else {
        data-list-message.classList.remove('list__message_show');
    }

    data-list-items.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const extracted = result.slice(range[0], range[1]);

    for (const { author, image, title, id } of extracted) { // Used destructuring in the loop header.
        element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        element.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]} (${new Date(active.published).getFullYear()})</div>
            </div>
        `;

        fragment.appendChild(element);
    }
    
    data-list-items.appendChild(fragment);
    const initial = matches.length - page * BOOKS_PER_PAGE;
    const remaining = hasRemaining ? initial : 0;
    data-list-button.disabled = initial > 0;

    data-list-button.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    data-search-overlay.open = false;
});

data-settings-overlay.addEventListener('submit', (event) => { // Fixed the event listener function.
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData);
    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
    data-settings-overlay.open = false;
});

data-list-items.addEventListener('click', (event) => { // Fixed the event listener function.
    let active = null;

    const pathArray = Array.from(event.path || event.composedPath());
    for (const node of pathArray) {
