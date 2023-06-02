import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private memoryStore: { [key: string]: any } = {};
    private readonly useLocalStorage: boolean = false;
    private _prefix: string = '';

    get prefix() {
        return this._prefix;
    }

    set prefix(prefix: string) {
        this._prefix = prefix ? prefix + '_' : '';
    }

    constructor() {
        this.useLocalStorage = this.storageAvailable('localStorage');
    }

    /**
     * Gets an item.
     *
     * @param key Key to identify the item
     * @returns The item (if any) retrieved by the key
     */
    getItem(key: string): string | null {
        if (this.useLocalStorage) {
            return localStorage.getItem(this.prefix + key);
        } else {
            return this.memoryStore.hasOwnProperty(this.prefix + key) ? this.memoryStore[this.prefix + key] : null;
        }
    }

    /**
     * Stores an item
     *
     * @param key Key to identify the item
     * @param data Data to store
     */
    setItem(key: string, data: string) {
        if (this.useLocalStorage) {
            localStorage.setItem(this.prefix + key, data);
        } else {
            this.memoryStore[this.prefix + key] = data.toString();
        }
    }

    /** Removes all currently stored items. */
    clear() {
        if (this.useLocalStorage) {
            localStorage.clear();
        } else {
            this.memoryStore = {};
        }
    }

    /**
     * Removes a single item.
     *
     * @param key Key to identify the item
     */
    removeItem(key: string) {
        if (this.useLocalStorage) {
            localStorage.removeItem(this.prefix + key);
        } else {
            delete this.memoryStore[this.prefix + key];
        }
    }

    /**
     * Is any item currently stored under `key`?
     *
     * @param key Key identifying item to check
     * @returns True if key retrieves an item, false otherwise
     */
    hasItem(key: string): boolean {
        if (this.useLocalStorage) {
            return localStorage.getItem(this.prefix + key) ? true : false;
        } else {
            return this.memoryStore.hasOwnProperty(key);
        }
    }

    private storageAvailable(type: string): boolean {
        try {
            const storage = window[type as any] as unknown as Storage;
            const key = '__storage_test__';
            storage.setItem(key, key);
            storage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }
}
