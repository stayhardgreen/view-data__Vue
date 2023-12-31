<template>
  <section
    :class="['parent-' + parentScreenSize, calculatedSize]"
    :style="'background-color:' + backgroundColor"
    class="content-favorites"
  >
    <div class="content-favorites-title">
      <h1>
        {{ translate('message.favorites.title') }}
      </h1>
    </div>
    <div
      ref="favsSection"
      :style="favorited.length > 0 ? '' : 'display:none'"
      class="favorites"
    >
      <template v-if="useSwipper">
        <swiper
          ref="favSwiper"
          :options="swiperOption"
          :reach-end="updateSlider"
        >
          <swiper-slide v-for="portlet in favorited" :key="portlet.id">
            <a
              :href="getRenderPortletUrl(portlet)"
              :target="hasAlternativeMaximizedUrl(portlet) ? '_blank' : '_self'"
              :rel="
                hasAlternativeMaximizedUrl(portlet) ? 'noopener noreferrer' : ''
              "
              class="no-style"
            >
              <portlet-card
                :portlet-desc="portlet"
                :is-favorite="true"
                :size="_portletCardSize"
                :hide-action="hideAction"
                :call-after-action="callAfterFavAction"
                :back-ground-is-dark="true"
                :favorite-api-url="favoriteApiUrl"
                :user-info-api-url="userInfoApiUrl"
                :debug="debug"
              />
            </a>
          </swiper-slide>
        </swiper>
        <div
          slot="button-prev"
          :class="disablePrev ? 'fav-swiper-button-disabled' : ''"
          class="swiper-button-prev"
          @click="slidePrev($event)"
        >
          <font-awesome-icon icon="chevron-left" />
        </div>
        <div
          slot="button-next"
          :class="disableNext ? 'fav-swiper-button-disabled' : ''"
          class="swiper-button-next"
          @click="slideNext($event)"
        >
          <font-awesome-icon icon="chevron-right" />
        </div>
      </template>
      <template v-else>
        <content-grid
          hide-title
          :call-after-action="callAfterFavAction"
          :portlet-card-size="_portletCardSize"
          :favorites="favorites"
          :portlets="favorited"
          :hide-action="hideAction"
          :favorite-api-url="favoriteApiUrl"
          :user-info-api-url="userInfoApiUrl"
          portlet-background-is-dark
          :parent-screen-size="parentScreenSize"
          :context-api-url="contextApiUrl"
          :portlet-api-url="portletApiUrl"
          :debug="debug"
        />
      </template>
    </div>
    <div
      :style="favorited.length > 0 ? 'display:none' : ''"
      class="empty-favorites"
    >
      <div>
        {{ translate('message.favorites.empty') }}
      </div>
    </div>
  </section>
</template>

<script>
import i18n from '../i18n.js';
import PortletCard from './PortletCard';
import '../icons.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { elementWidth, sizeValidator } from '../services/sizeTools';
import byFavoriteOrder from '../services/sortByFavoriteOrder';
import {
  hasAlternativeMaximizedUrl,
  getRenderUrl,
} from '../services/managePortletUrl';
import ContentGrid from './ContentGrid';

export default {
  name: 'ContentFavorites',
  components: {
    ContentGrid,
    PortletCard,
    Swiper,
    // false positive
    // eslint-disable-next-line vue/no-unused-components
    SwiperSlide,
    FontAwesomeIcon,
  },
  props: {
    backgroundColor: { type: String, default: 'rgba(0, 0, 0, 0)' },
    callAfterAction: { type: Function, default: () => {} },
    isHidden: { type: Boolean, default: false },
    favoriteApiUrl: {
      type: String,
      default:
        process.env.VUE_APP_PORTAL_CONTEXT +
        process.env.VUE_APP_FAVORITES_PORTLETS_URI,
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
    favorites: { type: Array, required: true, default: () => [] },
    parentScreenSize: {
      validator: sizeValidator(),
      default: 'medium',
    },
    portletCardSize: {
      validator: (value) => sizeValidator(value, true),
      default: 'auto',
    },
    hideAction: { type: Boolean, default: false },
    portlets: { type: Array, required: true, default: () => [] },
    contextApiUrl: {
      type: String,
      default: process.env.VUE_APP_PORTAL_CONTEXT,
    },
    useSwipper: { type: Boolean, default: true },
  },
  data() {
    return {
      swiperOption: {
        init: false,
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        spaceBetween: 0,
        speed: 800,
        freeMode: true,
        /** These params doesn't work after build */
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true
        // },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      calculatedSize: this.parentScreenSize,
      disableNext: false,
      disablePrev: false,
    };
  },
  watch: {
    favorites: {
      handler() {
        this.updateSlider();
      },
      deep: true,
    },
    portlets: {
      handler() {
        this.updateSlider();
      },
      deep: true,
    },
    isHidden: {
      handler() {
        this.updateSlider();
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('resize', this.timedUpdate);
      this.updateSlider();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.timedUpdate);
  },
  computed: {
    _portletCardSize() {
      if (this.portletCardSize === 'auto') {
        return this.calculatedSize;
      } else return this.portletCardSize;
    },
    favorited() {
      return this.portlets
        .filter((portlet) => this.favorites.includes(portlet.fname))
        .sort(byFavoriteOrder(this.favorites));
    },
  },
  methods: {
    translate(text, lang) {
      return i18n.t(text, lang);
    },
    hasAlternativeMaximizedUrl(portletDesc) {
      return hasAlternativeMaximizedUrl(portletDesc);
    },
    getRenderPortletUrl(portletDesc) {
      return getRenderUrl(portletDesc, this.contextApiUrl);
    },
    calculateSize() {
      if (this.portletCardSize === 'auto') {
        const _size = elementWidth(this.$refs.favsSection);
        if (this.parentScreenSize === 'smaller' || _size < 660) {
          this.calculatedSize = 'smaller';
        } else if (this.parentScreenSize === 'small' || _size < 1280) {
          this.calculatedSize = 'small';
        } else if (this.parentScreenSize === 'medium' || _size < 1680) {
          this.calculatedSize = 'medium';
        } else {
          this.calculatedSize = 'large';
        }
      } else {
        this.calculatedSize = this.portletCardSize;
      }
    },
    callAfterFavAction(favorite, fname) {
      this.updateSlider();
      this.callAfterAction(favorite, fname);
    },
    slideNext(event) {
      event.preventDefault();
      this.$refs.favSwiper.$swiper.slideNext(800);
      this.updateSlider();
    },
    slidePrev(event) {
      event.preventDefault();
      this.$refs.favSwiper.$swiper.slidePrev(800);
      this.updateSlider();
    },
    timedUpdate() {
      setTimeout(() => {
        this.updateSlider();
      }, 300);
    },
    updateSlider() {
      if (this.useSwipper && !this.isHidden && this.favorited.length > 0) {
        if (!this.$refs.favSwiper.$swiper.initialized) {
          this.$refs.favSwiper.$swiper.init();
        } else {
          this.$refs.favSwiper.$swiper.update();
        }
        this.disableNext = this.$refs.favSwiper.$swiper.isEnd;
        this.disablePrev = this.$refs.favSwiper.$swiper.isBeginning;
      }
      this.calculateSize();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../node_modules/swiper/css/swiper.css';
@import './../styles/vars.scss';

$buttonWidth: 32px;

.content-favorites {
  width: inherit;
  color: #fff;
  padding-bottom: 1.5em;
  display: flex;
  flex-flow: column;
  justify-content: center;
  text-align: left;

  > .content-favorites-title {
    margin: 0 0 5px 2em;
    text-transform: uppercase;
    filter: grayscale(1);

    h1 {
      font-size: 24px;
      font-weight: normal;
      margin: 10px 0 5px 10px;
      color: white;
    }
  }

  > .favorites {
    position: relative;
    padding: 0 2em;

    > ::v-deep .content-grid {
      > div .flex-grid {
        justify-content: flex-start;

        .flex-item {
          margin: 0;
        }

        .flex-item.portlet-card-medium,
        .flix-item.portlet-card-large {
          margin: $buttonWidth 5px 5px 0;
        }
      }
    }

    > .swiper-container {
      margin: 0 15px;
      padding-bottom: 30px;

      > .swiper-wrapper {
        > .swiper-slide {
          width: $PortletCardSizeLarge;
          height: 170px;
          margin: $buttonWidth;

          &:first-child {
            margin-left: 0;
          }
        }
      }

      .swiper-pagination {
        bottom: 0;

        > span.swiper-pagination-bullet {
          width: 16px;
          height: 16px;
          margin: 0 8px;
          color: white;
        }
      }
    }

    .swiper-button-prev,
    .swiper-button-next {
      background-image: none;
      color: white;
      margin-top: 0;
      width: $buttonWidth;
      height: $buttonWidth;
      text-align: center;
      &::after {
        content: none;
      }
    }

    .swiper-button-prev {
      left: 0;
    }

    .swiper-button-next {
      right: 0;
    }

    .fav-swiper-button-disabled {
      opacity: 0.35;
      cursor: auto;
      pointer-events: none;
    }

    a.no-style {
      text-decoration: none;
      color: inherit;
    }
  }

  > .empty-favorites {
    padding-left: 2em;
  }

  &.parent-small,
  &.parent-smaller {
    > .content-favorites-title h1 {
      font-size: initial;
      font-weight: bold;
    }
  }

  &.small,
  &.smaller {
    > .favorites {
      > .swiper-container,
      > .content-grid {
        margin: 0;
      }

      > .swiper-container {
        > .swiper-wrapper {
          > .swiper-slide {
            height: auto;
            margin: 0;
          }

          .swiper-slide ~ .swiper-slide {
            margin-left: 5px;
          }
        }
      }
    }
  }

  &.medium > .favorites > .swiper-container > .swiper-wrapper > .swiper-slide {
    width: $PortletCardSizeMedium;
    height: 160px;
  }

  &.small > .favorites > .swiper-container > .swiper-wrapper > .swiper-slide {
    width: $PortletCardSizeSmall;
  }

  &.smaller > .favorites > .swiper-container > .swiper-wrapper > .swiper-slide {
    width: $PortletCardSizeSmaller;
  }

  @media (hover: none) and (pointer: coarse) {
    .swiper-button-prev,
    .swiper-button-next {
      display: none;
    }
  }

  .svg-inline--fa {
    width: auto;
    height: 2em; /* or any other relative font sizes */

    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
