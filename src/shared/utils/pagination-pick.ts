/**
 * Picks specified keys from an object and returns a new object containing only those keys.
 *
 * @template T - The type of the source object.
 * @template K - The keys to pick from the source object.
 * @param {T} obj - The source object from which keys are to be picked.
 * @param {K[]} keys - An array of keys to pick from the source object.
 * @returns {Partial<T>} A new object containing only the picked keys.
 *
 * @example
 * const source = { a: 1, b: 2, c: 3 };
 * const picked = paginationPick(source, ['a', 'c']);
 * console.log(picked); // { a: 1, c: 3 }
 */

const paginationPick = <T extends Record<string, unknown>, k extends keyof T>(
    obj: T,
    keys: k[],
): Partial<T> => {
    const finalObj: Partial<T> = {};

    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
};

export default paginationPick;
