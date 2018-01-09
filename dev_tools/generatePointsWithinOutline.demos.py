import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon

from generatePointsWithinOutline import *

################################## PLOTTING ##################################
def plotPolygon(polygonCoords):
    """
    Plots a nicely-framed polygon.

    :param polygonCoords: Coordinates defining a polygon
    :type polygonCoords: np.array(list(list))
    :return: The figure and axes
    :rtype: (matplotlib.figure.Figure, matplotlib.axes._subplots.AxesSubplot)
    """
    # Create figure
    randId = np.random.randint(0, 10**6)
    fig = plt.figure(randId, figsize=(8, 6))
    ax = fig.add_subplot(111)
    ax.set_aspect('equal')

    # Add polygon to plot
    polygon = Polygon(polygonCoords, facecolor="green", edgecolor="black")
    ax.add_patch(polygon)
    
    # Set axes limits
    buff = 0.05 # Whitespace buffer as a fraction of the polygon's bbox
    (minx, miny), (maxx, maxy) = get_bbox(polygon.get_xy())
    width = maxx - minx
    height = maxy - miny
    ax.set_xlim(minx - width  * buff, maxx + width  * buff)
    ax.set_ylim(miny - height * buff, maxy + height * buff)
    
    return fig, ax

#################################### DEMOS ####################################
def demoPlotPolygon():
    outlineCoords = getOutlineFromFile("../dev_data/nw_outline.svg")
    plotPolygon(outlineCoords)

def demoGetPointsInPolygon():
    # Get a polygon
    outlineCoords = getOutlineFromFile("../dev_data/nw_outline.svg")
    fig, ax = plotPolygon(outlineCoords)
    
    # Plot some points within the polygon
    points = getPointsInPolygon(outlineCoords, 100)
    xs, ys = zip(*points)
    ax.plot(xs, ys, 'o')

    return fig, ax, points