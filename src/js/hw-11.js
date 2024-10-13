const API_KEY =
  '46463630-3c03a0f5bb3e2a02ee15ce5e1'; /* This should be kept a secret within Environmental Variables */

document
  .querySelector('form#image-search')
  .addEventListener('submit', async event => {
    event.preventDefault();

    const searchQuery = event.target.elements['query'].value;

    const photosData = await getPhotos(searchQuery);
    console.log(photosData);

    const photos = photosData.hits.map(toGalleryPhoto);
    console.log(photos);
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

const examplePhoto = {
  webformatURL:
    'https://pixabay.com/get/g17345ce7c6637f7d59e69717dff7959c1e820c9c3cf0ca0f9d32993834cd1833d693ce72128a683f87f8fa0c2b70d170be77ffde7a1985ceceb98f0bb77580d3_640.jpg',
  largeImageURL:
    'https://pixabay.com/get/gfc1a03d60aae3e8d5c40a8a0667a8c1e67736c8a96302eb1c9384ef90843f9187a6a0c343bfe9de70fe14ec28058d90766a7bcec4e8d7a8fea27f6dde348a06e_1280.jpg',
  tags: 'shepherd dog, dog, domestic animal',
  views: 214986,
  likes: 645,
  comments: 133,
  downloads: 149824,
};

const exampleCard = document.querySelector('.card');

const cards = Array.from({ length: 8 }, () => exampleCard.cloneNode(true));

document.querySelector('.gallery').append(...cards);
