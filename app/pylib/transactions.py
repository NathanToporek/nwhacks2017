#!/usr/bin/python
import json
from math import radians, cos, sin, asin, sqrt, fabs
import psycopg2
#creat a connection object
conn = psycopg2.connect(database='RIDESHARE', user='nate', password='password', host='localhost', port=26257)

# Set autocommit
conn.set_session(autocommit=True)

# Open a cursor
crsr = conn.cursor()

def create(): 
	# Create our talbles
	crsr.execute("CREATE TABLE IF NOT EXISTS sheeple(username STRING PRIMARY KEY," + 
					       "password STRING NOT NULL);")
	crsr.execute("CREATE TABLE IF NOT EXISTS dataPoints(username STRING REFERENCES sheeple (username)," +
						  "startTime STRING," +
					          "startLat FLOAT," +
						  "startLon FLOAT," +
						  "endTime STRING," +
						  "endLat FLOAT," +
					          "endLon FLOAT);")

def byUser(username):
        q = 'SELECT * FROM dataPoints WHERE username = \'{}\''.format(username)
        crsr.execute(q)
        return crsr.fetchall()

def suggest(username, timeVar, dist):
	notMe = __allExceptUser(username) 
	myRides = byUser(username)
	suggested = []
	for me in myRides:
		for other in notMe:
			mst = me[1]
			ost = other[1]
			
			met = me[4]
			oet = other[4]			

			msla = me[2]
			mslo = me[3]
			osla = other[2]
			oslo = other[3]
			mela = me[5]
			melo = me[6]
			oela = other[5]
			oelo = other[6]

			if(__isInTimeRange(timeVar, mst, ost) and __isInTimeRange(timeVar, met, oet) 
		       and __inRange(dist, msla, mslo, osla, oslo) and __inRange(dist, mela, melo, oela, oelo)):
				suggested.append(json.dumps({'username':other[0], 'stime':other[1], 'sla':other[2], 'slo':other[3], 'etime':other[4], 'ela':other[5], 'elo':other[6]}))
	
	return suggested			
			

def __populate():
	q = 'INSERT INTO dataPoints VALUES(\'{}\', \'{}\', {}, {}, \'{}\', {}, {})'
	crsr.execute('SELECT * FROM dataPoints;')
	res = crsr.fetchall()

	for row in res:
		print row
	
	st = '2017-03-19T02:22:48.120Z'
	et = '2017-03-19T02:24:01.378Z'

	sla = float(res[0][2])
	slo = float(res[0][3])
	ela = float(res[0][5])
	elo = float(res[0][6])

	for i in range(1, 10):
		for j in range(1, 10):
			muli = 0.01 * i
			mulj = 0.01 * j
			
			sla = sla + muli
			slo = slo + mulj
			ela = ela - muli
			elo = elo - mulj

			crsr.execute(q.format(res[0][0], st, sla, slo, et, ela, elo))
			crsr.execute(q.format(res[1][0], st, sla, slo, et, ela, elo))
# 
def __allExceptUser(username):
	
	# Grab all entries in our database execept for the user's
  	q = 'SELECT * FROM dataPoints WHERE username != \'{}\';'.format(username)
	crsr.execute(q)
	return crsr.fetchall()

def __isInTimeRange(tmin, time1, time2):
	idx1 = time1.index('T') + 3
	idx2 = time2.index('T') + 3

	t1 = time1[-idx1:]
	t2 = time2[-idx2:]
	
	idx1 = t1.index('.') - 3
	idx2 = t2.index('.') - 3
	
	t1 = t1[:idx1].split(':')
	t2 = t2[:idx2].split(':')

	h1 = 60 * int(t1[0]) + int(t1[1]) 
	h2 = 60 * int(t2[0]) + int(t2[1])

	return fabs(h1 - h2) <= tmin
# calculates whether a point is within a range
def __inRange(meters, lat1, lon1, lat2, lon2):
	return __haversine(lon1, lat1, lon2, lat2) <= meters	
#calculates the distance between two points.
def __haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371000 # Radius of earth in meters. Use 3956 for miles
    return c * r
