document
  .querySelector('form#image-search')
  .addEventListener('submit', event => {
    event.preventDefault();

    const searchQuery = event.target.elements['query'].value;

    getPhotos(searchQuery).then(console.log);
  });

const API_KEY = 'my_secret_pixabay_api_key';

const getPhotos = searchQuery => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return fetch(`pixabay_api_endpoint_url?${params}`)
    .then(response => response.json())
    .catch(console.error);
};
