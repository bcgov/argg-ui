# argg-ui
Frontend UI for API Registration Generator (ARGG).  This component depends on the 
ARGG API (argg-api).

# Build and run in a docker container

docker build --build-arg configuration=[ENV_NAME] -t argg-ui .
  where [ENV_NAME] is one of [dlv, test, prod]

Example: 
  docker build --build-arg configuration=dlv -t argg-ui .

docker run argg-ui