<template>
  <div id="app">
    <!--<hamburger-menu
      messages='[{"locales": ["en", "en-US"], "messages": { "message": {"favorites": { "add": "Add me to your favorites!" } }}}]'
      default-org-logo="https://lycees.netocentre.fr/annuaire_images/default_banner_v1.jpg"
      favorites-portlet-card-size="small"
      grid-portlet-card-size="auto"
      hide-action-mode="never"
      portlet-api-url="portletRegistry.json"
      layout-api-url="layout.json"
      organization-api-url="orginfo.json"
      user-info-api-url="userinfo.json"
      debug />
    -->
    <!-- <content-grid
      background-color="grey"
      portlet-card-size="medium"
      portlet-api-url="portletRegistry.json"
      layout-api-url="layout.json"
      debug /> -->
    <content-menu
      messages='[{"locales": ["en", "en-US"], "messages": { "message": {"favorites": { "add": "Add me to your favorites!" } }}}]'
      default-org-logo="https://lycees.netocentre.fr/annuaire_images/default_banner_v1.jpg"
      favorites-portlet-card-size="small"
      grid-portlet-card-size="auto"
      hide-action-mode="never"
      portlet-api-url="portletRegistry.json"
      layout-api-url="layout.json"
      organization-api-url="orginfo.json"
      user-info-api-url="userinfo.json"
      card-hover-src="title"
      :show-favorites-in-slider="false"
      debug
    >
      <!--      <div slot="content-user"></div>-->
    </content-menu>
  </div>
</template>

<script>
import ContentMenu from './components/ContentMenu.vue';
// import ContentGrid from './components/ContentGrid.vue';
// import HamburgerMenu from './components/HamburgerMenu.vue';

export default {
  name: 'App',
  components: {
    ContentMenu,
    // ContentGrid,
    // HamburgerMenu,
  },
};
</script>

<style lang="scss">
#app {
  background-color: #000;
  height: 1800px;
  width: 100%;

  .hamburger-menu > div.content-menu-toggle {
    padding: 0.5em;
  }
}
</style>
