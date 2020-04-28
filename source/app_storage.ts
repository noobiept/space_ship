import { AppData } from "./shared/types";

/**
 * Calls the `callback` with a dictionary that has all the requested keys/values from `localStorage`.
 */
export function getData(
    keys: (keyof AppData)[],
    callback: (data: AppData) => void
) {
    const appData = keys.reduce<AppData>((data, key) => {
        const value = localStorage.getItem(key);

        return {
            ...data,
            [key]: value && JSON.parse(value),
        };
    }, {});

    callback(appData);
}

/**
 * Saves the given key/value into `localStorage`.
 */
export function setData(items: AppData) {
    for (let key in items) {
        if (items.hasOwnProperty(key)) {
            localStorage.setItem(
                key,
                JSON.stringify(items[key as keyof AppData])
            );
        }
    }
}
