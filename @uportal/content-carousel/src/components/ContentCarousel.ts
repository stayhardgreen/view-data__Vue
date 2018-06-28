import { Component, Prop, Vue } from 'vue-property-decorator';
import Slick from 'vue-slick';
import { DataStrategy } from '../lib/Strategy';
import { CarouselItem } from '../lib/CarouselItem';
import { RssStrategy } from '@/lib/RssStrategy';

@Component({
    components: {
        Slick,
    },
})
export default class ContentCarousel extends Vue {
    @Prop() public rss!: string;
    @Prop() public slickOptions: any = {};
    @Prop([String]) public carouselHeight?: string;
    @Prop([Boolean]) public fitToContainer?: boolean;

    public strategy: DataStrategy = {items: [] as CarouselItem[]} as DataStrategy;

    public mounted(): void {
        const list = Array.from(this.$el.getElementsByClassName('slick-list'));
        if (list.length > 0) {
            list.forEach((el) => el.setAttribute('style', `height:${this.height}`));
        }

        if (this.rss) {
            this.strategy = new RssStrategy(this.rss);
        }
    }

    get height(): string {
        return this.carouselHeight || 'auto';
    }

    get isResponsiveToContainer(): boolean {
        return this.fitToContainer ? true : false;
    }

    get computedItems(): CarouselItem[] {
        return this.strategy.items;
    }
}
