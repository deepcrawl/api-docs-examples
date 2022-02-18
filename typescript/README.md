Example from [DeepCrawl GraphQL API Documentation](https://graph-docs.deepcrawl.com/docs/graphql-clients/typescript)


### Mass segment creation example

```bash
yarn install
curl https://graph.deepcrawl.com/schema.graphql > schema.graphql
yarn graphql-codegen
export DEEPCRAWL_SECRET_ID=
export DEEPCRAWL_SECRET=
yarn --silent ts-node src/mass-segment-creation
```
