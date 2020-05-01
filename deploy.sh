#!/bin/bash

ask_continue() {
    echo "Continue? (y/n)"
    read CONTINUE

    if [[ "$CONTINUE" != "y" ]]; then
        exit 1
    fi
}

TARGET="staging.poap.vote" # todo check for arg

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
npm run build-staging # todo environment dependent
cd ..
ask_continue

## DEPLOY FRONTEND

echo "Copying frontend to server"
rsync -rv frontend/dist/spa/* deploy@$TARGET:~/frontend_archive/$DIRNAME
ask_continue

echo "Copying new frontend"
ssh deploy@$TARGET "cp -rv ~/frontend_archive/$DIRNAME ~/frontend_new"
ask_continue

echo "Swapping in new frontend"
ssh deploy@$TARGET "rm -rfv ~/frontend_last && mv -v ~/frontend_live ~/frontend_last && mv -v ~/frontend_new ~/frontend_live"
ask_continue

## DEPLOY BACKEND

echo "Building production backend"
cd backend
npm install --production
cd ..
ask_continue

echo "Archiving current backend"
ssh deploy@$TARGET "rsync -aP ~/backend_live/* ~/backend_last"
ssh deploy@$TARGET "rsync -aP ~/backend_live/.babelrc ~/backend_last"
ssh deploy@$TARGET "rsync -aP ~/backend_live/.sequelizerc ~/backend_last"
ask_continue

echo "Pushing new backend to server"
rsync -aP backend/* --exclude=.env* deploy@$TARGET:~/backend_live
rsync -aP backend/.babelrc deploy@$TARGET:~/backend_live
rsync -aP backend/.sequelizerc deploy@$TARGET:~/backend_live
ask_continue
