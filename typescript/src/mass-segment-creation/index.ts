import { GraphQLClient } from "graphql-request";
import { getSdk } from "../sdk";
import { run } from "./script"

const deepcrawlSecretId = process.env.DEEPCRAWL_SECRET_ID;
const deepcrawlSecret = process.env.DEEPCRAWL_SECRET;

if (!deepcrawlSecretId || !deepcrawlSecret) {
  console.error(
    "You must set the DEEPCRAWL_SECRET_ID and DEEPCRAWL_SECRET environment variables."
  );
  process.exit(1);
}

async function main() {
  const client = new GraphQLClient("https://api.lumar.io/graphql", {
    headers: {
      "apollographql-client-name": `mass-segments-creation-example`,
    },
  });
  const sdk = getSdk(client);

  const sessionTokenResponse = await sdk.LoginWithUserKey({
    userKeyId: process.env.DEEPCRAWL_SECRET_ID!,
    secret: process.env.DEEPCRAWL_SECRET!,
  });

  client.setHeader(
    "x-auth-token",
    sessionTokenResponse.createSessionUsingUserKey.token
  );

  await run(sdk);
}

main().catch((err) => {
  console.error("Unexpected error occurect", err);
  process.exit(1);
});
