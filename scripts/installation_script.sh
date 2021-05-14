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
  if [ $# -ne 2 ]; then
    if [ "$1" != "-build" ]; then
      npm i webpack webpack-cli --save-build
    fi
  else
  npm i webpack webpack-cli --save-dev
  fi
  # Quit virtual env
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