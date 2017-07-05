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
}
```


## Upgrade Packages

[npm-check-updates](https://github.com/tjunnone/npm-check-updates)

```bash
# Check which packages can be upgrade in package.json
npm-check-updates # or ncu

# Upgrade all packages except eslint
# eslint-config-airbnb 15.x requires eslint 3.19
ncu -a -x eslint,eslint-plugin-jsx-a11y,eslint-plugin-import,eslint-plugin-react

# Check to make sure eslint config will work after upgrading
# Compare to versions in package.json
npm info "eslint-config-airbnb@latest" peerDependencies

# Upgrade to the highest version available packages, including beta
ncu -a -t

# Upgrade all packages to latest within package.json and yarn.lock paramenters
yarn upgrade
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
# Update latest tag
git tag latest
# OR push all tags
git push origin --tags


###############################
# Other useful commands

# Push a specific tag
git push origin v3.1.0

# Delete local tag
git tag -d v0.1.1

# Delete a remote tag
git push origin :refs/tags/v0.1.1
# or github allows shorthand
git push origin :v0.1.1
```
