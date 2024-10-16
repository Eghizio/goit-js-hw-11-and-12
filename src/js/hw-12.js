const API_KEY =
  '46463630-3c03a0f5bb3e2a02ee15ce5e1'; /* This should be kept a secret within Environmental Variables */

const lightbox = new SimpleLightbox(
  '.gallery a#lightbox-link'
); /* Fuck Lightbox and it's documentation BTW :) */

class TogglableElement {
  #element;

  constructor(selector) {
    this.#element = document.querySelector(selector);
  }

  getElement() {
    return this.#element;
  }

  show() {
    this.#element.disabled = false;
    this.#element.classList.remove('hidden');
  }

  hide() {
    this.#element.disabled = true;
    this.#element.classList.add('hidden');
  }
}

const Loader = new TogglableElement('div.loader');
const LoadMoreButton = new TogglableElement(`button[type="button"].btn`);

const main = () => {
  document
    .querySelector('form#image-search')
    .addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.target;
      const searchQuery = form.elements['query'].value;
      form.reset();

      await Api.searchPhotos(searchQuery);
    });

  LoadMoreButton.getElement().addEventListener('click', Api.loadMore);
};

const State = {
  searchQuery: null,
  page: 1,
  photos: [],
  reset() {
    this.searchQuery = null;
    this.page = 1;
    this.photos = [];
  },
};

const Gallery = {
  element: document.querySelector('.gallery'),
  clear() {
    this.element.replaceChildren();
  },
  render(items) {
    this.element.append(...(Array.isArray(items) ? items : [items]));
  },
};

const Toaster = {
  error(message) {
    iziToast.error({ message, position: 'topRight' });
  },
  info(message) {
    iziToast.info({ message, position: 'topRight' });
  },
};

const Api = {
  async getPhotos(searchQuery, page = 1) {
    const params = new URLSearchParams({
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
    });

    const response = await axios.get(`https://pixabay.com/api/`, { params });
    return response.data;
  },
  async searchPhotos(searchQuery) {
    LoadMoreButton.hide();
    Gallery.clear();

    Loader.show();

    State.reset();

    try {
      const photosData = await Api.getPhotos(searchQuery);
      State.searchQuery = searchQuery;

      if (photosData.hits.length === 0) {
        Toaster.error(
          'Sorry, there are no images matching your search query. Please try again!'
        );
        Gallery.clear();
        Loader.hide();
        return;
      }

      const photoCards = photosData.hits
        .map(toGalleryPhoto)
        .map(createCard)
        .map(applyLightbox);

      State.photos.push(...photoCards);

      Gallery.clear();
      Loader.hide();
      Gallery.render(photoCards);

      const areMorePhotosAvailable = State.photos.length < photosData.totalHits;

      if (areMorePhotosAvailable) {
        LoadMoreButton.show();
      } else {
        Toaster.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } catch (error) {
      Toaster.error(`Sorry, couldn't load images. Please try again later!`);
      Gallery.clear();
      Loader.hide();
    } finally {
      lightbox.refresh();
    }
  },
  async loadMore() {
    Loader.show();
    LoadMoreButton.hide();

    try {
      const photosData = await Api.getPhotos(State.searchQuery, State.page + 1);
      State.page++;

      if (photosData.hits.length === 0) {
        Toaster.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      const photoCards = photosData.hits
        .map(toGalleryPhoto)
        .map(createCard)
        .map(applyLightbox);

      State.photos.push(...photoCards);

      Loader.hide();
      Gallery.render(State.photos);

      scrollDownByTwoCardsHeights();

      const areMorePhotosAvailable = State.photos.length < photosData.totalHits;
      if (areMorePhotosAvailable) {
        LoadMoreButton.show();
      } else {
        Toaster.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } catch (error) {
      Toaster.error(`Sorry, couldn't load images. Please try again later!`);
    } finally {
      lightbox.refresh();
    }
  },
};

export const toGalleryPhoto = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
});

export const createCard = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => {
  const template = document.querySelector('template#card-template');
  const card = document.importNode(template.content, true);

  const lightboxLink = card.querySelector('a#lightbox-link');
  lightboxLink.href = largeImageURL;

  const img = card.querySelector('img.card-img');
  img.src = webformatURL;
  img.alt = tags;
  img.title = tags;

  card.querySelector(
    `span.card-stats-item-count[data-item="likes"]`
  ).textContent = likes;

  card.querySelector(
    `span.card-stats-item-count[data-item="views"]`
  ).textContent = views;

  card.querySelector(
    `span.card-stats-item-count[data-item="comments"]`
  ).textContent = comments;

  card.querySelector(
    `span.card-stats-item-count[data-item="downloads"]`
  ).textContent = downloads;

  return card;
};

export const applyLightbox = card => {
  card.querySelector('a#lightbox-link').addEventListener('click', event => {
    event.preventDefault();

    const closeModalOnEscape = event => {
      if (event.key === 'Escape') {
        document.removeEventListener('keydown', closeModalOnEscape);
        lightbox.close();
      }
    };

    document.addEventListener('keydown', closeModalOnEscape);

    lightbox.open(event.currentTarget);
  });

  return card;
};

export const scrollDownByTwoCardsHeights = () => {
  const height = document.querySelector('.card').getBoundingClientRect().height;
  scrollBy(0, 2 * height, { behavior: 'smooth' });
};

main();
