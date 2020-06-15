# CULPA rewrite

## Installation

```
workon culpa
python -r requirements.txt
yarn install --frozen-lockfile
```

## Testing

```
yarn test
AND
nose2
```

## Development

```
yarn start
AND
export FLASK_APP=api/app.py && flask run
```
