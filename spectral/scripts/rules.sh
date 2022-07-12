## This script tests and validates rules APIs

## Fetch current managed services APIS from sdk repository 
## This apis can be used for testing
## Script needs to run in the test working directory


echo "fetching kas-fleet-manager from main" 
wget -P .openapi https://raw.githubusercontent.com/redhat-developer/app-services-sdk-js/main/.openapi/kas-fleet-manager.yaml
echo "fetching connector_mgmgt from main" 
wget -P .openapi https://github.com/redhat-developer/app-services-sdk-js/blob/main/.openapi/connector_mgmt.yaml
echo "fetching srs from main" 
wget -P .openapi https://github.com/redhat-developer/app-services-sdk-js/blob/main/.openapi/srs-fleet-manager.json
echo "fetching smartevents from main" 
wget -P .openapi https://github.com/redhat-developer/app-services-sdk-js/blob/main/.openapi/smartevents-mgmt.yaml
echo "fetching kafka-admin from main" 
wget -P .openapi https://github.com/redhat-developer/app-services-sdk-js/blob/main/.openapi/kafka-admin-rest.yaml
## TODO add more apis

## linting the fetched apis
yarn spectral lint .openapi/connector_mgmt.yaml -v -r ./examples/.spectral-local.yaml
yarn spectral lint .openapi/kas-fleet-manager.yaml -v -r ./examples/.spectral-local.yaml
yarn spectral lint .openapi/srs-fleet-manager.json -v -r ./examples/.spectral-local.yaml
yarn spectral lint .openapi/smartevents-mgmt.yaml -v -r ./examples/.spectral-local.yaml
yarn spectral lint .openapi/kafka-admin-rest.yaml -v -r ./examples/.spectral-local.yaml