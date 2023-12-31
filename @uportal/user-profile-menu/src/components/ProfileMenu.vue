<template>
  <div class="profile-menu-container" ref="userProfileMenu">
    <button class="profile-trigger" :class="{'active': menuOpen}" @click="toggleMenu()">
      <div class="avatar">
        <img :src="avatarUrl" v-if="avatarUrl && !useInitials" />
        <span class="fallback" v-else>{{ fallbackText }}</span>
      </div>
      <span :class="{'sr-only': !useName}">{{ displayText }}</span>
    </button>
    <div class="profile-dropdown" v-if="menuOpen">
      <div class="profile-dropdown-section profile-dropdown-header">
        <slot name="header"></slot>
      </div>
      <div class="profile-dropdown-section profile-dropdown-content">
        <slot name="default"></slot>
      </div>
      <div class="profile-dropdown-section profile-dropdown-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import oidc from '@uportal/open-id-connect';

export default {
  name: 'profile',
  data() {
    return {
      menuOpen: false,
      user: {
        name: '',
        family_name: '',
        given_name: '',
        image: null
      },
      dataLoaded: false,
      hasError: false,
      errorMessage: ''
    };
  },
  computed: {
    avatarUrl: function() {
      return this.user.image;
    },
    displayText: function() {
      return this.user.name;
    },
    fallbackText: function() {
      return (
        this.user.given_name.substr(0, 1) + this.user.family_name.substr(0, 1)
      );
    }
  },
  props: {
    useInitials: { type: Boolean, default: false, required: false },
    useName: { type: Boolean, default: true, required: false },
    oidcUrl: {
      type: String,
      default: '/uPortal/api/v5-1/userinfo'
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    handleOutsideClick(event) {
      const menu = this.$refs.userProfileMenu;
      const target = event.target;
      const shadow = target.shadowRoot ? target.shadowRoot : false;
      if (menu !== target && !shadow && !menu.contains(target)) {
        this.menuOpen = false;
      }
    },
    handleOidcError() {
      this.hasError = true;
      this.errorMessage = 'There was a problem authorizing this request.';
    },
    async getToken() {
      try {
        return await oidc({ userInfoApiUrl: this.oidcUrl });
      } catch (err) {
        this.handleOidcError(err);
      }
    },
    async fetchMenuData() {
      const token = this.debug ? null : (await this.getToken()).decoded;
      this.user = token;
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick, false);
    this.fetchMenuData();
  }
};
</script>
<style lang="scss" scoped>
.profile-menu-container ::v-deep {
  @import '../../node_modules/bootstrap/scss/bootstrap';

  color: white;
  display: flex;
  margin-left: auto;
  position: relative;
  padding: 0;

  a {
    text-decoration: none;
    color: #495057;
    color: var(--user-profile-menu-fg-color, #495057);
  }

  .profile-trigger {
    color: #fff;
    color: var(--user-profile-fg-color, #fff);
    padding: var(--user-profile-trigger-padding, 0);
    margin-left: auto;
    background: transparent;
    border: 0 none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    background-color: var(--user-profile-trigger-bg-color, transparent);

    &.active {
      background-color: var(--user-profile-trigger-bg-color-active, transparent);
    }

    .avatar {
      $default-avatar-size: 30px;

      border-radius: 50%;
      overflow: hidden;
      margin: 0 0.2em;
      background-color: #ccc;
      background-color: var(--user-profile-fallback-bg-color, #ccc);
      color: #333;
      color: var(--user-profile-fallback-fg-color, #333);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      width: var(--user-profile-avatar-size, $default-avatar-size);
      height: 30px;
      height: var(--user-profile-avatar-size, $default-avatar-size);
      font-size: 30px;
      font-size: var(--user-profile-avatar-size, $default-avatar-size);

      .fallback {
        font-size: 0.5em;
      }

      img {
        object-fit: cover;
        height: 100%;
        width: 100%;
      }
    }
  }

  .profile-dropdown {
    position: absolute;
    top: 125%;
    top: var(--user-profile-dropdown-top-position, 125%);
    right: 0;
    right: var(--user-profile-dropdown-right-position, 0);
    z-index: 1000;
    z-index: var(--user-profile-dropdown-z-position, 1000);
    display: flex;
    min-width: 10rem;
    margin: 0.125rem 0 0;
    margin: var(--user-profile-dropdown-margin, 0.125rem 0 0);
    font-size: var(--user-profile-dropdown-font-size, 1rem);
    color: hsl(210, 11%, 15%);
    text-align: left;
    list-style: none;
    background-color: #FFF;
    background-color: var(--user-profile-dropdown-background, #FFF);
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border: var(--user-profile-dropdown-border, 1px solid rgba(0, 0, 0, 0.05));
    width: 220px;
    width: var(--user-profile-dropdown-width, 220px);
    flex-direction: column;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    box-shadow: var(--user-profile-dropdown-shadow, 0 0 4px rgba(0, 0, 0, 0.25));
  }

  .profile-dropdown-section {
    &:empty {
      display: none;
    }

    &.profile-dropdown-footer,
    &.profile-dropdown-header {
      padding: 1em;
      font-size: 1.2em;
      background-color: #eee;
      background-color: var(--user-profile-header-bg-color, #eee);
      color: #000;
      color: var(--user-profile-header-fg-color, #000);
    }

    &.profile-dropdown-content {
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
    }

    .list-group .list-group-item {
      &, &.list-group-item-action {
        background-color: var(--user-profile-dropdown-item-bg-color, #FFF);
        color: var(--user-profile-dropdown-item-fg-color, black);
      }

      &.list-group-item-action {
        &:hover {
          background-color: var(--user-profile-dropdown-item-bg-color-hover, #FFF);
          color: var(--user-profile-dropdown-item-fg-color-hover, black);
        }
      }
    }

  }
}
</style>
