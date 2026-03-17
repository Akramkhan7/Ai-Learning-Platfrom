import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const getDocuments = async (documentId, concept) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.DOCUMENTS.GET_DOCUMENTS,
      { documentId, concept }
    );
    console.log( "Res : " , response);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch documents" };
  }
};

const uploadDocument = async (formData) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.DOCUMENTS.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to upload document" };
  }
};

const deleteDocument = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id)
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete document" };
  }
};

const getDocumentById = async (id) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id)
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch document" };
  }
};

const documentService = {
  getDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
};

export default documentService;