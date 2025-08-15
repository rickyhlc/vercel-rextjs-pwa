/**
 *
 * @returns {Promise<BankDB>} a promise that resolves to a BankDB instance
 * @description open the indexedDB and create the schema
 */
export const initDB = (a, data) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("BankDB", 6);
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      switch (event.oldVersion) {
        case 0: // dont have DB yet, create schema
          const costStore = db.createObjectStore("cost", { keyPath: 'id', autoIncrement: true });
          costStore.createIndex("byDate", "date");
        case 1:
          // const typeStore = db.createObjectStore("catType");
          // typeStore.put(CAT_TYPE_LIST, "catTypeMap");
        case 2:
        case 3:
          // if (db.objectStoreNames.contains("catType")) {
          //   db.deleteObjectStore("catType");
          // } else if (db.objectStoreNames.contains("config")) {
          //   db.deleteObjectStore("config");
          // }
          // const configStore = db.createObjectStore("config");
          // configStore.put(CAT_TYPE_LIST, "catTypeMap");
          // configStore.put(FLAG_LIST, "flagList");
        case 4:
          if (db.objectStoreNames.contains("catType")) {
            db.deleteObjectStore("catType");
          }
          if (db.objectStoreNames.contains("config")) {
            db.deleteObjectStore("config");
          }
        case 5:
          event.currentTarget.transaction.objectStore("cost").createIndex("byCat", "cat");
        default:
          console.log("DB version changed");
      }
    }
    request.onsuccess = function() {
      console.log("DB open success");
      const db = request.result;
      db.onversionchange = function() {
        db.close();
        alert("DB is outdated, please reload the page.");
      }
      db.onerror = function(event) { // general error handling if not handled in transaction
        console.log("Error", event.target.error);
      }
      resolve(new BankDB(db));
    }
    request.onerror = function(event) {
      reject(event);
      alert("unable to open DB");
    }
  });
}

class BankDB {
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
   * @param data (id[update], date, cat, type, value, desc)
   * @returns promise the new key
   * @description add or update cost type to the DB
   */
  saveCost(data) {
    return this.#openObjectStore("cost", true, (objectStore, resolve, reject) => {
      const request = objectStore.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }
  /**
   * 
   * @param datas object[(id[update], date, cat, type, value, desc)]
   * @returns promise the new key
   * @description add or update cost type to the DB
   */
  saveCosts(datas) {
    return this.#openObjectStore("cost", true, (objectStore, resolve, reject, transaction) => {
      transaction.oncomplete = (e) => {
        resolve(e);
      }
      transaction.onerror = (event) => reject(event);
      datas.forEach(d => objectStore.put(d));
    });
  }
  /**
   * 
   * @param startDate timestamp, optional
   * @param endDate timestamp, optional
   * @param flagFilters object[FLAG_NAME: "e|i"], optional
   * @returns promise
   * @description get all costs in the given date range
   */
  getCosts(startDate, endDate, cat, flagFilters) {
    return this.#openObjectStore("cost", false, (objectStore, resolve, reject) => {
      let index = objectStore.index("byDate");
      let query;
      if (startDate) {
        if (endDate) {
          query = IDBKeyRange.bound(startDate, endDate, false, true);
        } else {
          query = IDBKeyRange.lowerBound(startDate);
        }
      } else if (endDate) {
        query = IDBKeyRange.upperBound(endDate, true);
      }

      let includeOnly = null;
      let excludes = [];
      Object.entries(flagFilters || {}).forEach(f => {
        if (f[1] === "e") {
          excludes.push(f[0]);
        } else if (f[1] === "oi") {
          includeOnly = f[0];
        }
      });

      if (includeOnly || excludes.length || cat) {
        const _filterByFlags = (cur) => {
          if (!excludes.some(f => cur.value[f])) {
            if (includeOnly) {
              if (cur.value[includeOnly]) {
                return true;
              }
            } else {
              return true;
            }
          }
        }
        const _filterByCat = (cur) => {
          if (cat) {
            return cur.value.cat === cat;
          } else {
            return true;
          }
        }
        const filter = !cat ? _filterByFlags : !(includeOnly || excludes.length) ? _filterByCat : (cur) => _filterByCat(cur) && _filterByFlags(cur);
        const request = index.openCursor(query);
        let results = [];
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (filter(cursor)) {
              results.push(cursor.value);
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        }
        request.onerror = (event) => reject(event);
      } else {
        const request = index.getAll(query);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event);
      }
    });
  }
  /**
   * 
   * @param id
   * @returns promise
   * @description delete a cost from the DB
   */
  deleteCost(id) {
    return this.#openObjectStore("cost", true, (objectStore, resolve, reject) => {
      const request = objectStore.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }
  /**
   * 
   * @returns promise
   * @description delete all costs from the DB
   */
  clearAllCosts() {
    return this.#openObjectStore("cost", true, (objectStore, resolve, reject) => {
      const request = objectStore.clear();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }
  
  close() {
    this.#db.close();
  }

}
