export const CAT_LIST = ["TRAFFIC", "FOOD", "ENTERTAINMENT", "HEALTH", "HOUSING", "OTHERS"];

const DEFAULT_CAT_TYPE = {
    FOOD: ["FOOD", "SNACK", "OTHERS"],
    ENTERTAINMENT: ["SPORT", "GAME", "TRAVEL", "OTHERS"],
    TRAFFIC: ["TRAFFIC"],
    HEALTH: ["CLINIC", "OTHERS"],
    HOUSING: ["HOUSING", "OTHERS"],
    OTHERS: ["INSURANCE", "CLOTHES", "OTHERS"]
};

const DEFAULT_FLAG_LIST = [
  { id: "REGULAR", name: "Regular" },
  { id: "SPECIAL", name: "Special" },
  { id: "INCOME", name: "Income" },
  { id: "FOR_OTHER",name: "For others" }
];

/**
 *
 * @returns {Promise<BankDB>} a promise that resolves to a BankDB instance
 * @description open the indexedDB and create the schema
 */
export const initDB = (a, data) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("BankDB", 4);
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
        case 3:
          if (db.objectStoreNames.contains("catType")) {
            db.deleteObjectStore("catType");
          } else if (db.objectStoreNames.contains("config")) {
            db.deleteObjectStore("config");
          }
          const configStore = db.createObjectStore("config");
          configStore.put(DEFAULT_CAT_TYPE, "catTypeMap");
          configStore.put(DEFAULT_FLAG_LIST, "flagList");
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
   * @param datas [(id[update], date, cat, type, value, desc)]
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
   * @param startDate timestamp
   * @param endDate timestamp
   * @returns promise
   * @description get all costs in the given date range
   */
  getCosts(startDate, endDate) {
    return this.#openObjectStore("cost", false, (objectStore, resolve, reject) => {
      const index = objectStore.index("byDate");
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
      const request = index.getAll(query);
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

  /**
   * 
   * @param data
   * @returns promise
   * @description update the cat type map
   */
  updateCatTypes(data) {
    return this.#openObjectStore("config", true, (objectStore, resolve, reject) => {
      const request = objectStore.put(data, "catTypeMap");
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

  /**
   * 
   * @param data
   * @returns promise
   * @description update the flag list
   */
    updateFlags(data) {
      return this.#openObjectStore("config", true, (objectStore, resolve, reject) => {
        const request = objectStore.put(data, "flagList");
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event);
      });
    }
  /**
   * 
   * @returns promise
   * @description get all flags
   */
  getFlags() {
    return this.#openObjectStore("config", false, (objectStore, resolve, reject) => {
      const request = objectStore.get("flagList");
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event);
    });
  }

  close() {
    this.#db.close();
  }
}
