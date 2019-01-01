#!/bin/bash
redis-server &
mongod --config mongo/mongod.conf --dbpath mongo/database