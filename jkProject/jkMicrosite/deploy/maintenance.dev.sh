echo "Deploy starting..."

BUILD_DIR=publicTemp npm run redeploy:maintenance || exit

rm -rf public

mv publicTemp public

echo "Deploy done."
