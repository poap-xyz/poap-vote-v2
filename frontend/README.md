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
used and requires the API keys listed above.

Once that is setup, create a copy of that file called `.env.prod`. Next, follow the steps below:

```bash
# Start the server
cd backend
npm install
npm run dev

# In a new terminal window, start the frontend app
cd frontend
npm install
npm run dev
```

### Run tests

```bash
# Start the app
npm run dev

# Run tests in a new terminal window, with browser hidden
npm run test

# OR run tests in a browser to watch execution
npm run test:visual # once window launches, click "Run all specs"
```

### Production

Run the commands below to build the app for production. After building, the files
for deployment can be found in `frontend/dist/spa`.

```bash
cd frontend
npm install
npm run build
```

Because the frontend is a single page application (SPA), we need to setup URL
rewriting. This is basically a level of abstraction between the actual URL
and the files/content shown, so the URL no longer corresponds to a server
file. For single page applications, we want all server 404s to instead be
routed to the application to figure out the route itself. With nginx we can
do this with the the following configuration, which will serve `index.html` in
response to any request
([stack overflow source](https://stackoverflow.com/questions/45260011/nginx-route-with-single-page-app),
[nginx docs](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)):

```
location / {
    try_files /index.html =404;
}
```
