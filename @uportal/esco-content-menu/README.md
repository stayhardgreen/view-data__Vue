# ESCO Content Menu

[![NPM Version](https://img.shields.io/npm/v/@uportal/esco-content-menu.svg)](https://www.npmjs.com/package/@uportal/esco-content-menu)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/org.webjars.npm/uportal__esco-content-menu/badge.svg)](https://maven-badges.herokuapp.com/maven-central/org.webjars.npm/uportal__esco-content-menu)
[![Build Status](https://travis-ci.org/uPortal-contrib/uPortal-web-components.svg?branch=master)](https://travis-ci.org/uPortal-contrib/uPortal-web-components)

## Installation

```bash
# install with npm
npm install @uportal/esco-content-menu

# install with yarn
yarn add @uportal/esco-content-menu
```

_install with maven_

```xml
<dependency>
    <groupId>org.webjars.npm</groupId>
    <artifactId>uportal__esco-content-menu</artifactId>
    <version>{version number goes here}</version>
</dependency>
```

_install with gradle_

```gradle
compile 'org.webjars.npm:uportal__esco-content-menu:{version number goes here}'
```

## Usage as Web Component

### The hamburger menu

This is the main component that show a hamburger menu and that open an entire page with `content-menu` component.

#### Html

```html
<script src="/resource-server/webjars/vue/dist/vue.min.js"></script>
<script
  src="/resource-server/webjars/uportal__esco-content-menu/dist/esco.min.js"
  defer
></script>

<esco-hamburger-menu
  context-api-url="/uPortal"
  sign-out-url="/uPortal/Logout"
  default-org-logo="https://www.toureiffel.paris/sites/default/files/styles/1440x810/public/2017-10/monument-landing-header-bg_0.jpg?itok=_dSLLBlZ"
  user-info-portlet-url="/uPortal/user-details"
  favorites-portlet-card-size="small"
  grid-portlet-card-size="auto"
  hide-action-mode="never"
>
</esco-hamburger-menu>
```

For some integration you could need a bit more, like into uPortal you will need to add a parent div and to apply on his closest parent `section` a style `float: left`.

#### Properties

- `context-api-url`: type: `String`, default: `/uPortal`, usefull to provide a different uPortal context on which to do request
- `sign-out-url`: type: `String`, default: `/uPortal/Logout`, an uri/url to call when user logout (for a logout button),
- `default-org-logo`: type: `String`, required: true, an url/uri to provide an institutional picture when none is found from an optional api (not provided into uPortal),
- `user-info-portlet-url`: type: `String`, default: `''`, an url/uri to the user information application,
- `switch-org-portlet-url`: type: `String`, default: `''`, an optional url/url of a rest api to obtain institutional organization information,
- `favorites-portlet-card-size`: type: possible value `auto|large|medium|small|smaller`, default: `auto`, define the size of portlet-cards component into `favorite-content` component part,
- `grid-portlet-card-size`: type: possible value `auto|large|medium|small|smaller`, default: `auto`, define the size of `portlet-cards` component into `grid-content` component part,
- `hide-action-mode: type`: possible value `auto|always|never`, default: `auto`, define if we should show the actions, `auto` don't show on `small` breakpoint,
- `user-org-id-attribute-name`: type: `String`, default: `'ESCOSIRENCourant[0]'`, the attribute object path to obtain the id of the organization to retrieve from the organization's api
- `user-all-orgs-id-attribute-name`: type: `String`, default: `'ESCOSIREN`, the attribute object path to obtain all ids of the organizations linked to the user and to retrieve from the organization's api
- `org-logo-url-attribute-name`: type: `String`, default: `'otherAttributes.ESCOStructureLogo[0]'`, the attribute object path to obtain the organization Picture from organization details obtained from the organization's api.

### The content menu

This component is a main one as it will load into one page all main elements (the user + organization information, the favorites and the list of services )

#### Html

```html
<script src="/resource-server/webjars/vue/dist/vue.min.js"></script>
<script
  src="/resource-server/webjars/uportal__esco-content-menu/dist/esco.min.js"
  defer
></script>

<esco-content-menu
  sign-out-url="/uPortal/Logout"
  default-org-logo="https://www.toureiffel.paris/sites/default/files/styles/1440x810/public/2017-10/monument-landing-header-bg_0.jpg?itok=_dSLLBlZ"
  user-info-portlet-url="/uPortal/user-details"
  favorites-portlet-card-size="small"
  grid-portlet-card-size="auto"
  hide-action-mode="never"
>
</esco-content-menu>
```

#### Properties

This use the same properties from the `hamburger-menu` (see on `hamburger-menu` details):

- `context-api-url`
- `sign-out-url`
- `default-org-logo`
- `user-info-portlet-url`
- `switch-org-portlet-url`
- `favorites-portlet-card-size`
- `grid-portlet-card-size`
- `hide-action-mode`
- `user-org-id-attribute-name`
- `user-all-orgs-id-attribute-name`
- `org-logo-url-attribute-name`

and with additional properties to work with the `hamburger-menu`:

- `call-on-close`: type: `Function`, default: `{}`, provide to this property a callback function to call after clicking on the header-button close of the `header-buttons` component.
- `is-hidden`: type: `Boolean`, default: `false`, used by the `hamburger-menu` to indicate the state of the page.
- `id`: type: `String`, default: `null`, provide an id to be able to select the dome element, as example if you want to manage manualy an `hamburger-menu`

### The content grid

This component provide a flexbox way to show a list of `portlet-card`, depending on uPortal rest-api.

#### Html

```html
<script src="/resource-server/webjars/vue/dist/vue.min.js"></script>
<script
  src="/resource-server/webjars/uportal__esco-content-menu/dist/esco.min.js"
  defer
></script>

<esco-content-grid
  portlet-card-size="gridPortletCardSize"
  hide-action="hideAction"
>
</esco-content-grid>
```

#### Properties

Standalone properties:

- `background-color`: type: `String`, default: `rgba(0, 0, 0, 0)`, to apply a different background-color
- `call-after-action`: type: `Function`, default: `undefined`, a callback function to call into `portlet-card` embeding `action-favorite` after adding portlet to favorites,
- `favorite-api-url`: type: `String`, default: `/uPortal/api/layout`, the uri/url of the favorites api
- `context-api-url`: type: `String`, default: `/uPortal`, usefull to provide a different uPortal context on which to do request,
- `userInfo-api-url`: type: `String`, default: `/uPortal/api/v5-1/userinfo`, url/uri on which the api request is done to obtain user information and the jwt tocken
- `portlet-card-size`: type: possible value `auto|large|medium|small|smaller`, default: `auto`, define the size of `portlet-cards` component.
- `hide-action: type`: `Boolean`, default: `false`, define to hide or not the `action-favorite` button defined into `portlet-card`
- `show-footer-categories`: `Boolean`, default: `false`, define to display category dropdown filter near bottom of grid
- `hide-title`: `Boolean`, default: `false`, define to remove the title area from the grid, useful when a basic grid is desired

and additional properties to work with the parent component `content-menu`:

- `parent-screen-size`: type: possible value `large|medium|small|smaller`, default: `medium`, permit to indicate the breakpoint view of the parent.
- `portlets`: type: `Array`, default: `undefined`, used if the list of portlets is loaded and provided from a parent component,
- `favorites`: type: `Array`, default: `undefined`, used if the list of favorites portlets loaded and provided from a parent component,

### The action favorite

The component `action-favorite` is really simple, it show a start button that permit to add or remove from favorites a portlet.

### Html

```html
<script src="/resource-server/webjars/vue/dist/vue.min.js"></script>
<script
  src="/resource-server/webjars/uportal__esco-content-menu/dist/esco.min.js"
  defer
></script>

<esco-action-favorite portlet-card-size="small" hide-action="false">
</esco-action-favorite>
```

#### Properties

- `call-on-toggle-fav`: type: `Function`, default: `{}`, a callback function called after the click event on the button,
- `chan-id`: type: `String`, required: `true`, the portlet id to add or remove from user favorites,
- `favorite-api-url`: type: `String`, default: `/uPortal/api/layout`, the uri/url of the favorites api,
- `user-info-api-url`: type: `String`, default: `/uPortal/api/v5-1/userinfo`, url/uri on which the api request is done to obtain user information and the jwt tocken,
- `fname`: type: `String`, required: `true`, the portlet fname that permit to identify the portlet into favorite's list, usefull for the callback function and apply a css class,
- `is-favorite`: type: `Boolean`, default: `false`, provide the favorite state,
- `back-ground-is-dark`: type: `Boolean`, default: `false`, permit to apply a style depending on background color, as the component is used as embeded,

### The content favorites

The component is functional only into the `content-menu`, it needs that a portlet list and favorite list is passed

Somme work would be needed to move on the `content-carousel`.

### The content user

This component permit to show user information with his organization information.
Few work would be need to be able to use it as a standalone component: like having a fetch service like for portlets or favorite. But some parts are institutional developpments to be able to obtain organization informations, so we are waiting new usecase before to do something.

#### Html

Need some work for a standalone use.

#### Properties

- `org-info`: type: `Object`, default: `{}`, the current user organization detail object,
- `other-orgs`: type: `Array`, default: `[]`, all other organizations details object when the user have several,
- `user-info`: type: `Object`, required: `true`, the user information object,
- `switch-org-portlet-url`: type: `String`, default: `'''`, an url/uri where the user can switch of organization when having several (tenant use part),
- `default-org-logo`: type: `String`, required: `true`, an url/uri to provide an institutional picture when none is found from an optional api (not provided into uPortal),
- `user-info-portlet-url`: type: `String`, default: `''`, an url/uri to the user information application,
- `org-logo-url-attribute-name`: type: `String`, default: `'otherAttributes.ESCOStructureLogo[0]'`, the attribute object path to obtain the organization Picture from organization details obtained from the organization's api.

and additional properties to work with the parent component `content-menu`:

- `parent-screen-size`: type: possible value `large|medium|small|smaller`, default: `medium`, permit to indicate the breakpoint view of the parent.

### The portlet card

This component render informations about a portlet as a card.

#### Html

```html
<script src="/resource-server/webjars/vue/dist/vue.min.js"></script>
<script
  src="/resource-server/webjars/uportal__esco-content-menu/dist/esco.min.js"
  defer
></script>

<esco-portlet-card portlet-desc="portlet" size="small" hide-action="true">
</esco-portlet-card>
```

#### Properties

- `portlet-desc`: type: `Object`, required: `true`, the portlet description object
- `size`: type: possible value `large|medium|small|smaller`, default: `medium`, the fixed size of card to apply
- `hide-action: type`: `Boolean`, default: `false`, define to hide or not the `action-favorite` button
- `back-ground-is-dark`: type: `Boolean`, default: `false`, permit to apply a style depending on background color, as the component is used as embeded,
- `is-favorite`: type: `Boolean`, default: `false`, provide the favorite state (passed to the `action-favorite` component),
- `call-after-action`: type: `Function`, default: `{}`, callback function to call after click on `action-favorite` button (passed to the `action-favorite` component),
- `icon-background-color`: type: `String`, default: `Transparent`, could be used to apply a background-color behind a portlet icon - usecase if there isn't background on icon.
- `favorite-api-url`: type: `String`, default: `/uPortal/api/layout`, the uri/url of the favorites api (passed to the `action-favorite` component),
- `user-info-api-url`: type: `String`, default: `/uPortal/api/v5-1/userinfo`, url/uri on which the api request is done to obtain user information and the jwt tocken, (passed to the `action-favorite` component),

### The ellipsis

This component permit to apply an auto-fit/trunc or a line-clamping to a text when the div size should be limited. It avoids to apply an overflow: hidden and permit to manage an ellipsis on several line.

#### Html

```html
<script src="/resource-server/webjars/vue/dist/vue.min.js"></script>
<script src="/resource-server/webjars/uportal__esco-content-menu/dist/esco.min.js" defer></script>

<esco-ellipsis
  message="text">
</esco-elipsis>
```

#### Properties

- `message`: type: `String`, default: `''`, the text to "ellipsise",
- `line-clamp`: type: `Number`, default: `0`, when we want a number of line, else will apply an auto-fit on te available size (the parent should have a defined height),
- `line-height`: type: `String`, default: `'22px'`, the line heigth of the text is required for the auto-fit,
- `end-char`: type: `String`, default: `'...'`, a text to apply when a trunc appear,
- `end-html`: type: `String`, default: `''`, a text to apply at end of the html.

### The header buttons

This component render a header part with some main buttons, like closing the page menu or to sign out.

#### Html

```html
<script src="/resource-server/webjars/vue/dist/vue.min.js"></script>
<script
  src="/resource-server/webjars/uportal__esco-content-menu/dist/esco.min.js"
  defer
></script>

<esco-header-button call-on-close="function"> </esco-header-button>
```

#### Properties

- `call-on-close`: type: `Function`, default: `{}`, callback function on click on the close button,
- `sign-out-url`: type: `String`, default: `/uPortal/Logout`, an uri/url to call when user logout (for a logout button),

## FAQ

- Q: What does "ESCO" mean?
- A: "ESCO" is an abbreviation of "e-scolaire", French for Online School.
