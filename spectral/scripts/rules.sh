## This script tests and validates rules APIs

## Fetch current managed services APIS from sdk repository 
## This apis can be used for testing
## Script needs to run in the test working directory


echo "fetching kas-fleet-manager from main" 
mkdir -R .openapi
wget -P .openapi https://raw.githubusercontent.com/redhat-developer/app-services-sdk-js/main/.openapi/kas-fleet-manager.yaml

## TODO add more apis

yarn spectral lint .openapi/kas-fleet-manager.yaml -v -r ../dist/ruleset.yaml