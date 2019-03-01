#!/usr/bin/env bash

docker run --rm -it -v $(PWD)/code/nodeJS.sh:/code.sh -v $(PWD)/build.sh:/build.sh --env-file settings hostidock "/build.sh"