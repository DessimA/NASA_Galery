import axios from 'axios';

const NASA_IMAGES_API_BASE_URL = process.env.REACT_APP_NASA_IMAGES_API_BASE_URL || 'https://images-api.nasa.gov';

export const searchImages = async (query) => {
  try {
    const response = await axios.get(
      `${NASA_IMAGES_API_BASE_URL}/search?q=${query}`
    );
    return response.data.collection.items;
  } catch (error) {
    console.error('Error while fetching images', error);
    throw error;
  }
};