import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CONFIG from '../globals/config';
const axiosInstance = axios.create({
  baseURL: CONFIG.base_url,
});
const errrHandler = (e, URL, CONFIG, PAYLOAD = {}) => {
  console.log(
    `REQUEST TO: ${URL} with PAYLOAD: ${JSON.stringify(PAYLOAD)} failed!`,
  );
  console.log(JSON.stringify(e?.response?.data));
  if (e.message === 'Network Error') {
    throw 'Network Error. Ensure you are connected to internet.';
  } else if (e.message === 'Server is not responding') {
    throw 'Server is not responding';
  } else {
    const { status, data } = e.response;
    console.warn(`API ERROR STATUS: ${status}\n`);
    console.log({ data });
    const { Message } = data;
    if (status == 404) {
      throw {
        Message,
        status,
      };
    }
    if (status == 500) {
      throw {
        Message,
        status,
      };
    }
    if (typeof Message === 'string') {
      throw Message;
    } else {
      throw 'Something went wrong.';
    }
  }
};

const get = async (URL) => {
  console.log({ URL });
  try {
    let result = await axiosInstance.get(URL, {
      timeout: 15000,
      timeoutErrorMessage: 'Server is not responding',
    });
    return result.data.Data;
  } catch (error) {
    console.log(URL, error.message);
    errrHandler(error, URL);
  }
};

const get1 = async (URL) => {
  console.log({ URL });
  let token = await AsyncStorage.getItem('token');
  let axiosInstanceGet = axios.create({
    baseURL: CONFIG.base_url,
    headers: {
      token: token,
    }
  });
  try {
    let result = await axiosInstanceGet.get(URL, {
      timeout: 15000,
      timeoutErrorMessage: 'Server is not responding',
    });
    return result.data.Data;
  } catch (error) {
    console.log(URL, error.message);
    errrHandler(error, URL);
  }
};


const post1 = async (URL, payload) => {
  console.log({ URL, payload });
  let token = await AsyncStorage.getItem('token');
  let axiosInstancePost = axios.create({
    baseURL: CONFIG.base_url,
    headers: {
      token: token,
    }
  });
  try {
    // console.log('Payload from Utility :', payload);
    let result = await axiosInstancePost.post(URL, payload, {
      timeout: 15000,
      timeoutErrorMessage: 'Server is not responding',
    });
    let Message = result.data.Message;
    console.log({ Message });
    return result.data.Data;
  } catch (error) {
    console.log(URL, error, { payload });
    errrHandler(error, URL, payload);
  }
};

const post = async (URL, payload) => {
  console.log({ URL, payload });
  try {
    // console.log('Payload from Utility :', payload);
    let result = await axiosInstance.post(URL, payload, {
      timeout: 15000,
      timeoutErrorMessage: 'Server is not responding',
    });
    let Message = result.data.Message;
    console.log({ Message });
    return result.data.Data;
  } catch (error) {
    console.log(URL, error, { payload });
    errrHandler(error, URL, payload);
  }
};

const post2 = async (URL, payload) => {
  console.log({ URL, payload });
  try {
    // console.log('Payload from Utility :', payload);
    let result = await axiosInstance.post(URL, payload, {
      timeout: 15000,
      timeoutErrorMessage: 'Server is not responding',
    });
    let Message = result.data.Message;
    console.log({ Message });
    return result.data;
  } catch (error) {
    console.log(URL, error, { payload });
    errrHandler(error, URL, payload);
  }
};

const postRegister = async (URL, payload) => {
  console.log({ URL, payload });
  try {
    let result = await axiosInstance.post(URL, payload, {
      timeout: 15000,
      timeoutErrorMessage: 'Server is not responding',
    });
    return result.data.Data;
  } catch (error) {
    let response = error.response.data;
    if (response.Message === 'Error Founded') {
      throw response.Data;
      // throw JSON.stringify(response.Data);
    }
    // errrHandler(error, URL, payload);
    // console.log('Errorrrrr :', error.response.data);
    // console.log(URL, error, {payload});
  }
};

const put = async (URL, payload) => {
  console.log({ URL, payload });
  try {
    let result = await axiosInstance.put(URL, payload, {
      timeout: 15000,
      timeoutErrorMessage: 'Server is not responding',
    });
    return result.data;
  } catch (error) {
    console.log(URL, error, { payload });
  }
};

export { get, post, put, postRegister, get1, post1 ,post2};
