// shortcut to make html overflow as hidden or auto
const overflowHandler = (type: string) => {
  setTimeout(() => {
    document.getElementsByTagName('html')[0].style.overflow = type;
  }, 0);
};

// call this to get static assets
const getAssets = (path: string) => new URL(`/src/assets/${path}`, import.meta.url).href;

// to decide the get src value method based on the value of src (static image or an url), assuming that all images source have value
const imageSource = (src: string) => (src.startsWith('http') ? src : getAssets(src));

// call this to get result of touch event
const slider = (e: any, mobile: boolean = false, axis: string = 'X') =>
  mobile ? e.changedTouches[0][`page${axis}`] : e[`page${axis}`];

// shortcut to help create a ripple effect
class Ripple {
  ripple: any;
  ripples: any[];
  constructor(ripple: any, ripples: any[]) {
    this.ripple = ripple;
    this.ripples = ripples;
  }

  animate(e: any, mobile: boolean = false) {
    const pos = this.ripple.getBoundingClientRect();
    this.ripples.push({
      x: (mobile ? e.changedTouches[0].clientX : e.clientX) - pos.left,
      y: (mobile ? e.changedTouches[0].clientY : e.clientY) - pos.top,
      show: true,
    });
    return this.ripples;
  }

  end(index: number) {
    this.ripples[index] = false;
    return this.ripples;
  }
}

// to get initial of a name
const extractName = (name: string) =>
  name
    .split(' ')
    .map((i) => i[0])
    .slice(0, 2)
    .join('');

export { overflowHandler, getAssets, imageSource, slider, Ripple, extractName };
