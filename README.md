this is a repository for Open Source tooling around the formstr-sdk

In the current state the repo includes:

1. The Formstr SDK: An npm library that interacts with the nostr-protocol. More about it [here](packages/formstr-sdk/docs/v1/design.md)

2. The Formstr web app: The Forms Instance that runs on top of the formstr sdk more about it [here](packages/formstr-app/README.md).

3. The Linkstr Client: A links app that runs on top of the formstr-sdk, currently in this [PR](https://github.com/abhay-raizada/nostr-forms/pull/68/files)

## Prerequistes to setup

1. Node
2. Yarn

### Setup:

1. `yarn install`
2. `yarn workspace @formstr/web-app`
