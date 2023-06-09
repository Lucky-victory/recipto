import { Client, Databases, Storage, Account } from 'appwrite';
import { getDevice } from 'framework7';
import { v4 } from 'uuid';
const device = getDevice();
export const isMobile = device.ios || device.android;
import UIAvatarSvg from 'ui-avatar-svg';
export const envConfig = {
    PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    BUCKET_ID: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};
export const storageKeys={
    USER:'rt_user'
}
class Utils {
    getUserNameInitials(name = '') {
        let initials = '';
        const [fName, lName] = name.split(' ');
        console.log({ lName, fName });
        if (fName?.length && lName?.length) {
            initials = (fName.charAt(0) + lName.charAt(0)).toUpperCase();
        } else {
            initials = fName.slice(0, 2).toUpperCase();
        }
        return initials;
    }
    generateAvatar(name) {
        const svg = new UIAvatarSvg()
            .text(this.getUserNameInitials(name))
            .size(42)
            .round(true)
            .bgColor('var(--f7-ios-surface-2)')
            .generate();
        return svg;
    }
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
            .setProject(envConfig.PROJECT_ID || 'vick_recipto_2023'); // Your project ID
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
