import { DataStrategy } from '@/lib/DataStrategy';
import { CarouselItem } from '@/lib/CarouselItem';
import { portletRegistryToArray } from '@uportal/portlet-registry-to-array';

export class PortletStrategy implements DataStrategy {
  public readonly type = 'Portlet';

  public items: CarouselItem[] = [];

  constructor(public feed: string) {
    this.load(feed);
  }

  private async load(path: string): Promise<any> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const registry = await response.json();

    this.items = portletRegistryToArray(registry).map(
      ({
        fname,
        name,
        description,
        parameters,
      }: {
        fname: string;
        name: string;
        description: string;
        parameters: any;
      }) => {
        let imageUrl = '';
        let altText = '';

        if (parameters && parameters.iconUrl) {
          imageUrl = parameters.iconUrl.value;
          altText = parameters.iconUrl.description || description;
        }

        return {
          id: fname,
          altText,
          destinationUrl: 'TODO',
          imageUrl,
          title: name,
          description,
        };
      }
    );
  }
}
