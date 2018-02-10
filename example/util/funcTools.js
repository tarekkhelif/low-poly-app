/**
 * @file Tools for dealing with functions that are missing from ES.
 * @author Tarek Khelif
 */

export function curry(func, ...args) {
    return (...remainingArgs) => func(...args, ...remainingArgs);
}
