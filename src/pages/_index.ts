import type { Favourite, Images, PokemonCard, Filter } from '@/types';

const getMoreImage = (ids: string[]): Images[] => [
  { id: '0011', image: 'galar-01.avif' },
  { id: '0012', image: 'galar-02.avif' },
  { id: '0013', image: 'galar-03.avif' },
  { id: '0014', image: 'galar-01.avif' },
  { id: '0015', image: 'galar-02.avif' },
  { id: '0016', image: 'galar-03.avif' },
  { id: '0017', image: 'galar-01.avif' },
  { id: '0018', image: 'galar-02.avif' },
  { id: '0019', image: 'galar-03.avif' },
  { id: '0020', image: 'galar-01.avif' },
];

const doFilter = async (data: {
  filter: Filter;
  all: PokemonCard[];
  heart: string[];
  catch: string[];
}) => {
  let dataToShow = data.all;
  let next: boolean;
  // filter for favourite page, catched page, or other page
  if (data.filter.mode == 'favourite') {
    dataToShow = dataToShow.filter((d) => data.heart.includes(d.id));
  }
  if (data.filter.mode == 'catched') {
    dataToShow = dataToShow.filter((d) => data.catch.includes(d.id));
  }
  // filter by search name
  if (data.filter.search !== '') {
    dataToShow = data.all.filter((d) => d.name.includes(data.filter.search));
  }
  // filter by type
  if (data.filter.type !== '') {
    dataToShow = dataToShow.filter((d) => d.types.includes(data.filter.type));
  }
  // filter by region
  if (data.filter.region !== '') {
    dataToShow = dataToShow.filter((d) => d.spread.includes(data.filter.region));
  }
  // sort data
  dataToShow = dataToShow.sort((a: Record<string, any>, b: Record<string, any>) => {
    const param = data.filter.sort;
    if (param.mode == 'asc') return a[param.by].localeCompare(b[param.by]);
    else return b[param.by].localeCompare(a[param.by]);
  });

  // filter id of data with no image and then request the image for each data
  let noImage = dataToShow.filter((d) => d.image == '').map((d) => d.id);
  if (noImage.length > 0) {
    // just get new images no more than 20
    next = true;
    if (noImage.length > 20) {
      noImage = noImage.slice(0, 20);
      dataToShow = dataToShow.filter((d) => d.image !== '' || noImage.includes(d.id));
    }
    const retrievedImage = getMoreImage(noImage);
    dataToShow.forEach((d, idx) => {
      retrievedImage.forEach((image) => {
        if (d.id == image.id) dataToShow[idx].image = image.image;
      });
    });
  } else {
    next = false;
  }

  return { data: dataToShow, next };
};

const doHeart = (data: { toHandle: Favourite[]; index: number; all: Favourite[] }) => {
  let toHandle = data.toHandle[data.index];
  toHandle.state = !toHandle.state;
  toHandle.date = toHandle.state ? new Date().toLocaleDateString() : '';
  return data.all.map((d) => {
    let beforeChange = d;
    if (beforeChange.id == toHandle.id) beforeChange = toHandle;
    return beforeChange;
  });
};

export { doFilter, doHeart };
