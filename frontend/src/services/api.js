import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export const profileApi = {
  async list() {
    const response = await api.get("/profiles");
    return response.data;
  },

  async create(profile) {
    const response = await api.post("/profiles", profile);
    return response.data;
  },
};

export const resumeApi = {
  async analyze(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
