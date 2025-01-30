import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables.js";

const { VITE_API_URL } = getEnvVariables();

const chatApi = axios.create({
    baseURL: VITE_API_URL
})

export default chatApi;