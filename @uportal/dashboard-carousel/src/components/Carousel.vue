<template>
  <div class="carousel">
    <template v-if="!dashboard || !dashboard.length">
      <slot name="empty">
        <p>no results found</p>
      </slot>
    </template>

    <template v-else>
      <Slick
        ref="slick"
        :options="computedSlickOptions"
        @afterChange="handleAfterChange"
      >
        <div class="slick-item" v-for="region of dashboard" :key="region.name">
          <div v-for="card of region.content" :key="card.name">
            <template v-if="card.lifecycleState === 'MAINTENANCE'">
              <div
                :style="{ height: '100%', width: '100%' }"
                :title="card.parameters.customMaintenanceMessage"
              >
                <h1
                  class="text-warning h1 mb-0"
                  :style="{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    class="bi bi-exclamation-circle"
                  >
                    <path
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                    ></path>
                    <path
                      d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"
                    ></path>
                  </svg>
                  &nbsp; Out of Service
                </h1>
              </div>
            </template>
            <template v-else>
              <template v-if="card.widgetTemplate">
                <WidgetRenderer
                  :template="card.widgetTemplate"
                  :config="card.widgetConfig"
                  :url="card.widgetURL"
                  :type="card.widgetType"
                  :debug="debug"
                />
              </template>
              <template v-else>
                <PortletRenderer :portlet-html-url="card.url" :debug="debug" />
              </template>
            </template>
          </div>
        </div>
      </Slick>
      <ul
        ref="buttons"
        v-if="!computedSlickOptions.dots && dashboard.length > 1"
      >
        <li
          v-for="(region, index) in dashboard"
          :key="region.name"
          :id="'dashboardCarousel-' + index"
        >
          <button
            :class="{ active: activeIndex === index }"
            class="btn"
            @click="clickHandler(index)"
            v-html="region.name"
          />
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import Slick from 'vue-slick';
import PortletRenderer from '@uportal/content-renderer/src/components/PortletRenderer.vue';
import WidgetRenderer from '@uportal/content-renderer/src/components/WidgetRenderer.vue';
import LayoutData from '../mixins/LayoutData';

export default {
  name: 'DashboardCarousel',
  mixins: [LayoutData],
  data: function () {
    return {
      activeIndex: 0,
    };
  },
  components: {
    Slick,
    PortletRenderer,
    WidgetRenderer,
  },
  methods: {
    clickHandler(slideIndex) {
      this.activeIndex = slideIndex;
      this.$refs.slick.goTo(slideIndex);
    },
    handleAfterChange(event, slick, currentSlide) {
      this.activeIndex = currentSlide;
    },
  },
  props: {
    slickOptions: {
      type: [String, Object],
      default: () => ({
        dots: false,
        arrows: true,
      }),
    },
    debug: {
      type: Boolean,
      default: false,
    },
    layoutApiUrl: {
      type: String,
      default: '/uPortal/api/v4-3/dlm/layout.json',
    },
    layoutDocUrl: {
      type: String,
      default: '/uPortal/api/layoutDoc',
    },
    regionName: {
      type: String,
      default: 'dashboard',
    },
    useLayoutDocData: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedSlickOptions() {
      const options =
        typeof this.slickOptions === 'string'
          ? JSON.parse(this.slickOptions)
          : this.slickOptions;
      return { slick: this.$el || '', swipeToSlide: true, ...options };
    },
    dashboard() {
      const slick = this.$refs.slick || {
        currentSlide: () => {},
        destroy: () => {},
        create: () => {},
        goTo: () => {},
      };
      const currentIndex = slick.currentSlide();

      slick.destroy();
      this.$nextTick(() => {
        slick.create();
        slick.goTo(currentIndex, true);
      });
      if (!this.layout) {
        console.error('Dashboard data not loaded');
        return;
      }

      return this.layout;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../node_modules/slick-carousel/slick/slick.css';
@import '../../node_modules/slick-carousel/slick/slick-theme.css';

.carousel ::v-deep {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  height: auto;

  .slick-list {
    width: 100%;

    .slick-track {
      display: flex;
      align-items: stretch;

      > .slick-slide {
        float: none;
        align-self: stretch;
        height: auto;
      }
    }
  }

  .slick-list,
  .slick-track,
  .slick-slide,
  .slick-slide > div {
    height: 100%;
  }

  .slick-initialized {
    display: flex;
    justify-content: center;
    align-items: center;

    .slick-list {
      flex: 1 1 auto;
    }
  }

  .slick-item {
    display: flex !important;
    justify-content: space-evenly;
    align-items: stretch;
    height: 100%;
    height: var(--dash-carousel-slick-item-height, 100%);

    > div {
      flex: 1 1 0;
      background-color: #fff;
      margin: 0 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border: var(--dash-carousel-item-border, 1px solid #ccc);
      max-width: 33%;
      border-radius: 0;
      border-radius: var(--dash-carousel-item-border-radius, 0);
      display: inline-flex;
      flex-direction: column;
    }
  }

  .slick-dots {
    li {
      button::before {
        font-size: 16px;
      }
    }
  }
}

.slick-slider ::v-deep .slick-prev,
.slick-slider ::v-deep .slick-next {
  position: relative;
  height: inherit;
  width: inherit;
  top: inherit;

  &::before {
    color: #666;
    font-family: inherit;
    font-size: 5rem;
    font-weight: 700;
  }
}

.slick-slider ::v-deep .slick-prev {
  &::before {
    content: '\3008';
  }
}

.slick-slider ::v-deep .slick-next {
  &::before {
    content: '\3009';
  }
}

ul {
  list-style: none;
  display: flex;
  justify-content: center;
  padding: 0;

  li {
    list-style-type: none;
    margin: 0 10px;
    min-width: 125px;
  }
}

.text-warning {
  color: red;
  color: var(--dash-carousel-maint-fg-color, red);
}

.btn {
  color: #fff;
  color: var(--dash-carousel-btn-fg-color, #fff);
  background-color: #007bff;
  background-color: var(--dash-carousel-btn-bg-color, #007bff);
  display: block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: #007bff;
  border: 1px solid var(--dash-carousel-btn-bg-color, #007bff);
  padding: 0.375rem 0.75rem;
  padding: var(--dash-carousel-btn-padding, 0.375rem 0.75rem);
  font-size: 1rem;
  font-size: var(--dash-carousel-btn-font-size, 1rem);
  line-height: 1.5;
  border-radius: 0.25rem;
  width: 100%;

  &:hover {
    background-color: #fff;
    /* stylelint-disable-next-line declaration-colon-newline-after */
    background-color: var(
      --dash-carousel-btn-bg-hover-color,
      var(--dash-carousel-btn-bg-active-color, #fff)
    );
    color: #000;
    /* stylelint-disable-next-line declaration-colon-newline-after */
    color: var(
      --dash-carousel-btn-fg-hover-color,
      var(--dash-carousel-btn-fg-active-color, #000)
    );
  }

  &.active {
    background-color: #fff;
    background-color: var(--dash-carousel-btn-bg-active-color, #fff);
    color: #000;
    color: var(--dash-carousel-btn-fg-active-color, #000);
  }
}

/* Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) {
  .carousel ::v-deep {
    .slick-item {
      flex-direction: column;

      > div {
        max-width: none;
        margin-bottom: 10px;
      }

      & > span {
        max-width: none;
      }
    }
  }

  ul {
    flex-direction: column;

    li {
      margin-top: 10px;
    }
  }
}
</style>
