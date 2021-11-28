import axios from "axios";

const API_KEY = '24451449-e9ba9ef03736e50737df0cc12';
export const option = {pageNumber: 1, userQuery:''};

export default async function getPixabay(){
  const response = await axios.get('https://pixabay.com/api/',{
    params:{
      key:`${API_KEY}`,
      q:`${option.userQuery}`,
      image_type:'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: option.pageNumber,
      per_page: 40,
    }
    
    })
    
  return response.data;

};
