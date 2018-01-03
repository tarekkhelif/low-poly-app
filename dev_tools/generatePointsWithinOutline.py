"""
TODO: Conform to conventions; specifically naming, docstring, etc.
"""


import numpy as np
from lxml import etree
import matplotlib.pyplot as plt

from from_py_project.v0_3_1m import extractPaths
import shapely.geometry as sh
from descartes.patch import PolygonPatch

#################################### LOGIC ####################################
# A helper function
def makeCoordsPositive(coords):
    """
    Translates *coords* into the positive quadrant

    :param coords: A list of coordinates
    :type coords: list(tuple)

    :return: The same list of coordates, translated into the positive quadrant
    :rtype: list(tuple)
    """
    coords = np.array(coords)
    mins = np.array([min(coord) for coord in zip(*coords)])
    translation = (-1)*np.array([min(minCoord, 0) for minCoord in mins])
    coords += translation
    return coords

def getOutlineFromFile(svgFile):
    """
    Produce a polygon from an SVG file.
    
    The *svgFile* should contain exactly one closed path with one exactly subpath.
    
    The coordinates are transformed so that the path is in the positive 
    quadrant and oriented in the right direction. (The svgFile is assumed to be 
    from Inkscape, which has the y-axis in the opposite orientation as usual.)

    :param svgFile: An SVG file containing one closed path
    :type svgFile: str
    :return: Coordinates of the path in the *svgFile*
    :rtype: np.array(list(list))
    """
    
    # Get polygon data
    svgTree = etree.parse(svgFile)
    paths = np.array(extractPaths(svgTree)) # list of lists of lists of tuples
    assert len(paths) == 1, "svgFile should contain exactly 1 path, not {}".format(len(paths))
    subpaths = paths[0]
    assert len(subpaths) == 1, ("svgFile should contain exactly 1 subpath in "
              "exactly 1 path, not {} in exactly 1 path").format(len(subpaths))
    outlineCoords = subpaths[0]
    
    # Adjust polygon position
    outlineCoords *= (1, -1) # Flip vertically to account for inkscape's unconventional axes
    outlineCoords = makeCoordsPositive(outlineCoords) # Move to positive quadrant
    
    return outlineCoords

def getPointsInPolygon(polygonCoords, num=25):
    """
    Find *num* random points within a polygon

    :param polygonCoords: Coordinates defining a polygon
    :type polygonCoords: np.array(list(list))
    :param num: The desired number of points
    :type num: int
    
    :return: A list of points
    :rtype: list(tuple)
    """
    # Ensure *num* is positive
    if num <= 0: raise ValueError("num must be positive, not {}.".format(num))
    
    # Create Shapely object from polygonCoords
    polygon = sh.Polygon(polygonCoords)
    
    # Find bounding box
    minx, miny, maxx, maxy = polygon.bounds
    boxSize = np.array([maxx - minx, maxy - miny])
    boxCorner = np.array([minx, miny])
    
    # Generate random points within bbox until you have *num* within *polygon*
    #
    #'''  <--- Removing/Adding a # from/to this line toggles the two implementations.
    #
    ### I tried to do this in a "numpy-thonic" way by starting with a numpy 
    ### array of the right size/shape, and then operating on it, as opposed to 
    ### gradually building up an array by adding to the end.  My original 
    ### implementation was roughly "while len(validPoints) < num, generate 
    ### random points and append to validPoints if valid"
    ### 
    ###       num    original > orig-REV    numpy-thonic      diff
    ###       250     53.5 ms    45.1 ms         44.5 ms    16.8 % > 1.33 %
    ###     25000     4.58  s                    4.49  s    2.00 %
    ###
    ### The numpy-thonic version is faster, though a 10 ms difference doesn't matter practically
    ### REVISION: In the original implementation, leaving *validPoints* as 
    ### list(np.array()) rather than casting to list(tuple) reduces the 
    ### "numpy-thonic" implementation's advantage to ~1%.
    def makeInside(point):
        """
        Check if a point is inside *polygon*.  If not, recursively generate 
        points until you get one that is.
        """
        if not polygon.contains(sh.Point(point)):
            newPoint = np.random.random(2) * boxSize + boxCorner
            point = makeInside(newPoint)
        return point
    
    randPoints = np.random.random((num, 2)) * boxSize + boxCorner
    validPoints = np.apply_along_axis(makeInside, 1, randPoints)
    
    return validPoints
    '''
    # Original implementation
    validPoints = []
    while len(validPoints) < num:
        randomPoint = np.random.random(2) * boxSize + boxCorner
        if polygon.contains(sh.Point(randomPoint)):
            validPoints += [randomPoint] # <--- do tuple(randomPoint) here for pre-revised version
    
    return validPoints
    #'''