/**
 * @file Tools for dealing with arrays that are missing from ES.
 * @author Tarek Khelif
 */

/** Works like Python's `zip` function.
 *
 * @param {...Array} arr Arrays to zip together
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

/** Pairs off elements of an array.
 *
 * The first element is partner of the last, i.e.
 *     >>> pairs([1, 2, 3, 4, 5])
 *     [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]]
 * @param {Array}
 * @returns {Array[]}
 */
export function pairs(arr) {
    const shifted = arr.slice();
    const first = shifted.shift();
    shifted.push(first);

    return zip(arr, shifted);
}

/** Compares two arrays.  Returns true iff all elements are identical.
 *
 * @param {Array} a An array.
 * @param {Array} b An array.
 * @return {boolean} Whether or not the arrays are equal.
 */
export function arrayEquals(a, b) {
    if (!(a instanceof Array && b instanceof Array)) {
        throw new TypeError("Both arguments must be `Array`s");
    }
    const equality =
        a.length === b.length ? a.every((_, i) => a[i] === b[i]) : false;

    return equality;
}

/** Checks if an array `item` is identical to any arrays contained within
 * `container`.  If it is, returns the array from `container`, otherwise,
 * returns `item`
 *
 * NOTE: THIS ONLY WORKS FOR **ARRAYS OF ARRAYS**.  ARRAYS OF ANYTHING ELSE
 * NEED NOT APPLY.
 *
 * "Identical-ness" is determined shallowly; it compares the elements of `item`
 * to the elements of the constituents of `container`
 *
 * @param {Array} item
 * @param {Array[]} container
 * @returns {Array} `item`, if an identical version does not already exist in
 *   `container`, otherwise the pre-existing version from `container`
 */
export function addIfUnique(item, container) {
    // Check that `item` is an array
    if (!(item instanceof Array)) {
        throw TypeError("item must be an array");
    }

    // Find any duplicate(s) in `container`.
    const duplicates = container.filter((e) => arrayEquals(item, e));

    // Find the unique version of `item`, whether it be `item` or an already
    //   existing element of `container`
    let unique;
    switch (duplicates.length) {
        // Add `item` to `container` if an array identical to `item` does not
        //   already exist.  Prepare to return `null`.
        case 0:
            container.push(item);
            unique = item;
            break;
        // If `item` is identical to an existing array, prepare to return the
        //   version already in `container`
        case 1:
            unique = duplicates[0];
            break;
        // If `item` don't match zero or one of the existing elements of
        //   `container`, throw an error
        default: {
            /* eslint-disable no-console */
            console.log("item", item);
            console.log("container", container);
            console.log("duplicates", duplicates);
            /* eslint-enable no-console */
            throw new Error(`\`item\` must occur only once in \`container\`,
                not ${duplicates.length} times`);
        }
    }

    return unique;
}
