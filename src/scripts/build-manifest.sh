#!/bin/bash

NETWORK=$1

if [ "$STAGING" ]
then
  FILE=$NETWORK'-staging.json'
else
  FILE=$NETWORK'.json'
fi

DATA=src/manifest/$FILE

echo 'Generating manifest from data file: '$DATA
cat $DATA

mustache $DATA src/subgraph.template.yaml > subgraph.yaml