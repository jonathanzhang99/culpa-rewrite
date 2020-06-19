# CULPA rewrite

![React CI](https://github.com/jonathanzhang99/culpa-rewrite/workflows/React%20Frontend%20CI/badge.svg) ![Python CI](https://github.com/jonathanzhang99/culpa-rewrite/workflows/Python%20Backend%20CI/badge.svg)

Queer Eye but the Fab 5 are bored Columbia students with time in hand and the desparate client is [CULPA](http://culpa.info).

## Development Setup Instructions

The following instructions are for linux/macos operating systems. If you are on windows contact the owner of the repository or consider running your development environment in a VM. _Note:_ If you installed the Anaconda distribution of python (e.g. for 1006) you may need to edit your `~/.bashrc` or `~/.bash_profile` file to make sure you are not using the conda python.

1. Install [brew](https://brew.sh)
2. Install [node](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
3. Verify or install python 3.7 (there are multiple ways to do this but [pyenv](https://github.com/pyenv/pyenv) is recommended).
4. Navigate to the app root directory (where `Pipfile.lock` and `yarn.lock` are located) and create a python virtual environment and python dependencies:

   ```
   export WORKON_HOME='~/.python_venvs'
   pipenv --python 3.7.7
   pipenv install
   ```

   You should have created a virtual environment in `~/.python_venvs/culpa-rewrite-XXXX` where `XXXX` is some hash. Refer to the official [pipenv docs](https://pipenv-fork.readthedocs.io/en/latest/) for more info.

5. In that same app root directory, install react depencies:

   ```
   yarn install
   ```

6. Verify success by running the commands in the [Testing Section](#how-to-test) and [Local Server Setup](#how-to-run-locally)

## How to test

```
yarn test-frontend
yarn test-backend
```

## How to run locally

```
yarn start-frontend
yarn start-backend
```

Each command only starts the respective server and you will need both servers running in order to run the app. Make sure that the flask server is running on `localhost:5000` (the default).

If you have any feedback for the installation please let us know! This is still a work in progress.
