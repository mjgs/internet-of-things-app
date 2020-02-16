#!/usr/bin/env bash

if [ -n "$DEBUG" ]; then
  echo "$0: Setting bash option -x for debug"
  PS4='+($(basename ${BASH_SOURCE}):${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
  set -x
fi

DOWNLOAD_DIR=$(mktemp -d)

mkdir -p public/{javascripts,stylesheets}

echo "Downloading bootstrap..."
npm install bootstrap --prefix $DOWNLOAD_DIR

echo "Downloading jquery..."
npm install jquery --prefix $DOWNLOAD_DIR 

echo "Installing bootstrap..."
rsync -avc $DOWNLOAD_DIR/node_modules/bootstrap/dist/css/bootstrap*.min.css* public/stylesheets
rsync -avc $DOWNLOAD_DIR/node_modules/bootstrap/dist/js/bootstrap*.min.js* public/javascripts

echo "Installing jquery..."
rsync -avc $DOWNLOAD_DIR/node_modules/jquery/dist/jquery.min.js* public/javascripts

rm -rf $DOWNLOAD_DIR

exit 0