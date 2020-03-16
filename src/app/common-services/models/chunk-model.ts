export class DataChunk<T> {
  data: T[] = [];
  isAllDataLoaded = false;
  loadedItems = 0;
  totalItems = 0;
  page = 0;
  isLoaded = false;

  populate(result: any) {
    if (result && !this.isAllDataLoaded) {
      this.data = this.data.concat(result.data);
      this.loadedItems = this.data.length;
      this.totalItems = result.totalItems;
      this.isAllDataLoaded = this.loadedItems >= result.totalItems;
    }
    return this;
  }
}
