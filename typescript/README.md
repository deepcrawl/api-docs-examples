Example from [DeepCrawl GraphQL API Documentation](https://graph-docs.deepcrawl.com/docs/graphql-clients/typescript)

### Mass segment creation example

```bash
npm install
curl https://api.lumar.io/schema.graphql > schema.graphql
npm exec -- graphql-codegen
export LUMAR_USER_KEY_ID=
export LUMAR_SECRET=
npm exec --silent -- ts-node src/mass-segment-creation
```
