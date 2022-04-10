echo ''
echo '****** Starting Clean Process Script ******'

echo ''
echo '1- Cleaning js and js.map' 
rimraf .dist
echo 'DONE!' 

echo ''
echo '2- Cleaning LIB build' 
cd "../lib" && rimraf .build
echo 'DONE!' 

echo ''
echo '****** Finished Clean Process Script ******'