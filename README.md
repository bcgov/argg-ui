# argg-ui
Frontend UI for API Registration Generator (ARGG).  This component depends on the 
ARGG API (argg-api).

# Build and run in a docker container

docker build --build-arg configuration=[ENV_NAME] -t argg-ui .
  where [ENV_NAME] is one of [dlv, test, prod]

Example: 
  docker build --build-arg configuration=dlv -t argg-ui .

docker run argg-ui

# License
```
Copyright 2018 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
