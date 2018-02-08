/**
 * @file Runs an prototype of a web app that helps users to quickly
 *     create low-poly graphics from a preexisting raster image.
 *     This prototype uses example data from file, and doesn't have any user
 *     interaction features.
 * @author Tarek Khelif
 */
import { LowPolyProject } from "./example/app.js";

const app = new LowPolyProject();
app.run();
