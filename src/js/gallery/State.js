export class State {
  #_searchQuery;
  #_page;
  #_photos;

  constructor(
    { searchQuery, page, photos } = {
      searchQuery: undefined,
      page: undefined,
      photos: undefined,
    }
  ) {
    this.#_searchQuery = searchQuery ?? null;
    this.#_page = page ?? 1;
    this.#_photos = photos ?? [];
  }

  get searchQuery() {
    return this.#_searchQuery;
  }

  get page() {
    return this.#_page;
  }

  get photos() {
    return this.#_photos;
  }

  reset() {
    this.#_searchQuery = null;
    this.#_page = 1;
    this.#_photos = [];
  }

  setSearchQuery(query) {
    const isNewSearchQuery = this.#_searchQuery !== query;

    if (isNewSearchQuery) {
      this.reset();
      this.#_searchQuery = query;
    } else {
      this.nextPage();
    }
  }

  nextPage() {
    this.#_page++;
  }

  addPhotos(photos) {
    this.#_photos.push(...photos);
  }
}
