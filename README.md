# CULPA rewrite

[![Build Status](https://travis-ci.com/jonathanzhang99/culpa-rewrite.svg?token=9pakxssWTQ9rzoc91N3M&branch=master)](https://travis-ci.com/jonathanzhang99/culpa-rewrite)

Queer Eye but the Fab 5 are bored Columbia students with time in hand and the desparate client is [CULPA](http://culpa.info).

## Development Setup Instructions

The following instructions are for linux/macos operating systems. If you are on windows contact the owner of the repository or consider running your development environment in a VM. _Note:_ If you installed the Anaconda distribution of python (e.g. for 1006) you may need to edit your `~/.bashrc` or `~/.bash_profile` file to make sure you are not using the conda python.

1. Install [brew](https://brew.sh)
2. Install [node](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
3. Verify or install python 3.7 (there are multiple ways to do this but [pyenv](https://github.com/pyenv/pyenv) is recommended).
4. Install python and react dependencies in the app root directory (where `Pipfile` and `node_modules/` are located).

   ```
   pipenv install
   yarn install
   ```

5. Verify success by running the commands in the [Testing Section](#how-to-test) and [Local Server Setup](#how-to-run-locally)

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

If you have any feedback for the installation please let us know! This is still a work in progress.
