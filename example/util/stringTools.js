/**
 * @file Tools for dealing with strings that are missing from ES.
 * @author Tarek Khelif
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
