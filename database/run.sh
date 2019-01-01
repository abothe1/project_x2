#!/bin/bash
redis-server &
mongod --config mongod.conf --dbpath database