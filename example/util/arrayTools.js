/**
 * @file Tools for dealing with arrays that are missing from ES.
 * @author Tarek Khelif
 */

/** Works like Python's `zip` function.
 *
 * @param {*} arr Arrays to zip together
 * @return A new array where the i-th element is a list of the i-th elements of
 *     the arrays passed to the function.
 */
export function zip(...arr) {
    // Find the length of the shortest argument
    const minLength = arr.reduce(
        (accum, curr) => Math.min(accum, curr.length),
        Infinity
    );

    // Zip together the arguments, up to the `minLength`-th element
    return Array(minLength)
        .fill()
        .map((_, i) => arr.map((element) => element[i]));
}
