import { GraphQLClient } from "graphql-request";

import { getSdk } from "../sdk";

import { run } from "./script"

async function main() {
  const client = new GraphQLClient("https://api.lumar.io/graphql", {
    headers: {
      "apollographql-client-name": `mass-segments-creation-example`,
    },
  });
  const sdk = getSdk(client);

  const { createSessionUsingUserKey } = await sdk.LoginWithUserKey({
    input: {
      userKeyId: process.env.LUMAR_USER_KEY_ID!,
      secret: process.env.LUMAR_SECRET!,
    },
  });

  client.setHeader("x-auth-token", createSessionUsingUserKey.token);

  await run(sdk);
}

if (require.main === module) {
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
}
