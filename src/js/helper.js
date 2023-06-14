import { Client, Databases, Storage, Account } from 'appwrite';
import { getDevice } from 'framework7';
import { v4 } from 'uuid';
const device = getDevice();
export const isMobile = device.ios || device.android;
import UIAvatarSvg from 'ui-avatar-svg';
import { Preferences } from '@capacitor/preferences';
import { Share } from '@capacitor/share';
import isEmpty from 'just-is-empty';
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
            if (prop in obj) {
                obj[prop] = JSON.stringify(JSON.stringify(obj[prop]));
            }
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
    generateAvatar(name, size = 42) {
        const bgColor = this.generateRandomHexColor();
        const svg = new UIAvatarSvg()
            .text(this.getUserNameInitials(name))
            .size(size)
            .round(true)
            .fontWeight(600)
            .bgColor(bgColor)
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
    isSame(userId, currentUserId) {
        return userId === currentUserId;
    }
    convertTime(time = { hours: 0, minutes: 0 }) {
        return +time.minutes + +time.hours * 60;
    }
    generateRandomHexColor(contrast = 'average') {
        // Function to generate a random hex digit
        function getRandomHexDigit() {
            const hexDigits = '0123456789ABCDEF';
            return hexDigits[Math.floor(Math.random() * 16)];
        }

        // Generate a random hex color
        function generateHexColor() {
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += getRandomHexDigit();
            }
            return color;
        }

        // Check contrast level and adjust color if necessary
        function adjustContrast(color) {
            // Get RGB components from hex color
            const red = parseInt(color.slice(1, 3), 16);
            const green = parseInt(color.slice(3, 5), 16);
            const blue = parseInt(color.slice(5), 16);

            // Calculate relative luminance based on ITU-R BT.709 formula
            const luminance =
                (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

            // Determine contrast threshold based on desired contrast level
            const threshold = contrast === 'high' ? 0.2 : 0.5;

            // Adjust color if luminance is below threshold
            if (luminance < threshold) {
                return adjustContrast(generateHexColor());
            }

            return color;
        }

        // Generate initial hex color and adjust contrast if necessary
        let hexColor = generateHexColor();
        if (contrast !== 'average') {
            hexColor = adjustContrast(hexColor);
        }

        return hexColor;
    }

    get mainURL() {
        const port = !isEmpty(window.location.port)
            ? ':' + window.location.port
            : '';
        const mainURL =
            window.location.protocol + '//' + window.location.hostname + port;
        return mainURL;
    }

    handleShare({ title = 'Share this', text = '', path } = {}) {
        const { mainURL } = this;

        const url = mainURL + '/' + path;
        console.log(mainURL, url);
        return Share.share({
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
