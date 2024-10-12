document
  .querySelector('form#image-search')
  .addEventListener('submit', event => {
    event.preventDefault();

    const query = event.target.elements['query'].value;

    console.log({ query });
  });

const API_KEY = 'my_secret_pixabay_api_key';

const getPhotos = () => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: 'dogs',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return fetch(`pixabay_api_endpoint_url?${params}`)
    .then(response => response.json())
    .catch(console.error);
};
