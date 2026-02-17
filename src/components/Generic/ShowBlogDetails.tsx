import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllBlogs, getBlogById, getTeacherById } from '../../api/auth';
import DOMPurifyBlog from './DOMPurify';
import { formatDate } from './FormatDate';
import axios from '../../api/axios';
import { Loader } from '../Loader';

export const ShowBlogDetails = () => {
  const { id }: any = useParams();
  const [blog, setBlogs] = useState<any>([]);
  const [authorName, setAuthorName] = useState('');
  const [teacherImg, setTeacherImg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBlogsDetail();
  }, []);

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (blog?.author === 0) {
        setAuthorName('Admin');
      } else if (blog?.author) {
        const teacherName: any = await getTeacherName(blog.author);
        setAuthorName(teacherName);
      }
    };

    if (blog?.author !== undefined) {
      fetchAuthorName();
    }
  }, [blog?.author]);

  const getBlogsDetail = async () => {
    setLoading(true);

    try {
      const response = await getBlogById(id);
      if (response.data) {
        setBlogs(response.data);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };
  const getTeacherName = async (author: any) => {
    try {
      const response = await getTeacherById(author);
      if (response.data) {
        setTeacherImg(response.data.teacher?.imageUrl);
        let name =
          response.data.teacher.firstName +
          ' ' +
          response.data.teacher.lastName;
        return name;
        //   setBlogs(response.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
    {(loading) ? 
        <Loader />
        :
    
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {blog?.title}
        </h1>

        {/* Author and Meta Info */}
        <div className="flex items-center space-x-4">
          <img
            src={
              teacherImg
                ? `${axios.defaults.baseURL}/${teacherImg}`
                : '../../../../src/images/user/user-05.png'
            }
            alt="Author avatar"
            className="w-10 h-10 rounded-full"
          />

          <div className="flex flex-wrap flex-col ">
            <p className="text-gray-600">{authorName}</p>
            <div className="flex items-center gap-6 text-gray-500 text-sm  ">
              <div className="flex items-center gap-1  ">
                {/* <FaCalendar className="w-4 h-4" /> */}
                <span className="font-bold">
                  {formatDate(blog?.publishedDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {/* <img
          src="/api/placeholder/800/400"
          alt="Person working at desk"
          className="w-full h-auto rounded-lg object-cover"
        /> */}
        <img
          src={
            blog?.imageUrl
              ? `${axios.defaults.baseURL}/${blog?.imageUrl}`
              : '../../../../src/images/dummyupcoming.jpg'
          }
          alt={blog?.title}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <p className="text-gray-600">
          <DOMPurifyBlog content={blog?.content} />
        </p>
      </div>
    </div>
}
    </>
  );
};
