import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { deleteWeeklyContent, getWeeklyContent } from '../../../api/auth';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import ResourceModal from '../../Admin/ResourceUpload/ResourceModal';
import { FaTrash } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { ConfirmationDialog } from '../../Generic/ConfirmationDialog';

const WeeklyContentTabs = ({ courseDetailId }: any) => {
  const [weeks, setWeeks] = useState([]);
  const [activeWeek, setActiveWeek] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [modalResource, setModalResource] = useState<any | null>(null);
  const userType = useSelector((state: any) => state.auth.userType);

  useEffect(() => {
    fetchWeeklyContent();
  }, [courseDetailId]);
  const fetchWeeklyContent = async () => {
    const response = await getWeeklyContent(courseDetailId);
    if (response.data) {
      setWeeks(response.data.data);
    }
  };
  const handleWeekClick = (weekNumber: any) => {
    setActiveWeek((prev) => (prev === weekNumber ? null : weekNumber));
  };

  const handleDelete = () => {
    try {
      const response: any = deleteWeeklyContent(selectedId);
      if (response) {
        setTimeout(() => {
          fetchWeeklyContent();
        }, 1000);
        toast.success('Weekly content deleted successfully', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setShowDeleteModal(false);

        setSelectedId(null);
      }
    } catch (err) {}
  };
  return (
    <>
      <ToastContainer />
      <div className="w-full pt-2 ">
        {weeks.map((week: any) => (
          <div
            key={week.id}
            className=" border-2 border-zinc-400 mb-2  rounded-lg"
          >
            <button
              onClick={() => handleWeekClick(week.weekNumber)}
              className={`w-full flex gap-4 items-center p-3 text-left border-b border-zinc-400 ${
                activeWeek === week.weekNumber ? 'bg-zinc-300' : ''
              }`}
            >
              <span className="text-xl font-bold text-slate-600 dark:text-white">
                {activeWeek === week.weekNumber ? (
                  <FaMinusCircle size={20} />
                ) : (
                  <FaPlusCircle size={20} />
                )}
              </span>
              <span className="text-xl font-bold text-slate-600 dark:text-white">
                {week.heading || `Week #${week.weekNumber}`}
              </span>
            </button>
            {activeWeek === week.weekNumber && (
              <div className="py-2 px-2 mb-2 mx-2 flex-col justify-between items-center  rounded-2xl">
                {week.resources.map((resource: any) => (
                  <div
                    key={resource.id}
                    className=" flex justify-between items-center border-b border-zinc-400 pb-1 w-full pt-2 "
                  >
                    <p>
                      {resource.fileName && resource.fileName.length > 60
                        ? resource.fileName.slice(0, 60) + '...'
                        : resource.fileName}
                    </p>
                    <div className="flex gap-2 items-center">
                      {userType === 'admin' && (
                        <button
                          onClick={() => {
                            setSelectedId(resource?.id);
                            setShowDeleteModal(true);
                          }}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        >
                          {' '}
                          <FaTrash />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setModalResource(resource);
                          setShowModal(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        {' '}
                        View Content
                      </button>
                    </div>
                  </div>
                ))}
                <p>{week.resources.fileName}</p>
              </div>
            )}
          </div>
        ))}
        {showDeleteModal && (
          <ConfirmationDialog
            title={'Delete Weekly Content'}
            message={'Are you sure you want to delete this weekly content?'}
            handleConfirm={handleDelete}
            closeDialog={() => {
              setShowDeleteModal(false);
            }}
            confirmText={'Delete'}
          />
        )}
        {showModal && modalResource && (
          <ResourceModal
            resource={modalResource}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default WeeklyContentTabs;
