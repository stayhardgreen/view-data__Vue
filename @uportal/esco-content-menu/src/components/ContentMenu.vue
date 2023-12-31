<template>
  <div
    :class="['toggler-menu', _screenSize, !_isHidden ? 'active-menu' : '']"
    class="content-menu"
  >
    <header>
      <slot name="header-buttons">
        <header-buttons :call-on-close="close" :sign-out-url="signOutUrl" />
      </slot>
      <div class="wrapper">
        <slot name="content-user">
          <content-user
            :org-info="_userOrganization"
            :user-info="_user"
            :other-orgs="_organizations"
            :parent-screen-size="_screenSize"
            :default-org-logo="defaultOrgLogo"
            :force-org-logo="forceOrgLogo"
            :user-info-portlet-url="userInfoPortletUrl"
            :switch-org-portlet-url="switchOrgPortletUrl"
            :org-logo-url-attribute-name="orgLogoUrlAttributeName"
          />
        </slot>
        <content-favorites
          :portlets="_portlets"
          :favorites="_favorites"
          :call-after-action="actionToggleFav"
          :parent-screen-size="_screenSize"
          :portlet-card-size="favoritesPortletCardSize"
          :hide-action="hideAction"
          :favorite-api-url="favoriteApiUrl"
          :is-hidden="_isHidden"
          :user-info-api-url="userInfoApiUrl"
          :context-api-url="contextApiUrl"
          :debug="debug"
          :use-swipper="showFavoritesInSlider"
        />
      </div>
      <div
        :style="
          getOrgImgUrl() != null &&
          (_screenSize === 'large' || _screenSize === 'medium')
            ? 'background-image: linear-gradient(0deg, rgba(0,0,0,.2),rgba(0,0,0,.2)), url(' +
              getOrgImgUrl() +
              ');'
            : ''
        "
        class="background"
      />
    </header>
    <content-grid
      :messages="messages"
      :portlets="_portlets"
      :favorites="_favorites"
      :call-after-action="actionToggleFav"
      :parent-screen-size="_screenSize"
      :portlet-card-size="gridPortletCardSize"
      :hide-action="hideAction"
      :favorite-api-url="favoriteApiUrl"
      :layout-api-url="layoutApiUrl"
      :user-info-api-url="userInfoApiUrl"
      :context-api-url="contextApiUrl"
      :portlet-api-url="portletApiUrl"
      :debug="debug"
      :card-hover-src="cardHoverSrc"
    />
    <vue-simple-spinner
      v-show="isLoading"
      class="spinner"
      line-fg-color="#545454"
    />
  </div>
</template>

<script>
import ContentFavorites from './ContentFavorites';
import ContentGrid from './ContentGrid';
import ContentUser from './ContentUser';
import HeaderButtons from './HeaderButtons';
import vueSimpleSpinner from 'vue-simple-spinner';
import fetchUserInfoAndOrg from '../services/fetchUserInfoAndOrgs';
import fetchPortlets from '../services/fetchPortlets';
import fetchFavorites from '../services/fetchFavorites';
import { portletRegistryToArray } from '../services/portlet-registry-to-array';
import flattenFavorites from '../services/flattenFavorites';
import byPortlet from '../services/sortByPortlet';
import toggleArray from '../services/toggleArray';
import i18nMixin from '../mixins/i18n.js';
import {
  elementWidth,
  breakPointName,
  sizeValidator,
} from '../services/sizeTools';
import {
  getCurrentOrganization,
  getOrganizationLogo,
} from '../services/organizationHelper';
import computeUrl from '../services/computeUrl';

export default {
  name: 'ContentMenu',
  mixins: [i18nMixin],
  components: {
    ContentFavorites,
    ContentGrid,
    ContentUser,
    HeaderButtons,
    vueSimpleSpinner,
  },
  props: {
    id: { type: String, default: null },
    callOnClose: { type: Function, default: () => {} },
    isHidden: { type: Boolean, default: false },
    contextApiUrl: {
      type: String,
      default: process.env.VUE_APP_PORTAL_CONTEXT,
    },
    favoriteApiUrl: {
      type: String,
      default:
        process.env.VUE_APP_PORTAL_CONTEXT +
        process.env.VUE_APP_FAVORITES_PORTLETS_URI,
    },
    layoutApiUrl: {
      type: String,
      default:
        process.env.VUE_APP_PORTAL_CONTEXT + process.env.VUE_APP_FAVORITES_URI,
    },
    organizationApiUrl: {
      type: String,
      default: null,
    },
    portletApiUrl: {
      type: String,
      default:
        process.env.VUE_APP_PORTAL_CONTEXT +
        process.env.VUE_APP_BROWSABLE_PORTLETS_URI,
    },
    userInfoApiUrl: {
      type: String,
      default:
        process.env.VUE_APP_PORTAL_CONTEXT + process.env.VUE_APP_USER_INFO_URI,
    },
    debug: { type: Boolean, default: false },
    signOutUrl: { type: String, default: process.env.VUE_APP_LOGOUT_URL },
    defaultOrgLogo: { type: String, required: true },
    forceOrgLogo: { type: String },
    userInfoPortletUrl: { type: String, default: '' },
    switchOrgPortletUrl: { type: String, default: '' },
    favoritesPortletCardSize: {
      validator: (value) => sizeValidator(value, true),
      default: 'auto',
    },
    gridPortletCardSize: {
      validator: (value) => sizeValidator(value, true),
      default: 'auto',
    },
    hideActionMode: {
      validator: (value) => ['auto', 'always', 'never'].includes(value),
      default: 'auto',
    },
    userOrgIdAttributeName: { type: String, default: 'ESCOSIRENCourant[0]' },
    userAllOrgsIdAttributeName: { type: String, default: 'ESCOSIREN' },
    orgLogoUrlAttributeName: {
      type: String,
      default: 'otherAttributes.ESCOStructureLogo[0]',
    },
    showFavoritesInSlider: { type: Boolean, default: true },
    cardHoverSrc: { type: String, default: 'none' },
  },
  data() {
    return {
      backgroundImg: this.forceOrgLogo || this.defaultOrgLogo,
      screenSize: 'medium',
      hideAction: false,
      info: {
        favorites: [],
        organizations: [],
        user: {},
        userOrganization: {},
        portlets: [],
      },
      loadingState: {
        favorites: true,
        portlets: true,
        user: true,
        organization: true,
      },
    };
  },
  computed: {
    _portlets() {
      return this.info.portlets;
    },
    _isHidden() {
      return this.isHidden;
    },
    _screenSize() {
      return this.screenSize;
    },
    _user() {
      return this.info.user;
    },
    _organizations() {
      return this.info.organizations;
    },
    _userOrganization() {
      if (
        Object.keys(this.info.userOrganization).length === 0 &&
        this.info.userOrganization.constructor === Object
      ) {
        this.computeCurrentOrg();
      }
      return this.info.userOrganization;
    },
    _favorites() {
      return this.info.favorites;
    },
    isLoading() {
      return (
        !this.loadingState.favorites ||
        !this.loadingState.portlets ||
        !this.loadingState.user ||
        !this.loadingState.organization
      );
    },
  },
  watch: {
    isHidden: {
      handler() {
        if (!this.isHidden) {
          this.$nextTick(function () {
            this.calculateSize();
          });
        }
      },
    },
  },
  mounted() {
    this.fetchPortlets();
    this.fetchFavorites();
    this.fetchUserInfo();
    this.$nextTick(function () {
      window.addEventListener('resize', this.calculateSize);
      this.calculateSize();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize);
  },
  methods: {
    close(event) {
      const element = document.querySelector('#' + this.id);
      if (element?.parentNode) {
        element.parentNode.style.display = 'none';
        element.setAttribute('is-hidden', true);
      }
      this.callOnClose(event);
    },
    calculateSize() {
      this.screenSize = breakPointName(elementWidth(this.$el));

      switch (this.hideActionMode) {
        case 'auto':
          this.hideAction =
            this.screenSize === 'small' || this.screenSize === 'smaller';
          break;
        case 'never':
          this.hideAction = false;
          break;
        default:
          // case of 'always' hidden
          this.hideAction = true;
      }
    },
    computeCurrentOrg() {
      const currentOrganization = getCurrentOrganization(
        this.info.user,
        this.userOrgIdAttributeName,
        this.info.organizations
      );
      if (currentOrganization !== null) {
        this.info.userOrganization = Object.assign(
          {},
          this.info.userOrganization,
          currentOrganization
        );
        const logo =
          getOrganizationLogo(
            currentOrganization,
            this.orgLogoUrlAttributeName
          ) || this.defaultOrgLogo;
        this.backgroundImg = computeUrl(logo);
      }
    },
    getOrgImgUrl() {
      return this.forceOrgLogo || this.backgroundImg;
    },
    async fetchUserInfo() {
      this.loadingState.user = false;
      this.loadingState.organization = false;
      const { user, organizations } = await fetchUserInfoAndOrg(
        this.userInfoApiUrl,
        this.organizationApiUrl,
        this.userAllOrgsIdAttributeName,
        this.debug
      );
      this.info.user = Object.assign({}, this.info.user, user);
      this.loadingState.user = true;
      this.info.organizations = organizations;
      this.loadingState.organization = true;
    },
    async fetchPortlets() {
      this.loadingState.portlets = false;
      const portlets = await fetchPortlets(
        this.userInfoApiUrl,
        this.portletApiUrl,
        this.debug
      );
      this.info.portlets = portletRegistryToArray(portlets).sort(byPortlet);
      this.loadingState.portlets = true;
    },
    async fetchFavorites() {
      this.loadingState.favorites = false;
      const favoritesTree = await fetchFavorites(
        this.userInfoApiUrl,
        this.layoutApiUrl,
        this.debug
      );
      this.info.favorites = flattenFavorites(favoritesTree);
      this.loadingState.favorites = true;
    },
    actionToggleFav(fname) {
      this.info.favorites = toggleArray(this.info.favorites, fname);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.content-menu {
  min-width: 280px;
  background-color: #d0d0d0;

  /* same value as @zindex-navbar-fixed from bootstrap. */
  z-index: 1030;

  * {
    font-family: Roboto, sans-serif;
  }

  > section {
    padding: 0.5em 1.5em;
  }

  header {
    position: relative;
    overflow: hidden;

    > :not(:last-child) {
      position: relative;
      z-index: 1;
    }

    > .wrapper {
      display: flex;
      flex-flow: row nowrap;

      .content-favorites {
        flex-grow: 1;
        filter: none;
        overflow: hidden;
      }
    }

    div.background {
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      width: 110%;
      height: 110%;
      overflow: hidden;
      top: 0;
      z-index: 0;
      filter: blur(7px);
    }
  }

  .spinner {
    position: fixed;
    z-index: 1040;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #545454;
    opacity: 0.7;
    display: flex;
    align-items: center;

    > .vue-simple-spinner {
      opacity: 1;
    }
  }

  &.small,
  &.smaller {
    background-color: #545454;

    > section {
      padding: 0.5em;
    }

    header {
      div.background {
        background-image: none;
      }

      .header-buttons {
        position: absolute;
        width: 100%;
        z-index: 2;
      }

      > .wrapper {
        flex-flow: row wrap;
      }
    }

    > ::v-deep section.content-grid {
      > div {
        background-color: #f3f3f3;

        > .title {
          background-color: #fff;
        }
      }
    }
  }
}
</style>
