export class DataChunk<T> {
  data: T[] = [];
  isAllDataLoaded = false;
  loadedItems = 0;
  totalItems = 0;
  page = 1;
  isLoaded = false;

  constructor(dataChunk?: DataChunk<T>) {
    if (dataChunk) {
      this.data = dataChunk.data;
      this.isAllDataLoaded = dataChunk.isAllDataLoaded;
      this.loadedItems = dataChunk.loadedItems;
      this.totalItems = dataChunk.totalItems;
      this.page = dataChunk.page;
      this.isLoaded = dataChunk.isLoaded;
    }
  }

  populate(result: any) {
    if (result && !this.isAllDataLoaded) {
      this.data = this.data.concat(result.data);
      this.loadedItems = this.data.length;
      this.totalItems = result.totalItems;
      this.isAllDataLoaded = this.loadedItems >= result.totalItems;
      this.page += 1;
      this.isLoaded = true;
      return new DataChunk(this);
    }
    return this;
  }
}
