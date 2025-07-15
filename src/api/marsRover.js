import axios from 'axios';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY ||"DEMO_KEY";
const NASA_API_BASE_URL = process.env.REACT_APP_NASA_API_BASE_URL || 'https://api.nasa.gov';

export const getRoverManifest = async (roverName) => {
  try {
    const response = await axios.get(
      `${NASA_API_BASE_URL}/mars-photos/api/v1/manifests/${roverName}?api_key=${NASA_API_KEY}`
    );
    return response.data.photo_manifest;
  } catch (error) {
    console.error('Error while fetching rover manifest', error);
    throw error;
  }
};

export const searchMarsPhotos = async (roverName, searchParams) => {
  try {
    const { sol, earth_date, camera, page } = searchParams;
    let url = `${NASA_API_BASE_URL}/mars-photos/api/v1/rovers/${roverName}/photos?api_key=${NASA_API_KEY}`;

    if (sol) {
      url += `&sol=${sol}`;
    } else if (earth_date) {
      url += `&earth_date=${earth_date}`;
    }

    if (camera) {
      url += `&camera=${camera}`;
    }

    if (page) {
      url += `&page=${page}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error while fetching Mars photos', error);
    throw error;
  }
};