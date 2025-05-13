export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("BankDB");
        request.onupgradeneeded = function(event) {
            if (event.oldVersion == 0) { // dont have DB yet, create schema
                const db = event.target.result;
                const store = db.createObjectStore("cost", {keyPath: 'id', autoIncrement: true});
                // const catIndex = store.createIndex("byCat", "cat");
                // const typeIndex = store.createIndex("byType", "type");
                const dateIndex = store.createIndex("byDate", "date");
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

export const CAT_LIST = ["HOUSING", "FOOD", "ENTERTAINMENT", "TRAFFIC", "INCOME", "OTHERS"];

class BankDB {
    #db;

    constructor(db) {
      this.#db = db;
    }

    #openObjectStore(readWrite, callback) {
        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction("cost", readWrite ? "readwrite" : "readonly");
            const cost = transaction.objectStore("cost");
            callback(cost, resolve, reject);
            if (readWrite) {
                transaction.commit();
            }
        });
    }

    addCost(data) {
        return this.#openObjectStore(true, (objectStore, resolve, reject) => {
            const request = objectStore.add(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event);
        });
    }
    getCosts(startDate, endDate) {
        return this.#openObjectStore(false, (objectStore, resolve, reject) => {
            const index = objectStore.index("byDate");
            const request = index.getAll(IDBKeyRange.bound(startDate, endDate, false, true));
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event);
        });
    }
    deleteCost(id) {
        return this.#openObjectStore(true, (objectStore, resolve, reject) => {
            const request = objectStore.delete(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event);
        });
    }
    close() {
        this.#db.close();
    }
}
