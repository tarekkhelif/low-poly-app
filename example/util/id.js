/**
 * @file Tools for dealing with arrays that are missing from ES.
 * @author Tarek Khelif
 */

/** Produces a unique ID by incremeting a counter.  Optionally namespaced by a
 *    prefix.
 */
export class IncrementalId {
    constructor(prefix = "") {
        this.prefix = prefix === "" ? prefix : `${prefix}-`;
        this.count = 0;
    }

    newId() {
        this.count += 1;
        return `${this.prefix}${this.count}`;
    }
}
