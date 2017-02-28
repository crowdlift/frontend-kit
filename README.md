# Frontend Kit


## Usage

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


## Useful Commands

```bash
# List all globally installed top level NPM packages
npm list -g --depth=0
```
