const API_KEY =
  '46463630-3c03a0f5bb3e2a02ee15ce5e1'; /* This should be kept a secret within Environmental Variables */

document
  .querySelector('form#image-search')
  .addEventListener('submit', event => {
    event.preventDefault();

    const searchQuery = event.target.elements['query'].value;

    getPhotos(searchQuery).then(console.log);
  });

const getPhotos = searchQuery => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return fetch(`https://pixabay.com/api?${params}`)
    .then(response => response.json())
    .catch(console.error);
};
