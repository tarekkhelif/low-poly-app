# Imports available to inkscape
from __future__ import print_function, division
import numpy as np
from copy import copy
import re
import io
import os
import base64

from lxml import etree
from PIL import Image
# Only used for testing here
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as PolygonPatch

from inkex import addNS # Only uses addNS. Could be copied here instead.
from simplestyle import parseStyle, formatStyle
from tkgeo import Polygon, Point

######################## SVG PARSING TOOLS ########################
def imnode2pil(imnode):
    """
    Converts an image imbedded in an svg file to a PIL image object.
    
    :type imagenode: lxml.etree._Element
    """
    xlink = imnode.get(addNS('href','xlink'))
    if xlink[:4] == 'data':
        comma = xlink.find(',')
        if comma > 0:
            data = base64.decodestring(xlink[comma:])
            buf = io.BytesIO(data)
            image = Image.open(buf)
            return image
    
    raise Exception("%s is not recognized as an image node.")
                
def extractPaths(svgTree):
    """
    Extracts all the paths in an svg file and returns a list of paths.
    
    Paths are represented as a list of subpaths, where each subpath is a is of 
    tuples representing absolute coordinates.
    
    :type svgTree: lxml.etree._ElementTree
    """
    pathnodes = svgTree.findall('.//' + addNS('path','svg'))
    
    paths = []
    for pathnode in pathnodes:
        pathstr = pathnode.get('d')
        pathCoords = path2coords(pathstr)
        paths += [pathCoords]
        
    return paths
        
def path2coords(svgPath):
    """
    Converts a string containing an svg representation of a path into absolute 
    coordinates.
    
    Returns a list of subpaths, where each subpath is a list of 2-tuples 
    representing coordinates.
    
    Only recognizes svg commands m, z, l, v, h (and their capitalized counterparts).
    
    TODO: (1) detect and handle errors 
          (2) add other svg commands 
          (3) reimplement more reliably
    """
    elementPattern = r'(?:-?\d+(?:\.\d+)?)|[A-Za-z]'
    numberPattern = r'-?\d+(?:\.\d+)?'
    matches = re.findall(elementPattern, svgPath)
    
    subpaths = []
    empty = []
    
    # Only go through the matches if the first one is an 'm' or 'M'
    e = matches[0]
    if e.lower() == 'm':
        # Initialize
        connectionMode = e.lower()
        absoluteMode = e.islower()
        currentx, currenty = 0, 0
        startx, starty = 0, 0
        coords = copy(empty)
        subpaths.append(coords)
        startx = currentx*absoluteMode + float(matches[1])
        starty = currenty*absoluteMode + float(matches[2])
        currentx, currenty = startx, starty
        coords.append((currentx, currenty))
        connectionMode = 'l'
        i = 3
        
        # Loop through matches
        while i < len(matches):
            e = matches[i]
            
            # If e is a recognized letter, update the mode.
            if e.lower() in 'mzlvh':
                connectionMode = e.lower()
                absoluteMode = e.islower()
                i += 1
                
                if connectionMode == 'z':
                    # Close subpath
                    currentx, currenty = startx, starty
                    coords.append((currentx, currenty))
                    # Terminate subpath and open a new one 
                    coords = copy(empty)
                    subpaths.append(coords)
            
            # If e is a number, process it according to the current mode
            elif re.match(numberPattern, e):
                e = float(e)
                if connectionMode == 'm':
                    if not coords == empty:
                        coords = copy(empty)
                        subpaths.append(coords)
                    startx = currentx*absoluteMode + float(matches[i])
                    starty = currenty*absoluteMode + float(matches[i+1])
                    currentx, currenty = startx, starty
                    connectionMode = 'l'
                    i += 2
                elif connectionMode == 'l':
                    currentx = currentx*absoluteMode + float(matches[i])
                    currenty = currenty*absoluteMode + float(matches[i+1])
                    i += 2
                elif connectionMode == 'h':
                    currentx = currentx*absoluteMode + float(matches[i])
                    i += 1
                elif connectionMode == 'v':
                    currenty = currenty*absoluteMode + float(matches[i])
                    i += 1
            
                coords.append((currentx, currenty))

                
            # Unrecognized thing
            else:
                break
            
    while subpaths[-1] == empty:
        subpaths.pop()
            
    return subpaths

######################## COLOR SAMPLERS ########################
def gridSample(tile, pilImagePx, minPoints=15):
    """
    Creates a grid of points in the bounding box of shTile.  Returns the 
    average color of the grid points that fall within tile.
    
    If fewer than minPoints grid points fall within tile, random points are 
    sampled until at least minPoints have been sampled.
    
    :return: np.array([r, g, b], a]) in range [0., 255.]
    """
    # Get sample points
    numx, numy = 5, 5
    minx, miny, maxx, maxy = tile.bounds
    xs = np.linspace(minx, maxx, numx)
    ys = np.linspace(miny, maxy, numy)
    grid = [(x, y) for x in xs for y in ys]
    samplePoints = [point for point in grid if tile.contains(Point(point))]
    
    # Avoid situation where none of the grid points fall within the polygon
    # by supplementing samplePoints with random points
    deficit = minPoints - len(samplePoints)
    samplePoints += randPoints(tile, deficit)
    
    # Get average color at sample points
    sampleColors = [pilImagePx[point] for point in samplePoints]
    repCol = np.mean(sampleColors, 0)
    
    return repCol
    
def randomSample(tile, pilImagePx, numSamples=15):
    """
    Finds numSamples random points within tile, and returns the average color 
    of those points in pilImagePx.
    
    :return: np.array([r, g, b], a]) in range [0., 255.]
    """
    samplecols = [pilImagePx[point] for point in randPoints(tile, numSamples)]
    repCol = np.mean(samplecols, 0)
    return repCol

def averageSample(tile, pilImagePx, dx=1):
    """
    Uses numerical integration to find the average color of pilImagePx within 
    the region defined by tile.
    """
    raise Exception("Not implemented yet.")
    
######################## HELPER FUNCTIONS ########################
def randPoints(region, num=1):
    """
    Generates num random points within region of R^2.
    """
    # Ensure num >= 0
    if num < 0: raise ValueError("num must be nonzero.")
    
    # Find bounding box
    minx, miny, maxx, maxy = region.bounds
    boxSize = np.array([maxx - minx, maxy - miny])
    boxCorner = np.array([minx, miny])
    
    # Generate random sample points
    randomPoints = []
    while len(randomPoints) <= num:
        randTuple = np.random.random(2)
        randomPoint = randTuple * boxSize + boxCorner
        if region.contains(Point(randomPoint)):
            randomPoints += [tuple(randomPoint)]
            
    return randomPoints

def rgba2hex(rgba):
    """
    Converts an rgb(a) color in range [0, 255] to a hex color.
    
    :type rbga: tuple
    """
    hexColor = '#' + ''.join('{:02x}'.format(v) for v in np.rint(rgba).astype(int))
    return hexColor

def setPathColor(pathNode, rgbaColor):
    "Sets pathNode's fill and opacity according to rgbaColor."
    hexColor = rgba2hex(rgbaColor)
    
    styleStr = pathNode.get('style')
    styleDict = parseStyle(styleStr)
    styleDict['fill'] = styleDict['stroke'] = hexColor[:7]
    if len(rgbaColor) == 4: 
        styleDict['fill-opacity'] = styleDict['stroke-opacity'] = rgbaColor[3]/255
    newStyle = formatStyle(styleDict)
    pathNode.set('style', newStyle)

######################## TESTING ########################
def test(chosenSampler='random', saveSVG=False):
    # Select from available sampler function
    samplers = {'grid' : gridSample, 
                'random' : randomSample, 
                'integral' : averageSample}
    sampler = samplers[chosenSampler]
    
    # Access SVG
    filename = 'img and tiles.svg'
    svgTree = etree.parse(filename)
    
    # Prepare image data ## realversion: get the image in the list of selected items
    imNode = svgTree.findall('.//' + addNS('image','svg'))[0]
    image = imnode2pil(imNode)
    pixels = image.load()
    imNodeWidth, imNodeHeight = float(imNode.get('width')), float(imNode.get('height'))
    imNodeX, imNodeY = float(imNode.get('x')), float(imNode.get('y'))
    scaleFactor = np.array([imNodeWidth/image.width, imNodeHeight/image.height])
    translation = np.array([imNodeX, imNodeY])
    
    
    # Get all path nodes ## realversion: get the paths in the list of selected items
    tileNodes = svgTree.findall('.//' + addNS('path','svg'))
    
    # Prepare matplotlib figure
    randId = np.random.randint(1, 10**6)
    fig = plt.figure(randId, figsize=(8, 6))
    ax = fig.add_subplot(111)
    ax.set_aspect('equal')
    ax.imshow(image)
    
    # Color tiles
    for tileNode in tileNodes:
        # Extract svg path data and get into useable form
        tileStr = tileNode.get('d')
        
        # path2coords returns a list of subpaths, which probably only have 1 element
        subpaths = path2coords(tileStr)
        for tileCoords in subpaths:
            tileCoords = (tileCoords-translation)/scaleFactor
            tilePoly = Polygon(tileCoords)
            
            # Find and set tile's color
            representativeColor = sampler(tilePoly, pixels)
            setPathColor(tileNode, representativeColor)
            
            # Add to plot
            patch = PolygonPatch(tilePoly, facecolor=representativeColor/255, 
                                           edgecolor=representativeColor/255)
            ax.add_patch(patch)
        
    if saveSVG:
        svgTree.write('colored-Tiles-v0_3_1-{}.svg'.format(randId), pretty_print=True)

    return svgTree, imNode, image, pixels, tileNodes, translation, randId, fig, ax