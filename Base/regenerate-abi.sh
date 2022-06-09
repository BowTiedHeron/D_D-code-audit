set -e
set -x

rm -rf packages/next-app/src/typechain
rm -rf packages/hardhat/artifacts
rm -rf packages/hardhat/cache

yarn compile
yarn format:fix
