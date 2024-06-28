export class SearchUtils {
  /**
   * Filter array by string
   *
   * @param mainArr
   * @param searchedText
   * @returns
   */
  public static filterArrayByString(mainArr: any[], searchedText: string): any {
    if (searchedText === '') {
      return mainArr;
    }

    searchedText = searchedText.toLowerCase();

    return mainArr.filter(itemObj => this.searchInObj(itemObj, searchedText));
  }

  /**
   * Search in object
   *
   * @param itemObj
   * @param searchedText
   * @returns
   */
  public static searchInObj(itemObj, searchedText: string): boolean {
    for (const prop in itemObj) {
      if (!itemObj.hasOwnProperty(prop)) {
        continue;
      }

      const value = itemObj[prop];
      if (typeof value === 'string') {
        if (this.searchInString(value, searchedText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchedText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchedText)) {
          return true;
        }
      }
    }
  }

  /**
   * Search in array
   *
   * @param arr
   * @param searchedText
   * @returns
   */
  public static searchInArray(arr, searchedText): boolean {
    for (const value of arr) {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchedText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchedText)) {
          return true;
        }
      }
    }
  }

  /**
   * Search in string
   *
   * @param value
   * @param searchedText
   * @returns
   */
  public static searchInString(value, searchedText): any {
    return value.toLowerCase().includes(searchedText);
  }

  /**
   * Toggle in array
   *
   * @param item
   * @param array
   */
  public static toggleInArray(item, array): void {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }

  /**
   * Handleize
   *
   * @param text
   * @returns
   */
  public static handleize(text): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}
