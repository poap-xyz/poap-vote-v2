#!/bin/bash

ask_continue() {
    echo "Continue? (y/n)"
    read CONTINUE

    if [[ "$CONTINUE" != "y" ]]; then
        exit 1
    fi
}


# todo check for arg
TARGET="staging.poap.vote"

echo "Will deploy to $TARGET"
ask_continue

UNIXTIME=$(date +%s)
DIRNAME="frontend_$UNIXTIME"

## BUILD FRONTEND

echo "Installing frontend depdencies"
cd frontend
npm install
cd ..
ask_continue


echo "Building frontend"
cd frontend
npm run build
cd ..
ask_continue

## DEPLOY FRONTEND

echo "Copying frontend to server"
rsync -rv frontend/dist/spa/* deploy@staging.poap.vote:~/frontend_archive/$DIRNAME
ask_continue

echo "Copying new frontend"
ssh deploy@staging.poap.vote "cp -rv ~/frontend_archive/$DIRNAME ~/frontend_new"
ask_continue

echo "Swapping in new frontend"
ssh deploy@staging.poap.vote "rm -rfv ~/frontend_last && mv -v ~/frontend_live ~/frontend_last && mv -v ~/frontend_new ~/frontend_live"
ask_continue

## DEPLOY BACKEND

echo "Building Production"
cd backend
npm install --production
cd ..
ask_continue

echo "Archiving current backend"
ssh deploy@staging.poap.vote "rsync -aP ~/backend_live/* ~/backend_last"
ssh deploy@staging.poap.vote "rsync -aP ~/backend_live/.babelrc ~/backend_last"
ssh deploy@staging.poap.vote "rsync -aP ~/backend_live/.sequelizerc ~/backend_last"
ask_continue

echo "Pushing new backend to server"
rsync -aP backend/* --exclude=.env* deploy@staging.poap.vote:~/backend_live
rsync -aP backend/.babelrc deploy@staging.poap.vote:~/backend_live
rync -aP backend/.sequelizerc deploy@staging.poap.vote:~/backend_live
ask_continue
