import axios from 'axios';

const API_URL = 'http://localhost:9001/api/v1/profile';

// Define an interface for the profile data
interface Profile {
  name: string;
  email: string;
  phone: string;
  // Add other fields as needed
}

export const getProfile = async (userId: string): Promise<Profile> => {
  console.log('getProfile');
  try {
    console.log('calling axios.get()');
    console.log('userId: ' + userId);
    console.log('API_URL: ' + API_URL);
    const response = await axios.post<Profile>(API_URL, { userId });
    console.log('response: ' + response);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};

export const updateProfile = async (userId: string, profile: Profile): Promise<Profile> => {
  try {
    const response = await axios.put<Profile>(API_URL, { userId, profile });
    return response.data;
  } catch (error: unknown) {
    console.error('Error updating profile data:', error);
    throw error;
  }
};