import { State } from './State.js';
import { Toaster } from './Toaster.js';
import { Api } from './Api.js';

export class Gallery {
  #state;
  #element;
  #lightbox;
  #loader;
  #loadMoreBtn;

  constructor(selector, lightbox, loader, loadMoreBtn) {
    this.#state = new State();
    this.#element = document.querySelector(selector);
    this.#lightbox = lightbox;
    this.#loader = loader;
    this.#loadMoreBtn = loadMoreBtn;
  }

  clear() {
    this.#element.replaceChildren();
  }

  async loadPhotos(searchQuery) {
    this.#state.setSearchQuery(searchQuery);

    this.#loadMoreBtn.hide();
    this.#loader.show();
    const isGalleryEmpty = this.#state.photos.length === 0;

    try {
      const photosData = await Api.getPhotos(
        this.#state.searchQuery,
        this.#state.page
      );

      if (photosData.hits.length === 0) {
        if (!isGalleryEmpty) {
          Toaster.info(
            "We're sorry, but you've reached the end of search results."
          );
          return;
        }

        Toaster.error(
          'Sorry, there are no images matching your search query. Please try again!'
        );
        this.clear();
        this.#loader.hide();
        return;
      }

      this.#state.addPhotos(photosData.hits);

      this.#loader.hide();
      this.#renderPhotos();

      if (!isGalleryEmpty) scrollDownByTwoCardsHeights();

      const areMorePhotosAvailable =
        this.#state.photos.length < photosData.totalHits;

      if (areMorePhotosAvailable) {
        this.#loadMoreBtn.show();
      } else {
        Toaster.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } catch (error) {
      Toaster.error(`Sorry, couldn't load images. Please try again later!`);
      this.#loader.hide();
    } finally {
      this.#lightbox.refresh();
    }
  }

  #renderPhotos() {
    const photoCards = this.#state.photos.map(
      this.#mapPhotoToElement.bind(this)
    );

    this.#element.replaceChildren(...photoCards);
  }

  #mapPhotoToElement(photo) {
    return applyLightbox(createCard(toGalleryPhoto(photo)), this.#lightbox);
  }
}

const toGalleryPhoto = ({
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

const createCard = ({
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

const applyLightbox = (card, lightbox) => {
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
