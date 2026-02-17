import { useEffect, useState } from 'react';
import { deleteBlog, getAllBlogs } from '../../api/auth';
import { formatDate } from './FormatDate';
import DOMPurifyBlog from './DOMPurify';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../Loader';
import { DeleteIcon } from '../Icons/DeleteIcon';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useSelector } from 'react-redux';
import { EmptyTemplate } from './EmptyTemplate';

export const ShowBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog,setSelectedBlog] = useState('');
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const navigate = useNavigate();
  const userType = useSelector((state: any) => state.auth.userType);
  const userId = useSelector((state: any) => state.auth.userId);


  useEffect(() => {
    getBlogs();
  }, []);
  const getBlogs = async () => {
    setLoading(true);
    try {
      const response = await getAllBlogs();
      if (response.data) {
        setBlogs(response.data);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };
  const getContent = (content: any) => {
    if (content.length > 250) {
      return content.trim().slice(0, 250) + '...';
    } else {
      return content;
    }
  };

  const handleDeleteBlog = async () => {
    try {
      const response = await deleteBlog(selectedBlog);
      if (response.data) {
        let filteredBlog = blogs.filter((x:any)=>x.id !=selectedBlog);
        setBlogs(filteredBlog);
        setConfirmationDialog(false); 
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };
  return (
    <>
      {loading && blogs.length != 0 ? (
        <Loader />
      ) : (
        <>
        <>
          {blogs.length == 0 && (
            <div className="text-center text-gray-500 dark:text-white">
              <EmptyTemplate 
                heading="No Blog Found"
                description="Create first blog by yourself"
              />
            </div>
          )}
          </>
        <>
          {blogs.map((blog: any) => {
            return (
              <div className="bg-gray-100 dark:bg-slate-900 dark:text-white px-2 py-2">
                <article className="mx-auto my-2 flex max-w-md flex-col dark:bg-slate-700 dark:text-white rounded-2xl bg-white px-4 shadow md:max-w-5xl md:flex-row md:items-center">
                  <div className="shrink-0 my-4 md:mr-8 md:max-w-sm">
                    <img
                      src={
                        blog?.imageUrl
                          ? `${axios.defaults.baseURL}/${blog?.imageUrl}`
                          : '../../../../src/images/dummyupcoming.jpg'
                      }
                      alt={blog?.title}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="py-4 sm:py-8 w-full">
                    <a
                      onClick={() => {
                        navigate(`/blogs/detail/${blog?.id}`);
                      }}
                      className="mb-6 cursor-pointer block dark:text-white text-2xl font-medium text-gray-700"
                    >
                      {blog?.title}
                    </a>
                    <div className="mb-6 text-gray-500 dark:text-white">
                      <DOMPurifyBlog content={getContent(blog?.content)} />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <p className="inline-block px-4 py-1 mb-5 text-xs font-semibold leading-loose text-center text-white rounded bg-primary">
                        {formatDate(blog?.publishedDate)}
                      </p>
                      {(userType == 'admin' ||(blog?.author == userId && userType=='teacher')) && 
                      <button
                        onClick={() => {
                          setConfirmationDialog(true);
                          setSelectedBlog(blog?.id);
                        }}
                        className="inline-block px-4 py-1 mb-5 text-xs font-semibold leading-loose text-center  rounded "
                      >
                        <DeleteIcon />
                      </button>
                      }
                    </div>
                  </div>
                </article>
                {confirmationDialog && (
                  <ConfirmationDialog
                    title="Delete Blog"
                    message="Are you sure you want to delete this blog?"
                    handleConfirm={handleDeleteBlog}
                    closeDialog={() => setConfirmationDialog(false)}
                    confirmText="Delete"
                    bgColor="bg-red-500 hover:bg-red-700"
                  />
                )}
              </div>
            );
          })}
        </>
    </>
      )}
    </>
  );
};
