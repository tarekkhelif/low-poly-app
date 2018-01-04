from generatePointsWithinOutline import *

############################### DATA GENERATION ###############################
from dataToFile import iterToCSV

def saveCSVOfOutline(svgFile):
    "Extracts coordinates of a polygon from an SVG and saves them as a CSV"
    outlineCoords = getOutlineFromFile(svgFile)
    iterToCSV(svgFile + "_outline", outlineCoords, ts=True)
    return outlineCoords

def saveCSVOfPointsWithinOutline(svgFile, num):
    """
    Extracts a polygon from an SVG, generates and saves *num* random points 
    within the polygon as a CSV.
    """
    outlineCoords = getOutlineFromFile(svgFile)
    randomPoints = getPointsInPolygon(outlineCoords, num)
    
    filename = "{}_points-inside_{}".format(svgFile, num)
    iterToCSV(filename, randomPoints, ts=True)
    return randomPoints