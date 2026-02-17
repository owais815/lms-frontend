import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import { createBlog } from '../../api/auth';
import { toast, ToastContainer } from 'react-toastify';

export function WriteBlog() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const userId = useSelector((state: any) => state.auth.userId);
  const userType = useSelector((state: any) => state.auth.userType); //admin, teacher

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: any;
    if (e.target.files) {
      file = e.target.files[0];
    }

    if (file) {
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        setImage(file);
        console.log('Image uploaded successfully::', file);
        const objectUrl: any = URL.createObjectURL(file);
        setPreview(objectUrl);
      } else {
        setImage(null);
        alert('Please select a valid image file.');
      }
    }
  };

  const handleSubmitBlog = async() => {
    if(!title || !content ) return toast('Please fill all fields');
    try{
      const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', image);
    formData.append('author', userType == 'admin' ? 0: userId);
      const response = await createBlog(formData);
      if(response.data){
        toast('Blog created successfully');
        clearFields();
      }
    }catch(e){
      console.error(e);
      toast('Failed to create blog');
    }
  };
  const clearFields = () => {
    setTitle('');
    setContent('');
    setImage(null);
    setPreview(null);
    setTags('');
    
  }
  return (
    <div className='containerr'>
    <ToastContainer />
    <div className="w-full h-full globalCardStyle mt-6  flex-col p-4 dark:bg-slate-800 dark:text-white rounded-lg shadow ">
      <div className="mb-6 ">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Title of blog
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:bg-slate-800"
          placeholder="Title of blog"
          required
        />
      </div>
      <div className="mb-6 ">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Upload Image
        </label>

        <input
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          id="file_input"
        />
      </div>
      {preview && (
        <div className="mt-4 -center">
          <img
            src={preview}
            alt="Preview"
            className="w-50 h-40 object-stretch rounded-t-lg mb-6"
          />
        </div>
      )}
      <div className="mb-6 ">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tags (if any)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          id="tags"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:bg-slate-800"
          placeholder="start with hashtags"
          required
        />
      </div>
      <ReactQuill theme="snow" value={content} onChange={setContent} />

      <button
        onClick={() => {
          handleSubmitBlog();
        }}
        className="bg-indigo-500 hover:bg-indigo-700 text-white text-md font-semibold rounded mt-5 w-full "
        style={{ padding: '0.5rem' }}
      >
        Submit Blog
      </button>
    </div>
    </div>
  );
}
