from __future__ import division, print_function
import numpy as np

###############################################################################
#### GEOMETRICAL OBJECTS                                                   ####
###############################################################################

class Point(object):
    """
    A point in R^2
    """
    def __init__(self, tup):
        if not len(tup): 
            raise Exception("Input must be a sequence of length 2.")
        self.x, self.y = tup
        
    def __repr__(self):
        return 'Point({}, {})'.format(self.x, self.y)
    
    def __eq__(self, p2):
        return self.x == p2.x and self.y == p2.y
    
    def __ne__(self, p2):
        return not self.__eq__(p2)
    
class Interval(object):
    """
    An interval in R^1.
    """
    def __init__(self, a, b):
        self.a = a
        self.b = b
        
        self.size = b - a
        
    def includes(self, x):
        return self.a <= x <= self.b or self.b <= x <= self.a
    
    def overlaps(self, int2):
        return self.includes(int2.a) or self.includes(int2.b)
        
    
class Segment(object):
    """
    A line segement in R^2
    
    Holds two Points.  Points must be different.  Has a defined direction.
    """
    
    def __init__(self, p1, p2):
        # Convert inputs to point objects if necessary
        p1, p2 = (p if isinstance(p, Point) else Point(p) for p in (p1, p2))
        
        assert p1 != p2, "A Segment must contain more than one point."
        
        self.p1 = p1
        self.p2 = p2
        
    def __repr__(self):
        return 'Segment({}, {})'.format(self.p1, self.p2)
    
    def __eq__(self, seg2):
        return self.p1 == seg2.p1 and self.p2 == seg2.p2
    
    def __ne__(self, seg2):
        return not self.__eq__(seg2)
    
    def intersects(self, seg2):
        """
        Determines whether or not this segment intersects another.
        
        All endpoints treated as exclusive.
        
        Method:
            Checks if the line through seg1 intersects seg2 by determining if the 
            points of seg2 both lie on the same side of the line.  This is 
            determined by comparing the orientation of the points of seg1 with 
            each of the points of seg2.  If both points of seg2 give the same 
            orientation, then seg2 lies entirely on one side of line 1.
            
            It is possible that seg2 might intersect *line1* but not seg1, because 
            the intersection point may be beyond the extent of seg1.  In shuch a 
            case, seg1 lies entirely on one side of the line though seg2, so we do 
            the same calculation with the roles of seg1 and seg2 switched; checking 
            if the line though seg2 intersects seg2.
        """
        
        s2p1sideOfL1 = orientation(self.p1, self.p2, seg2.p1)
        s2p2sideOfL1 = orientation(self.p1, self.p2, seg2.p2)
        s1p1sideOfL2 = orientation(seg2.p1, seg2.p2, self.p1)
        s1p2sideOfL2 = orientation(seg2.p1, seg2.p2, self.p2)
        
        # Always excluding endpoints, segments only intersect when the the 
        # points of one segment straddle the line through the other segment, 
        # and vice versa
        return s2p1sideOfL1*s2p2sideOfL1 == s1p1sideOfL2*s1p2sideOfL2 == -1
        
        """"
        # This version treats enpoints as inclusive.
        
        orientations = [s2p1sideOfL1, s2p2sideOfL1, s1p1sideOfL2, s1p2sideOfL2]
        numCollinearities = len([o for o in orientations if o == 0])
        
        if numCollinearities == 0: # 0 zeros
            # No end points lie on either line.  Segments intersect iff each 
            # segment straddles the line through the other segment.
            result = s2p1sideOfL1 != s2p2sideOfL1 and s1p1sideOfL2 != s1p2sideOfL2
        elif numCollinearities == 4: # 4 zeros
            # Segments are collinear
            seg1Int = Interval(self.p1.x, self.p2.x)
            seg2Int = Interval(seg2.p1.x, seg2.p2.x)
            # Since the segments are collinear, their x intervals should either
            # both be nonzero or both be zero.
            assert (seg1Int.size != 0 and seg2Int.size != 0) or (seg1Int.size == seg2Int.size == 0)
            
            # If both x intervals are zero (ie, they're vertical), we need to 
            # compare the segments' y intervals
            if seg1Int.size == seg2Int.size == 0:
                seg1Int = Interval(self.p1.y, self.p2.y)
                seg2Int = Interval(seg2.p1.y, seg2.p2.y)
                # Since the segments are collinear, their x intervals should either
                # both be nonzero or both be zero.
                assert (seg1Int.size != 0 and seg2Int.size != 0)
                
            result = seg1Int.overlaps(seg2Int)
                
        elif numCollinearities == 1 or numCollinearities == 2:
             # Either the intersection is at the endpoint of one and in the middle
             # of the other, or the intersection is at the endpoint of both.
            result = True
            
        else:
            raise Exception("It should only be possible for there to be 0, 1, "
                            "2, or 4 collinearities, not {}. There was an "
                            "error somewhere.".format(numCollinearities))
                
        return result
        """
    
    
class Polygon(object):
    """
    A polygon in R^2.
    """
    def __init__(self, points):
        self.points = [p if isinstance(p, Point) else Point(p) for p in points]
        
        assert len(self.points) >= 3, "A Polygon must have at least 3 points."
        assert self.points[0] == self.points[-1], "A polygon must start and " \
                                                  "end at the same point."
        
        
        self.segments = [Segment(p1, p2) for p1, p2 in 
                         zip(self.points, self.points[1:])]
        
        xs, ys = zip(*((p.x, p.y) for p in self.points))
        self.bounds = min(xs), min(ys), max(xs), max(ys)
    
    def __repr__(self):
        return "Polygon(" + str(self.points) + ")"
    
    def __getitem__(self, key):
        point = self.points[key]
        return point.x, point.y
    
    def __len__(self):
        return len(self.points)
        
    def contains(self, point):
        """
        Decides whether a point is in the polygon using the ray casting 
        algorithm.
        
        The ray is a line segment from the point to 1 unit beyond xmin.
        Points on the boundary of the polygon are excluded.
        """
        ray = Segment(point, (self.bounds[0] - 1, point.y))
        
        i = 0
        for segment in self.segments:
            if ray.intersects(segment):
                i += 1
                
        return bool(i % 2)
    

###############################################################################
#### FUNCTIONS OF GEOMETRICAL OBJECTS                                     #####
###############################################################################        
    
def orientation(p1, p2, p3):
    """
    Returns the orientation of three points.
    
    clockwise           => -1
    collinear           =>  0
    counterclockwise    =>  1
    """
    # Convert inputs to point objects if necessary
    p1, p2, p3 = (p if isinstance(p, Point) else Point(p) for p in (p1, p2, p3))
    
    # Compare slopes, but avoid divide-by-zero error:
    # slope12 = (p2.y - p1.y)/(p2.x - p1.x)
    # slope23 = (p3.y - p2.y)/(p3.x - p2.x)
    # slopeDiff = slope23 - slope12
    # xDir12 = np.sign(p2.x - p1.x)
    # xDir23 = np.sign(p3.x - p2.x)
    # if xDir12 == xDir23 == 0: # both vertical
    #     orient = 0
    # elif xDir12 == xDir23: # x increases for both or decreases for both
    #     orient = np.sign(slopeDiff)
    # else xDir12 != xDir23: # x switches direction
    #     orient = np.sign(slopeDiff)*(-1)
    # 
    # ~~ slopeDiff*(xDir12*xDir23) ~~ (p3.y - p2.y)*(p2.x - p1.x) - (p2.y - p1.y)*(p3.x - p2.x)
    
    # Caluclate orientation
    orient = np.sign((p3.y - p2.y)*(p2.x - p1.x) - (p2.y - p1.y)*(p3.x - p2.x))
    
    return orient