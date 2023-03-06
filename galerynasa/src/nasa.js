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

export const searchMarsPhotos = async (roverName, earthDate) => {
  try {
    const response = await axios.get(
      `${NASA_API_BASE_URL}/mars-photos/api/v1/rovers/${roverName}/photos?earth_date=${earthDate}&api_key=${NASA_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error while fetching Mars photos', error);
    return null;
  }
};

export const searchAPOD = async (date) => {
  try {
    const response = await axios.get(
      `${NASA_API_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error('Error while fetching APOD by date', error);
    return null;
  }
};
