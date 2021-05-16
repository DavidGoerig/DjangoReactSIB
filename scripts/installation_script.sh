#!/bin/bash

function installit {
  # Installation of virtual env if not present
  pip3 install virtualenv
  # Creation of the virtual env
  python3 -m venv venv
  # Utilisation of the virtual env
  source venv/bin/activate
  # Installation of the dependencies
  pip3 install --upgrade pip
  pip3 install -r requirements/requirements.txt
  python3 manage.py migrate
  cd frontend
  if [ $# -ne 2 ]; then
    if [ "$1" != "-build" ]; then
      npm i webpack webpack-cli --save-build
      npm install universal-cookie --save
    fi
  else
  npm i webpack webpack-cli --save-dev
  npm install universal-cookie --save
  fi
  # Quit virtual env
  cd ..
  deactivate
}

echo "---------------- Start of the installation ---------------"
# Check if there is already a virtual env
if [ -d "venv" ]; then
  echo "Virtual env already installed"
else
  installit;
fi
echo "---------------- Instalation script COMPLETED ---------------"