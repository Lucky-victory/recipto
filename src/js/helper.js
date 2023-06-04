import { Client, Databases, Storage, Account } from 'appwrite';
import { getDevice } from 'framework7';
import { v4 } from 'uuid';
const device = getDevice();
export const isMobile = device.ios || device.android;

class Utils {
    genID(prefix = '', dashes = true) {
        const id = dashes ? v4() : v4().replace(/[-]/g, '');
        return prefix + id;
    }
    get currentDate() {
        return new Date();
    }
}
export const utils = new Utils();
export class AppWriteHandler {
    constructor() {
        this.client = new Client();

        this.appStorage = new Storage(this.client);
        this.appDatabases = new Databases(this.client);
        this.appAccount = new Account(this.client);
        this.client
            .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
            .setProject('vick_recipto_2023'); // Your project ID
    }
    get storage() {
        return this.appStorage;
    }
    get databases() {
        return this.appDatabases;
    }
    get account() {
        return this.appAccount;
    }
}

export const appwriteHandler = new AppWriteHandler();
