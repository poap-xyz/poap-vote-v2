# POAP Vote

A sybil-resistant voting engine for anyone to run polls using Ethereum and POAP.

Visit [www.poap.vote](https://poap.vote) to view, create, and vote in Polls.

## Development

POAP is a clean client/server web app with a dash of web3.

### Frontend

The frontend is built with VUE and the Quasar framework. It leverages web3 for message signing, authenticating polls & votes to Ethereum accounts. Checkout the [frontend README](frontend/README.md) to get setup.

### Backend

The backend is built with node.js and Express and backed by a Postgres database for storing poll and vote data.. Checkout the [backend README](backend/README.md) to get setup.

## Contributions

Contributions are welcome! Simply fork the project, create a new branch from master, and open a PR. Before opening a PR, rebase your branch to master to ensure a fast forward merge is possible.
