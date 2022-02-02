import { GraphQLClient } from "graphql-request";
import { getSdk } from "./sdk";

const deepcrawlSecretId = process.env.DEEPCRAWL_SECRET_ID;
const deepcrawlSecret = process.env.DEEPCRAWL_SECRET;

if (!deepcrawlSecretId || !deepcrawlSecret) {
  console.error("You must set the DEEPCRAWL_SECRET_ID and DEEPCRAWL_SECRET environment variables.");
  process.exit(1);
}

async function main() {
  const client = new GraphQLClient("https://graph.deepcrawl.com/", {
    headers: {
      "apollographql-client-name": `your-client-name`,
    },
  });
  const sdk = getSdk(client);

  const sessionTokenResponse = await sdk.LoginWithUserKey({
    userKeyId: process.env.DEEPCRAWL_SECRET_ID!,
    secret: process.env.DEEPCRAWL_SECRET!,
  });

  client.setHeader("x-auth-token", sessionTokenResponse.createSessionUsingUserKey.token);

  console.log("My accounts are:");
  const accounts = await sdk.MyAccounts();
  console.log(JSON.stringify(accounts, null, 2));
}

main().catch(err => {
  console.error("Unexpected error occurect", err);
  process.exit(1);
});
