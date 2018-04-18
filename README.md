# uPortal WebComponents

[![Build Status](https://travis-ci.org/ChristianMurphy/uPortal-webcomponents.svg?branch=master)](https://travis-ci.org/ChristianMurphy/uPortal-webcomponents)

> A collection of reusable, standardized, and accessible [web components][] for [uPortal][]

## Installation

There are couple options for installing components:

* a [node][] package through [npm][] or [yarn][]
* a [webjar][] through [gradle][] or [maven][]

```bash
# install with npm
npm install @uportal/{package name goes here}

# install with yarn
yarn add @uportal/{package name goes here}
```

_install with maven_

```xml
<dependency>
    <groupId>org.webjars.npm</groupId>
    <artifactId>uportal__{package name goes here}</artifactId>
    <version>{version number goes here}</version>
</dependency>
```

_install with gradle_

```gradle
compile 'org.webjars.npm:uportal__{package name goes here}:{version number goes here}'
```

## Usage

To install any component, add a tag with the component's name, and a script tag pointing to the JavaScript bundle for that component.

For example an `example-component` would be loaded by adding

```html
<example-component></example-component>
<script src="node_modules/@uportal/example-component/dist/js/example-component.js"></script>
```

## Contribute

uPortal WebComponents are built by people just like you! Check out [CONTRIBUTING.md][] for ways to get started.

Want to chat with the community and contributors? Join us in [Slack][]!

[node]: https://nodejs.org
[npm]: https://docs.npmjs.com/
[gradle]: https://docs.gradle.org
[maven]: http://maven.apache.org/
[uportal]: https://github.com/Jasig/uPortal
[web components]: https://www.webcomponents.org/introduction
[webjar]: https://www.webjars.org/
[yarn]: https://yarnpkg.com/en/
[contributing.md]: CONTRIBUTING.md
[slack]: https://apereo.slack.com
