# Monorepo for UI Components and Styling

> **Warning**
> Please be sure to use Node 16 or earlier and specially NPM 8 or earlier and perform `npm i` before doing anything else.

This is a monorepo containing all the UI components as individual packages. We use npm workspaces to easily resolve dependencies and publish components independently.

The workflow would look like this for a component you're creating from scratch:

## Init the package for a new component

`npm init --scope @jjdive --yes -w ./packages/component-name`

Replacing `component-name` with your desired.

This will:

- Create a new folder `component-name` inside the `packages` folder
- Add the workspace to the package.json file
- Create a new package.json inside the created folder

Then you can go ahead and edit the created package.json to look more like this:

```json
{
  "name": "@jjdive/component-name",
  "version": "1.0.0",
  "description": "Monorepo for UI component",
  "main": "DummyComponent.vue",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jjdive/ui-monorepo.git"
  }
}
```

The rest of the fields aren't necessary and the `main` field should point to your entry Vue component.

## Start working on your vue component

Let's say we want to add a simple component that looks like this:

```vue
<!-- packages/component-name/DummyComponent.vue -->
<template>
  <div>Implement your template here...</div>
</template>

<script setup lang="ts">
console.log('... and add some functionality to it! :D')
</script>
```

If your component is actually that simple, you can skip next section and go to "PR and Publishing". Otherwise, if you need to add dependencies to your component or add more .vue files that your entry point depends on, keep reading.

## Adding dependencies to your component

We'll cover 3 dependencies scenarios:

- Local files on the same workspace
- Files from other workspaces/packages
- External dependencies from npm

### Local files on the same workspace

In case your component needs to import some local .vue or .ts files from the same workspace, you have to edit package.json to include those files in the final published package. Read [files](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#files) to know how to use the `files` field.

### Files from other workspaces/packages

To add another workspace/package as a dependency, you have to install it in the root directory of the repo (where this readme is located), and specify the workspace in which you need to add the dependency:

`npm install @jjdive/other-component -w ./packages/component-name`

This will link the local workspace of `other-component` to the root `node_modules` directory as long as a compatible version is available locally (Read [Semantic Versioning](https://semver.org/)), otherwise, the package will be installed from the remote registry to satisfy an older version. Also, this dependency will be explicitly added to your component's package.json so it's clear upon publishing.

### External dependencies from npm

Similar to the previous scenario, you just need to install the dependency from the root folder and specify the target workspace. If you wanted lodash:

`npm install lodash -w ./packages/component-name`

## PR and Publishing

We're now using [Changesets](https://github.com/changesets/changesets) for automating the versioning and publishing of our packages.

More detailed information can be found in the provided link, but the general workflow would look like this:

- Ensure to have pulled the latest version of the main branch from origin
- Make your local changes to one or more components, or even create new ones as described in previous sections
- Before committing the changes locally, create a changeset with `npx changeset`:
  - Pick one package at a time as we want to version each component independently
  - Answer if the bump should be major, minor or patch
  - Provide a summary for the changes and then review the changeset
- Besides you changes, a new .md file in the .changeset folder will be available for your commit
- Commit and push to a PR branch where the usual review process can move on

After that, and upon PR approval and merge into main branch, a github action will take care of processing the available changesets to automatically create a second PR only bumping the corresponding component version and adding information to the component's changelog file.

Approving that second PR will merge the version changes of the component so that a new release can be automatically done by the same pipeline from the main branch.

> **warning**
> Note that for this to work, and besides following the instructions from https://github.com/changesets/changesets#integrating-with-ci, you have to enable "Allow github actions to create and approve pull requests" both in your repo settings -> actions and in your organization settings -> actions.

## Using your components elsewhere

At this point, your new or updated component should be available in the registry, so now you can go ahead and import this new package from any other Vue frontend repo like so:

```js
import DummyComponent from '@jjdive/component-name'
```

Since we're not performing any build step for this components, we can use them as if the .vue files were in the local repo you're importing them into. TS declarations will also work as expected.

There's still one more step to have styling working inside the consuming repo so keep reading the next section.

## TailwindCSS styles

The goal is to use tailwind css utility classes as much as possible, but plain CSS scoped to each component can also be used where tailwind falls short.

There is a `tailwind-config` package that exports the configuration object itself as well as the base-styles.css file. So you first need to import both of them into the consuming Vue project:

An example of a `tailwind.config.cjs` file in the frontend app (the consuming repo), could look like this:

```js
const config = require('@jjdive/tailwind-config')

module.exports = {
  ...config, // Use the config as exported from the UI repo
  // But feel free to override with any tweaks you see fit for the particular app
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@jjdive/**/*.{vue,js,ts,jsx,tsx}', // This one is required so that your component's classes can be resolved
  ],
}
```

Then in your application's entry point:

```js
import '@jjdive/tailwind-config/base-styles.css'
```

... which will import the base tailwind directives implemented in the ui repo.

This way, any modification to the Design System can be modified in a single place, released as a single package and updated according on the consumers.

Don't move this tailwind package to another repo. It belongs here with the rest of the design system and it will be used for visual testing (pixel to pixel diffing).
