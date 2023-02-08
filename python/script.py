from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from graphql import build_schema
import json
import os

transport = AIOHTTPTransport(url="https://api.lumar.io/graphql", headers={})

with open('./schema.graphql') as source:
    document = source.read()
schema = build_schema(document)

client = Client(transport=transport, schema=schema)

login_mutation = gql(
    """
    mutation LoginWithUserKey($secret: String!, $userKeyId: ObjectID!) {
      createSessionUsingUserKey(input: { userKeyId: $userKeyId, secret: $secret }) {
        token
      }
    }
    """
)
login_variables = {
    "secret": os.environ['DEEPCRAWL_SECRET'],
    "userKeyId": os.environ['DEEPCRAWL_SECRET_ID']
}

login_result = client.execute(login_mutation, variable_values=login_variables)
session_token = login_result['createSessionUsingUserKey']['token']

transport.headers['x-auth-token'] = session_token

accounts_query = gql(
    """
    query MyAccounts {
      me {
        accounts(first: 10) {
          totalCount
          nodes {
            id
            name
          }
        }
      }
    }
  """
)


accounts_result = client.execute(accounts_query)

print(json.dumps(accounts_result))
