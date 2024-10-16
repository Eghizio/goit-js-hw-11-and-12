const API_KEY =
  '46463630-3c03a0f5bb3e2a02ee15ce5e1'; /* This should be kept a secret within Environmental Variables */

export const Api = {
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
};
