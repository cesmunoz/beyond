echo ''
echo '****** Starting Pre Deploy Script ******'

echo ''
echo '1- Creating folder for layers and copy package.json' 
rm -rf ./.dist
rm -rf ./.serverless-layers
mkdir -p .serverless-layers/node-layers/nodejs
cp package.json .serverless-layers/node-layers/nodejs/
echo 'DONE!' 

echo ''
echo '2- Build LIB dependency' 
cd ../lib
yarn build
cd ../server
echo 'DONE!' 

echo ''
echo '3 - Change path to serverless-layer, adding LIB dependency, remove npm and yarn files'
cd .serverless-layers/node-layers/nodejs
npm i ../../../../lib
yarn install --production
rm package.json
rm package-lock.json
rm yarn.lock
cd ../../..
echo 'DONE!' 

echo ''
echo '4- Build' 
yarn build
echo 'DONE!' 

echo ''
echo '****** Finished Pre Deploy Script ******'