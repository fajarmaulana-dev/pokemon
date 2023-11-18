import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  headers: { 'Content-Type': 'application/json' },
});

const getData = (url: string): any => {
  return new Promise((resolve, reject) => {
    api
      .get(url)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export default getData;
