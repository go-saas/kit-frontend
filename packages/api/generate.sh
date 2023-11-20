export MSYS_NO_PATHCONV=1
rm -rf api
find models -type f -not -name 'protobuf-any.ts' -delete
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli:v7.1.0 generate -i https://raw.githubusercontent.com/go-saas/kit/main/openapi/kit-merged.swagger.json -g typescript-axios -o /local -c /local/tools/config.json
