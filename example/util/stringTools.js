/**
 * @file Tools for dealing with strings that are missing from ES.
 * @author Tarek Khelif
 */

/** Maps a whitespace-separated string to camelCase
 *
 * @param {String} str A whitespace-separated string
 * @returns {String} `str` converted to camelCase
 */
export function camelize(str) {
    const words = str.split(/\s+/);
    const camel = words
        .map((word, i) => {
            const firstLetter =
                i === 0 ? word[0].toLowerCase() : word[0].toUpperCase();
            return firstLetter + word.slice(1);
        })
        .join("");
    return camel;
}
