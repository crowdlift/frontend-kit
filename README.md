# Frontend Kit


## Usage

```json
// Add these scripts to package.json
"scripts": {
  "build": "npm-run-all -p build:prod",
  "build:dev": "cross-env NODE_ENV=development BUILD_DIR=./dist/dev webpack --display-chunks --progress",
  "build:prod": "cross-env NODE_ENV=production webpack --display-chunks --progress",
  "clean": "rimraf dist",
  "deploy": "./bin/deploy-gh.sh",
  "dev": "cross-env NODE_ENV=development webpack-dev-server --progress",
  "lint": "eslint src *.js",
  "prebuild": "cross-env RELEASE=1 npm-run-all -p clean test",
  "serve": "./node_modules/.bin/http-server -p 2000 dist/",
  "start": "npm run dev",
  "test": "echo TESTS PLACEHOLDER"
},
'''

```bash
# After cloning
yarn install

# Run dev
yarn start

# Build and deploy production
yarn build
yarn deploy

# Add a new package to devDependencies
yarn add [package] -D

# Upgrade all packages to latest within package.json and yarn.lock paramenters
yarn upgrade
# Run npm-check-updates first to upgrade package.json
```


## Upgrade Packages

[npm-check-updates](https://github.com/tjunnone/npm-check-updates)

```bash
# Check which packages can be upgrade in package.json
npm-check-updates # or ncu

# Upgrade all packages
ncu -a

# Upgrade to the highest version available packages, including beta
ncu -a -t
```


## Release Update

```bash
# Build release
yarn build
```

Bump version in package.json and `git commit` it.

```bash
# Create a new tag
git tag v1.1.2
# Push to github
git push origin v3.1.0
# OR push all tags
git push origin --tags
```
