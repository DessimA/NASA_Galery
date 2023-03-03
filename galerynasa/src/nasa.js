import axios from 'axios';

const API_BASE_URL = 'https://api.nasa.gov';

export async function getAstronomyPictureOfTheDay(apiKey) {
    const url = `${API_BASE_URL}/planetary/apod?api_key=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }

  export async function getPlanetInfo(planetName, apiKey) {
    const url = `${API_BASE_URL}/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`;
    const response = await axios.get(url);
    return response.data[planetName];
  }
  