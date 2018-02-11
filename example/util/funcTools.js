/**
 * @file Tools for dealing with functions that are missing from ES.
 * @author Tarek Khelif
 */

/** Takes a function and some of its arguments, and returns a copy of that
 * function that takes the remaining arguments and executes the original
 * function with the full set of arguments
 *
 * @param {Function} func Any function
 * @param {...*} args The first several arguments to `func`
 * @returns A function of the remaining arguments to `func`, which calls `func`
 *     with the fill set of arguments
 */
export function curry(func, ...args) {
    return (...remainingArgs) => func(...args, ...remainingArgs);
}
