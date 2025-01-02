import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://192.168.198.156:3000', 
    timeout: 5000,
   
});

export default instance;