# CULPA rewrite

![React CI](https://github.com/jonathanzhang99/culpa-rewrite/workflows/React%20Frontend%20CI/badge.svg) ![Python CI](https://github.com/jonathanzhang99/culpa-rewrite/workflows/Python%20Backend%20CI/badge.svg)

Queer Eye but the Fab 5 are bored Columbia students and the desparate client is [CULPA](http://culpa.info).

## Development Setup Instructions

_Note:_ If you installed the Anaconda distribution of python (e.g. for 1006) you may need to edit your `~/.bashrc` or `~/.bash_profile` file to make sure you are not using conda python (which will produce unexpected results).

## Manual Installation Instructions
The following instruction are tailored for OSX (Mac) users. Linux users will also find the instructions easily translatable for their systems. If you are on Windows, please contact an administrator (although the steps can be replicated by simply using a virtual machine running a Unix distro).

### Installations
1. (optional but recommended) Install [brew](https://brew.sh). All installations that follow can be completed with `brew install <package>`. Linux users do not have brew but should already have a package manager (e.g. `apt`) – substitute this (along with the appropriate package names/flags) whenever you see `brew` mentioned.
2. Install [node](https://nodejs.org/en/)(v. 14.3) and [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) (v. 1.22)
3. Install python 3.7 (this can be done via `brew install python3` or if you want a more robust solution, with [`pyenv`](https://github.com/pyenv/pyenv)).
4. Install [mysql](https://dev.mysql.com/doc/refman/8.0/en/installing.html).

### Packages and Dependencies

5. **Clone the repository**: Run `git clone <repo_url>` in your development folder.

6. **Setting Environment Variables**: In your shell's rc file (i.e. `.bashrc`, `.zshrc`, `.bash_profile`, etc.) usually located in the home directory, you need to set the following environment variables at the end of your file.
   ```
   export WORKON_HOME=$HOME/.python_venvs
   export PIPENV_VERBOSITY=-1
   ```
   The first variable ensures that your virtual environments can be easily accessible. The second variable suppresses some annoying `pipenv` warnings that are bugged in the current release (v. 2020.6.2)

7. **Installing Python Packages**: 
Navigate to your app's root directory and setup the Pipenv environment.

   ```
   pipenv --python 3.7
   pipenv install
   ```

   You should have created a virtual environment in `~/.python_venvs/culpa-rewrite-XXXX` where `XXXX` is some hash. Refer to the official [pipenv docs](https://pipenv-fork.readthedocs.io/en/latest/) for more info.

8.  **Installing React Packages**: In that same app root directory, install the react dependencies:
      ```
      yarn install --frozen-lockfile
      ```

9. **Running local MySQL Server**: In order to run the website locally and to run tests properly, you need to run a local mysql server. Make sure that you have MySQL installed properly by running `mysql --version` in the command line. You should see `mysql Ver 8.0.X`.
   
   1. Start your `mysql` instance. If you want to have the `mysql` server running in the background (and you're on a homebrew managed Mac), use:
      
      ```
      brew services start mysql
      ``` 
   
      If you want to manually start and stop the database (i.e. you don't want mysql when not developing), you can use:
   
      ```
      mysql.server start
      ```
   
      Doing this for the first time should create a root user with no password. We do not recommend adding a password for your local server. The respective flavors for closing the servers are:
   
      ```
      brew services stop mysql
      mysql.server stop
      ```
   
   2. Create the `culpa` database:
      
      ```
      mysqladmin -u root create culpa
      ```

   3. Run the schema file on your database: (make sure you are in your app root directory)
      
      ```
      mysql -u root culpa < api/data/databases/schema.sql
      ```
   
   4. You now have an empty database! As of this current revision, there is not yet a script to generate fake data. We encourage you to play around with your local database and creating some fake entries when running your application locally. Run the following to enter the mysqldb environment:
      ```
      mysql -u root culpa
      ```

10. **Local Environment Variables**: Create a `.env` file in your app root directory. This file will hold all of the environment variables you need to run the app. Paste the following into the `.env` file:
      ```
      export FLASK_APP='api/app.py'
      export FLASK_ENV='development'
      ```
      Do not commit this file to git (it should already be ignored).

11. Congrats! If everything ran smoothly, you should be able to run tests and start the server. Tests are always a great way to ensure that your codebase is functioning correctly. Refer to the reference commands in the [Testing Section](#how-to-test) and [Local Server Setup](#how-to-run-locally)

## How to test

```
yarn test-frontend
yarn test-backend
```

You can also use the following to lint your code (necessary before pushing to make sure you are adhering to the correct style guides)

```
yarn lint-js
yarn lint-python
```

If you find that you run into many javascript formatting problems, run the following to fix common errors:

```
yarn format
```


## How to run locally

```
yarn start-frontend
yarn start-backend
```

Each command only starts the respective server and you will need both servers running in order to run the app. Make sure that the flask server is running on `localhost:5000` (the default).

If you have any feedback for the installation please let us know! This is still a work in progress.


Made by:
- Jonathan