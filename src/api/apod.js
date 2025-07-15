import axios from 'axios';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY ||"DEMO_KEY";
const NASA_API_BASE_URL = process.env.REACT_APP_NASA_API_BASE_URL || 'https://api.nasa.gov';

export const getAPOD = async () => {
  try {
    const apiUrl = `${NASA_API_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`;
    console.log('APOD Request URL:', apiUrl);
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error while fetching APOD', error);
    throw error;
  }
};

export const searchAPOD = async (date) => {
  try {
    const apiUrl = `${NASA_API_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;
    console.log('APOD Search Request URL:', apiUrl);
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error while fetching APOD by date', error);
    throw error;
  }
};