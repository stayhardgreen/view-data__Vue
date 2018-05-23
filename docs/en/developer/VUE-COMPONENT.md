# Creating a Vue Web Component

## Prerequisites

* [Git][]
* [Node.js][] (using [NVM][] is recommended)
* [Vue CLI][]

## Setup

```sh
# clone the repository if you haven't already
git clone https://github.com/uPortal-contrib/uPortal-web-components

# navigate to the packages folder
cd uPortal-web-components/@uportal

# generate a new application template
# replace {component-name} with the desired name for the component
vue create {component-name} --default

# navigate into newly created component folder
cd {component-name}
```

open _package.json_ in an editor
edit the build step to automatically generate a web component

```diff
- "build": "vue-cli-service build",
+ "build": "vue-cli-service build --name {component-name} --target wc",
```

Done!
There is now a new component added to the project.

Use `yarn` and `yarn start` to start a demo web server and follow the [Vue guide][] to see how to build a component

[git]: https://git-scm.com/download
[node.js]: https://nodejs.org/en/download/
[nvm]: https://github.com/creationix/nvm#readme
[vue cli]: https://github.com/vuejs/vue-cli
[vue guide]: https://vuejs.org/v2/guide/
