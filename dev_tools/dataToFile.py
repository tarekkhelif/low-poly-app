import csv
import time
import datetime

def timestamp():
    return datetime.datetime.fromtimestamp(time.time()).strftime('%Y.%m.%d-%H.%M.%S')

def iterToCSV(filename, iterable, ts=False):
    """
    Writes *array* to filename.csv.  Includes a timestamp in the file name if ts is True
    """
    if ts: filename = "{}_{}".format(filename, timestamp())
    with open(filename + ".csv", 'wb') as f:
        writer = csv.writer(f)
        writer.writerows(iterable)