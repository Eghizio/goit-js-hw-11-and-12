const API_KEY =
  '46463630-3c03a0f5bb3e2a02ee15ce5e1'; /* This should be kept a secret within Environmental Variables */

const lightbox = new SimpleLightbox(
  '.gallery a#lightbox-link'
); /* Fuck Lightbox and it's documentation BTW :) */

document
  .querySelector('form#image-search')
  .addEventListener('submit', async event => {
    event.preventDefault();

    const form = event.target;

    const searchQuery = form.elements['query'].value;

    form.reset();

    const gallery = document.querySelector('.gallery');

    gallery.replaceChildren(createLoader());

    const photosData = await getPhotos(searchQuery);

    if (photosData.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      gallery.replaceChildren();
      return;
    }

    const photoCards = photosData.hits
      .map(toGalleryPhoto)
      .map(createCard)
      .map(applyLightbox);

    gallery.replaceChildren(...photoCards);

    lightbox.refresh();
  });

const getPhotos = async searchQuery => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return fetch(`https://pixabay.com/api/?${params}`)
    .then(response => response.json())
    .catch(console.error);
};

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

const applyLightbox = card => {
  card.querySelector('a#lightbox-link').addEventListener('click', event => {
    event.preventDefault();

    const closeModalOnEscape = event => {
      if (event.key === 'Escape') {
        document.removeEventListener('keydown', closeModalOnEscape);
        lightbox.close();
      }
    };

    document.addEventListener('keydown', closeModalOnEscape);

    lightbox.open('for some reason this makes lightbox open the proper img xD');
  });

  return card;
};

const createLoader = () =>
  Object.assign(document.createElement('div'), { className: 'loader' });
