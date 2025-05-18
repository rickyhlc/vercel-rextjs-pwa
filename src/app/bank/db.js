export const CAT_LIST = ["HOUSING", "FOOD", "ENTERTAINMENT", "TRAFFIC", "HEALTH", "OTHERS"];

const DEFAULT_CAT_TYPE = {
    FOOD: ["FOOD", "SNACK", "OTHERS"],
    ENTERTAINMENT: ["SPORT", "GAME", "TRAVEL", "OTHERS"],
    TRAFFIC: ["TRAFFIC"],
    HEALTH: ["CLINIC", "OTHERS"],
    HOUSING: ["HOUSING", "OTHERS"],
    OTHERS: ["INSURANCE", "CLOTHES", "OTHERS"]
};

/**
 *
 * @returns {Promise<BankDB>} a promise that resolves to a BankDB instance
 * @description open the indexedDB and create the schema
 */
export const initDB = (a, data) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("BankDB", 3);
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      switch (event.oldVersion) {
        case 0: // dont have DB yet, create schema
          const costStore = db.createObjectStore("cost", { keyPath: 'id', autoIncrement: true });
          costStore.createIndex("byDate", "date");
        case 1:
          const typeStore = db.createObjectStore("catType");
          typeStore.put(DEFAULT_CAT_TYPE, "catTypeMap");
        case 2:
          db.deleteObjectStore("catType");
          const configStore = db.createObjectStore("config");
          configStore.put(DEFAULT_CAT_TYPE, "catTypeMap");
          const flagStore = db.createObjectStore("flag");
          flagStore.put("Regular", "REGULAR");
          flagStore.put("Special", "SPECIAL");
          flagStore.put("For others", "FOR_OTHER");
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
      callback(store, resolve, reject);
      if (readWrite) {
        transaction.commit();
      }
    });
  }

  /**
   * 
   * @param data (date, cat, type, value, desc)
   * @returns promise the new key
   * @description add a new cost type to the DB
   */
  addCost(data) {
    return this.#openObjectStore("cost", true, (objectStore, resolve, reject) => {
      const request = objectStore.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }
  /**
   * 
   * @param startDate timestamp
   * @param endDate timestamp
   * @returns promise
   * @description get all costs in the given date range
   */
  getCosts(startDate, endDate) {
    return this.#openObjectStore("cost", false, (objectStore, resolve, reject) => {
      const index = objectStore.index("byDate");
      const request = index.getAll(IDBKeyRange.bound(startDate, endDate, false, true));
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
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
   * @param data
   * @returns promise
   * @description update the cat type map
   */
  updateCatTypes(data) {
    return this.#openObjectStore("config", true, (objectStore, resolve, reject) => {
      const request = objectStore.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }
  /**
   * 
   * @returns promise
   * @description get all type of the given cat
   */
  getCatTypes() {
    return this.#openObjectStore("config", false, (objectStore, resolve, reject) => {
      const request = objectStore.get("catTypeMap");
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }

  close() {
    this.#db.close();
  }
}
