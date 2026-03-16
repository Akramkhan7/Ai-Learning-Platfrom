import React from "react";
import Spinner from "../../components/common/Spinner";
import documentService from "../../services/documentService";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { TurkishLira } from "lucide-react";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      toast.error("Failed to fetch documents.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
fetchDocuments();
  },[])

  const handleFileChange = (e) =>{
    const file = e.target.files[0];
    if(file){
        setUploadFile(file);
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUplaod = async (e) =>{
    e.preventDefault();
    if(!uploadFile || !uploadTitle){
        toast.error('Please provide a title and select a file.')
        return;
    }
    setUploading(true);

    const formData= new FormData();
    formData.append('file',uploadFile);
    formData.append('file',uploadTitle);


    try{
        await documentService.uploadDocument(FormData);
        toast.success("Document uploaded successfully!");
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setUploadTitle("");
        setLoading(true);
        fetchDocuments()
    }catch(error){
        toast.error(error.message || "Upload failed") 
    }finally{
        setLoading(false);
    }
  };

  const handleDeleteRequest = (doc) =>{
setSelectedDoc(doc);
setIsDeleteModalOpen(true)
  };

  const handleConfirmDelete = async() =>{
    if (!selectedDoc) return;
    setDeleting(true);

    try{
        await documentService.deleteDocument(selectedDoc._id);
        toast.success(`${selectedDoc.title}deleted.`)
        setIsDeleteModalOpen(false);
        setSelectedDoc(null);
        setDocuments(documents.filter ((d)=> d._id !== selectedDoc._id));
    }catch(err){
        toast.err(err.message || "Failed to delete document.");
    }finally{
        setDeleting(false);
    }

  };

  const renderContent = () =>{
    return <div>render</div>
  }


  return <div>doc list</div>;
};

export default DocumentListPage;
