# POAP Vote API Server

The API server for the POAP Vote application. Available at https://poap.vote/api. Checkout the [available endpoints](https://github.com/apbendi/poap-vote/blob/master/backend/src/index.js#L32-L37).

## Development Requirements

* node.js v12.16.1 or later
* npm v6.13.4 or later
* PostgreSQL 9.6 or later w/ command line tools

### Optional Tools

* [Postgres.app](https://postgresapp.com/) - Easiest way to run Postgres on a Mac
* [Postico](https://eggerapps.at/postico/) - Graphical interface for interacting with Postgres DB
* [Postman](https://www.postman.com/) - App for interacting with APIs

## Setup

From the `backend` directory, run:

```bash
npm install
npm run init-dev-db
npm run migrate
npm run dev
```

The API is now running on port 3000. To execute tests, run `npm test`





