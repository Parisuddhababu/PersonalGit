echo "Deploy starting..."

BUILD_DIR=publicTemp npm run redeploy:maintenance || exit

rm -rf public

mv publicTemp public

# npm run server:start  -- --env staging

echo "Deploy done."
