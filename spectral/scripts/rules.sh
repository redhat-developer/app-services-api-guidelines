## This script tests and validates rules APIs

## Fetch current managed services APIS from sdk repository 
## This apis can be used for testing
## Script needs to run in the test working directory

spectralConfig="./examples/.spectral-local.yaml"
baseUrl='https://raw.githubusercontent.com/redhat-developer/app-services-sdk-js/main/.openapi/'
folder=".openapi"
file='kas-fleet-manager.yaml'

wget -P $folder ${baseUrl}${file}
echo "linting $file OAS file" 
yarn spectral lint $folder/$file -v -r $spectralConfig

file='srs-fleet-manager.json'
wget -P $folder ${baseUrl}${file}
echo "linting $file OAS file" 
yarn spectral lint $folder/$file -v -r $spectralConfig

## Updates made to the following need to be refected in their respective .openapi OAS files before the linting can pass and added to CI

# file='connector_mgmt.yaml'
# wget -P $folder ${baseUrl}${file}
# echo "linting $file OAS file" 
# yarn spectral lint $folder/$file -v -r $spectralConfig

# file='smartevents.yaml'
# wget -P $folder ${baseUrl}${file}
# echo "linting $file OAS file" 
# yarn spectral lint $folder/$file -v -r $spectralConfig

# file='kafka-admin.yaml'
# wget -P $folder ${baseUrl}${file}
# echo "linting $file OAS file" 
# yarn spectral lint $folder/$file -v -r $spectralConfig

## TODO add more apis as they are onboarded
