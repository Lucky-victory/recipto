import { Client, Databases, Storage, Account } from 'appwrite';
import { getDevice } from 'framework7';
import { v4 } from 'uuid';
const device = getDevice();
export const isMobile = device.ios || device.android;
import UIAvatarSvg from 'ui-avatar-svg';
import { Preferences } from '@capacitor/preferences';
import { Share } from '@capacitor/share';
export const envConfig = {
    PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    BUCKET_ID: import.meta.env.VITE_APPWRITE_BUCKET_ID,
    DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    POST_COLLECTION_ID: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
    RECIPE_COLLECTION_ID: import.meta.env.VITE_APPWRITE_RECIPE_COLLECTION_ID,
    SAVED_RECIPE_COLLECTION_ID: import.meta.env.VITE_APPWRITE_SAVED_RECIPE_ID,
};
export const storageKeys = {
    USER: 'rt_user',
};
class Utils {
    deSerialize(obj = {}, props = ['user', 'recipe']) {
        for (const prop of props) {
            obj[prop] = JSON.parse(JSON.parse(obj[prop]));
        }
        return obj;
    }
    serialize(obj = {}, props = ['user', 'recipe']) {
        for (const prop of props) {
            obj[prop] = JSON.stringify(JSON.stringify(obj[prop]));
        }
        return obj;
    }
    getUserNameInitials(name = '') {
        let initials = '';
        const [fName, lName] = name.split(' ');

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
            .fontWeight(600)
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
    convertTime(time = { hours: 0, minutes: 0 }) {
        return +time.minutes + +time.hours * 60;
    }
    async handleShare({ title = '', text = '', path } = {}) {
        const url = window.location.href + '/' + path;
        return await Share.share({
            text,
            title,
            url,
            dialogTitle: 'Share',
        });
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

export class AppStorage {
    static async get(key) {
        return JSON.parse((await Preferences.get({ key })).value || '{}');
    }
    static async set(key, value) {
        return await Preferences.set({ key, value: JSON.stringify(value) });
    }
    static async remove(key) {
        return await Preferences.remove({ key });
    }
    static async clear() {
        return await Preferences.clear();
    }
}
