#!/usr/bin/env bash
pushd video-service
npm install
pushd shared
npm install
popd
popd

pushd upload-service
npm install
pushd shared
npm install
popd
popd
