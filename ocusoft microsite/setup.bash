#!/bin/bash

# echo "Override PERMANENT_REDIRECT_STATUS"
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# config var
PERMANENT_REDIRECT_STATUS=301

# filenames
nextConstant="node_modules/next/dist/next-server/lib/constants.d.ts"
nextConstantDist="node_modules/next/dist/next-server/lib/constants.js"

# Update Permanent Status Code Script
printf "${GREEN}Permanent Status Code Update${NC} 308 -> ${PERMANENT_REDIRECT_STATUS} \n";
sed -i "s/308/${PERMANENT_REDIRECT_STATUS}/gi" "$nextConstant"
sed -i "s/308/${PERMANENT_REDIRECT_STATUS}/gi" "$nextConstantDist"