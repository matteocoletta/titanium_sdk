#!/usr/bin/env bash

# Builds the JAR files and puts them in the correct /lib paths.
# Does NOT play or run the app. That has to be done after packaging both modules from Appcelerator IDE and then running the app from there.

# Get the current directory (/scripts/ directory)
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Traverse up to get to the root directory
ROOT_DIR="$(dirname "$SCRIPTS_DIR")"
SDK_DIR=android/android
TESTING_DIR=testing/android

RED='\033[0;31m' # Red color
GREEN='\033[0;32m' # Green color
NC='\033[0m' # No Color

echo -e "${GREEN}>>> START ${NC}"

cd $ROOT_DIR
echo -e "${GREEN}>>> Removing the Android JAR file ${NC}"
rm -rfv android/android/lib/adjust-*.jar

echo -e "${GREEN}>>> Removing the Android ci testing JAR file ${NC}"
rm -rfv testing/android/lib/adjust-*.jar

echo -e "${GREEN}>>> Building the Android JAR file ${NC}"
ext/android/build.sh

echo -e "${GREEN}>>> Building the Android ci testing JAR file ${NC}"
ext/android/build_testing.sh

echo -e "${GREEN}>>> Move JARs to corresponding modules ${NC}"
mv -v ext/android/adjust-android.jar android/android/lib/
mv -v ext/android/adjust-testing.jar testing/android/lib/

echo -e "${GREEN}>>> DONE ${NC}"
