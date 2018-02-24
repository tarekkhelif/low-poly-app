/**
 * @file Provides some geometry utilities that are missing from D3.
 * @author Tarek Khelif
 */

import * as d3 from "d3";

import { zip } from "./arrayTools.js";

/** Calculates the bounding box of an array of points in any number of
 *     dimensions.
 *
 * @param {number[][]} points An array of points. Each point is an array of
 *     numbers.
 * @returns {number[][]} An array of [max, min] pairs.
 */
export function getBBox(points) {
  const transposed = zip(...points);
  const box = transposed.map(crdArr => [
    Math.max(...crdArr),
    Math.min(...crdArr)
  ]);

  return box;
}

/** Generates a random point within a box.  The box can have any number of
 *     dimensions.
 *
 * @param {number[][]} box An array of [max, min] pairs, one for each dimension.
 * @returns {number[]} A point; [x, y].
 */
export function randPtInBox(box) {
  const randPt = box.map(([crdMax, crdMin]) => {
    const randCrd = crdMin + Math.random() * (crdMax - crdMin);
    return randCrd;
  });

  return randPt;
}

/** Generates a random point inside a polygon.
 *
 * @param {number[][]} polygon An array of points.  Each point is a pair of
 *     numbers.
 * @returns {number[]} A point; [x, y].
 */
export function randPtInPoly(polygon) {
  const bbox = getBBox(polygon);

  // Recursively generates random points in the polygon's bbox until one is
  //   found that's within the polygon
  function validPoint(polygon, bbox) {
    const candidate = randPtInBox(bbox);
    const winner = d3.polygonContains(polygon, candidate)
      ? candidate
      : validPoint(polygon, bbox);
    return winner;
  }

  return validPoint(polygon, bbox);
}
