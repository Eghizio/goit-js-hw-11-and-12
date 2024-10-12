document
  .querySelector('form#image-search')
  .addEventListener('submit', event => {
    event.preventDefault();

    const query = event.target.elements['query'].value;

    console.log({ query });
  });
