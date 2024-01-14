const overflowHandler = (type: string) => {
  setTimeout(() => {
    document.getElementsByTagName('html')[0].style.overflow = type;
  }, 0);
};

const getAssets = (path: string) => new URL(`/src/assets/${path}`, import.meta.url).href;

const imageSource = (src: string) =>
  src.startsWith('http') || src.startsWith('data:image') ? src : getAssets(src);

const slider = (e: any, mobile: boolean = false, axis: string = 'X') =>
  mobile ? e.changedTouches[0][`page${axis}`] : e[`page${axis}`];

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

class Ripples {
  ripple: any[];
  ripples: any[][];
  constructor(ripple: any[], ripples: any[][]) {
    this.ripple = ripple;
    this.ripples = ripples;
  }

  animate(e: any, mobile: boolean = false, index: number) {
    const pos = this.ripple[index].getBoundingClientRect();
    this.ripples[index].push({
      x: (mobile ? e.changedTouches[0].clientX : e.clientX) - pos.left,
      y: (mobile ? e.changedTouches[0].clientY : e.clientY) - pos.top,
      show: true,
    });
    return this.ripples;
  }

  end(index: number, k: number) {
    this.ripples[index][k] = false;
    return this.ripples;
  }
}

const extractName = (name: string) =>
  name
    .split(' ')
    .map((i) => i[0])
    .slice(0, 2)
    .join('');

const convertBlob = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export {
  overflowHandler,
  getAssets,
  imageSource,
  slider,
  Ripple,
  Ripples,
  extractName,
  convertBlob,
};
