/**
 *
 * @returns {Promise<BusDB>} a promise that resolves to a BusDB instance
 * @description open the indexedDB and create the schema
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("BusDB", 1);
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      switch (event.oldVersion) {
        case 0: // dont have DB yet, create schema
          db.createObjectStore("bookmark", { keyPath: 'id', autoIncrement: true });
        default:
          console.log("BusDB version changed");
      }
    }
    request.onsuccess = function() {
      console.log("BusDB open success");
      const db = request.result;
      db.onversionchange = function() {
        db.close();
        alert("BusDB is outdated, please reload the page.");
      }
      db.onerror = function(event) { // general error handling if not handled in transaction
        console.log("Error", event.target.error);
      }
      resolve(new BusDB(db));
    }
    request.onerror = function(event) {
      reject(event);
      alert("unable to open BusDB");
    }
  });
}

class BusDB {
  #db;

  constructor(db) {
    this.#db = db;
  }

  #openObjectStore(storeName, readWrite, callback) {
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction(storeName, readWrite ? "readwrite" : "readonly");
      const store = transaction.objectStore(storeName);
      callback(store, resolve, reject, transaction);
      if (readWrite) {
        transaction.commit();
      }
    });
  }

  /**
   * 
   * @param data { (id[update], title, order, go: { title, stops: [{ stop, routes: [{company, route, bound, serviceType }] }] }, back: { title, stops: [{ stop, routes: [{company, route, bound, serviceType }] }] } }
   * @returns promise the new key
   * @description add or update bookmark to the DB
   */
  saveBookmark(data) {
    return this.#openObjectStore("bookmark", true, (objectStore, resolve, reject) => {
      const request = objectStore.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }
  /**
   * 
   * @param data { (id[update], title, order, go: { title, stops: [{ stop, routes: [{company, route, bound, serviceType }] }] }, back: { title, stops: [{ stop, routes: [{company, route, bound, serviceType }] }] } }
   * @returns promise the new key
   * @description add or update bookmark to the DB
   */
  saveBookmarks(datas) {
    return this.#openObjectStore("bookmark", true, (objectStore, resolve, reject, transaction) => {
      transaction.oncomplete = (e) => resolve(e);
      transaction.onerror = (event) => reject(event);
      datas.forEach(d => objectStore.put(d));
    });
  }
  /**
   * 
   * @returns promise { (id, title, order, go: { title, stops: [{ stop, routes: [{company, route, bound, serviceType }] }] }, back: { title, stops: [{ stop, routes: [{company, route, bound, serviceType }] }] } }
   * @description get all bookmarks
   */
  getBookmarks() {
    return this.#openObjectStore("bookmark", false, (objectStore, resolve, reject) => {
      const request = objectStore.getAll();
      request.onsuccess = () => {
        let list = request.result;
        if (list?.length) {
          if (list[0].order === undefined) {
            let i = 0;
            list.forEach(item => item.order = i++);
          }
          list.sort((a, b) => a.order - b.order);
        }
        resolve(list);
      }
      request.onerror = (event) => reject(event);
    });
  }
  /**
   * 
   * @param id
   * @returns promise
   * @description delete a bookmark from the DB
   */
  deleteBookmark(id) {
    return this.#openObjectStore("bookmark", true, (objectStore, resolve, reject) => {
      const request = objectStore.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }
  /**
   * 
   * @returns promise
   * @description delete all bookmarks from the DB
   */
  clearAllBookmarks() {
    return this.#openObjectStore("bookmark", true, (objectStore, resolve, reject) => {
      const request = objectStore.clear();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }
  
  close() {
    this.#db.close();
  }

}
