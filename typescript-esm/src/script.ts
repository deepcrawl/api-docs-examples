import { GraphQLClient } from "graphql-request";

import { getSdk } from "./sdk.js";

async function main() {
  const client = new GraphQLClient("https://api.lumar.io/graphql", {
    headers: {
      "apollographql-client-name": "your-client-name",
    },
  });
  const sdk = getSdk(client);

  // highlight-next-line
  const { createSessionUsingUserKey } = await sdk.LoginWithUserKey({
    input: {
      userKeyId: process.env.LUMAR_USER_KEY_ID!,
      secret: process.env.LUMAR_SECRET!,
    },
  });

  client.setHeader("x-auth-token", createSessionUsingUserKey.token);

  console.log("My accounts are:");
  // highlight-next-line
  const accounts = await sdk.MyAccounts();
  console.log(JSON.stringify(accounts, null, 2));
}

if (!process.env.LUMAR_USER_KEY_ID || !process.env.LUMAR_SECRET) {
  console.error("You must set the LUMAR_USER_KEY_ID and LUMAR_SECRET environment variables.");
  process.exit(1);
}

(async () => {
  await main();
  process.exit(0);
})().catch(error => {
  console.error("Unexpected error has occurred!", error);
  process.exit(1);
});
