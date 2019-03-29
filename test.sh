#!/usr/bin/env bash
docker kill $(docker ps -q)
docker run --rm -it -p 3003:3003 --env-file api/settings hostidock