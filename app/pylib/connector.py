#!/usr/bin/env python

import sys, json, transactions

def main():
	for string in sys.argv:
		print string
	res = None
	s = 'suggest'
	l = 'list'
	if sys.argv[1] == s:
		res =  transactions.suggest(sys.argv[2], int(sys.argv[3]), int(sys.argv[4]))
	elif sys.argv[1] == l:
		res = transactions.byUser(sys.argv[2])
	
	if res is not None:
		for row in res:
			print row

if __name__ == '__main__':
	main()
