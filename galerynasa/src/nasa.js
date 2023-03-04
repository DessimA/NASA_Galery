import axios from 'axios';

export const NASA_API_KEY = '0OdFuiCh6QGZIFcD1OGV0m7xyWNXpeZ7gGcpte1D';
const NASA_API_BASE_URL = 'https://api.nasa.gov';

export const getAPOD = async () => {
  try {
    const response = await axios.get(
      `${NASA_API_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error while fetching APOD', error);
    return null;
  }
};

export const getRoverPhotos = async (roverName, earthDate) => {
  try {
    const response = await axios.get(
      `${NASA_API_BASE_URL}/mars-photos/api/v1/rovers/${roverName}/photos?earth_date=${earthDate}&api_key=${NASA_API_KEY}`
    );
    return response.data.photos;
  } catch (error) {
    console.error(`Error while fetching ${roverName} photos`, error);
    return null;
  }
};

export const getMarsWeather = async () => {
  try {
    const response = await axios.get(
      `${NASA_API_BASE_URL}/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`
    );
    return response.data;
  } catch (error) {
    console.error('Error while fetching Mars weather data', error);
    return null;
  }
};
