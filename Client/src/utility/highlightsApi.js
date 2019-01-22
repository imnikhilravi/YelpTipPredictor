const axios = require("axios");

export const getHighlights = async (url, forceNew) => {
  try {
    const httpResult = await axios.default.post('http://192.168.1.191:3001', { 'url': url, 'forceNew': forceNew });
    if (httpResult.data.highlights)
      return httpResult.data.highlights;
  } catch (error) {
    throw error;
  }
}

export const getComments = async (url) => {
  try {
    const httpResult = await axios.default.get(`http://192.168.1.191:3001/review/comments?url=${url}`);
    if (httpResult.data)
      return httpResult.data;
  } catch (error) {
    throw error;
  }
}

export const getVotes = async (url) => {
  try {
    const httpResult = await axios.default.get(`http://localhost:3001/review/votes?url=${url}`);
    if (httpResult.data)
      return httpResult.data;
  } catch (error) {
    throw error;
  }
}

export const vote = async (vote, url, item) => {
  try {
    const httpResult = await axios.default.post('http://localhost:3001/review/vote', { 'vote': vote, 'url': url, 'item': item });
    if (httpResult.data)
      return httpResult.data;
  } catch (error) {
    throw error;
  }
}

export const comment = async (commentText, url) => {
  try {
    const httpResult = await axios.default.post('http://192.168.1.191:3001/review/comment', { 'comment': commentText, 'url': url });
    if (httpResult.data)
      return httpResult.data;
  } catch (error) {
    throw error;
  }
}