#!/usr/bin/env bash
pushd upload-service
pushd shared
rm -rf node_modules
popd
rm -rf node_modules
popd

pushd video-service
pushd shared
rm -rf node_modules
popd
rm -rf node_modules
rm -rf ffmpeg
popd
