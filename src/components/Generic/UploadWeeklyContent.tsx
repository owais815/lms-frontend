import React, { useState } from 'react';
import axios from 'axios';
import { uploadWeeklyContent } from '../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import ResourceModal from '../Admin/ResourceUpload/ResourceModal';

const UploadWeeklyContent = ({ courseDetailId }:any) => {
    const [weekNumber, setWeekNumber] = useState('');
    const [heading, setHeading] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e:any) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileType(selectedFile?.type || '');
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        if (!weekNumber || !file) {
            setErrorMessage('Week number and file are required');
            return;
        }
        
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('courseDetailId', courseDetailId);
        formData.append('weekNumber', weekNumber);
        formData.append('heading', heading);
        formData.append('file', file);

        try {
            const response = await uploadWeeklyContent(formData);
            toast.success('Content uploaded successfully',{
                position: 'bottom-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setWeekNumber('');
            setHeading('');
            setFile(null);
        } catch (error) {
            setErrorMessage('Failed to upload content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <ToastContainer />
        <div className="w-full globalCardStyle  mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Weekly Content</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Week Number</label>
                    <input
                        type="number"
                        value={weekNumber}
                        onChange={(e) => setWeekNumber(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Custom Heading (Optional)</label>
                    <input
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Select File</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mt-1 w-full p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Upload Content'}
                </button>
            </form>
        </div>
       
        </>
    );
};

export default UploadWeeklyContent;
