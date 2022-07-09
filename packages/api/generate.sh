export MSYS_NO_PATHCONV=1
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli:v6.0.0 generate -i https://raw.githubusercontent.com/go-saas/kit/main/openapi/kit-merged.swagger.json -g typescript-axios -o /local -c /local/tools/config.json
