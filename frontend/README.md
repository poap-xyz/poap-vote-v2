# POAP Vote

Polling based on POAP token ownership.

## Development

Create a file called `.env.dev` in the `frontend` folder with the following content:

```bash
export BLOCKNATIVE_API_KEY=yourBlocknativeApiKey
export PORTIS_API_KEY=yourPortisApiKey
export FORTMATIC_API_KEY=yourFortmaticApiKey
export INFURA_ID=yourInfuraId
```

Blocknative's [onboard.js](https://www.blocknative.com/onboard) package is
used and requires the three API keys listed above.

Once that is setup, install dependencies with `npm install`.

Finally, start the app in development mode using `npm run dev`.

### Run tests

```bash
# Start the app
npm run dev

# Run tests in a new terminal window, with browser hidden
npm run test

# OR run tests in a browser to watch execution
npm run test:visual # once window launches, click "Run all specs"
```

### Build the app for production

```bash
npm run build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
