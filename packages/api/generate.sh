export MSYS_NO_PATHCONV=1
rm -rf api
rm -rf models
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli:v7.0.1 generate -i https://raw.githubusercontent.com/go-saas/kit/main/openapi/kit-merged.swagger.json -g typescript-axios -o /local -c /local/tools/config.json
