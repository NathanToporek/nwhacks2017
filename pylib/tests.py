#!/usr/bin/env python

import transactions

transactions.create()

s = transactions.suggest('Nathan', 30, 500)

for row in s:
	print row
