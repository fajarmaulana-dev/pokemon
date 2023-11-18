class Local {
  getData(key: string) {
    return JSON.parse(localStorage.getItem(key)!);
  }
  setData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  removeData(key: string) {
    localStorage.removeItem(key);
  }
}

export default new Local();
