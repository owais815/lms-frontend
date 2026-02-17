import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeacherDetails from '../../Admin/TeachersDetails/TeacherDetails';
import {
  deleteQualification,
  getQualification,
  updateQualification,
} from '../../../api/auth';
import {
  getSpecializations,
  updateSpecializations,
  deletespecializations,
} from '../../../api/auth';
import { EditIcon } from '../../Icons/EditIcon';
import { DeleteIcon } from '../../Icons/DeleteIcon';
interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface Specialization {
  id: string;
  name: string;
  description: string;
}

interface QualificationProps {
  teacherId: string;
  hideAddButtons?: boolean;
}

const Qualification: React.FC<QualificationProps> = (props) => {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editType, setEditType] = useState<
    'qualification' | 'specialization' | null
  >(null);
  const [editDegree, setEditDegree] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const userId = useSelector((state: any) => state.auth.userId);
  const [teacherId, setTeacherId] = useState<string>(props.teacherId);

  useEffect(() => {
    if (props.teacherId) {
      setTeacherId(props.teacherId);
    } else {
      setTeacherId(userId);
    }
  }, []);
  useEffect(() => {
    if (props.teacherId || teacherId) {
      setTeacherId(props.teacherId);
      getTeacherQualifications();
      getTeacherSpecializations();
    }
  }, [props.teacherId,teacherId]);

  const getTeacherQualifications = async () => {
    try {
      // console.log("teacher id get hor hi ha??/",teacherId)
      const response = await getQualification(teacherId);
      // console.log('Qualifications response:', response.data);
      if (response.data && Array.isArray(response.data.qualifications)) {
        setQualifications(response.data.qualifications);
        // console.log('Qualifications set:', response.data.qualifications);
      } else {
        console.error('Unexpected API response format:', response.data);
        setQualifications([]);
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      setQualifications([]);
    }
  };

  const getTeacherSpecializations = async () => {
    try {
      const response = await getSpecializations(teacherId);
      // console.log('Specializations response:', response.data);
      if (response.data && Array.isArray(response.data.specialization)) {
        setSpecializations(response.data.specialization);
        // console.log('Specializations set:', response.data.specialization);
      } else {
        console.error('Unexpected API response format:', response.data);
        setSpecializations([]);
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
      setSpecializations([]);
    }
  };

  const openEditModal = (
    index: number,
    type: 'qualification' | 'specialization',
  ) => {
    setEditIndex(index);
    setEditType(type);
    if (type === 'qualification') {
      setEditDegree(qualifications[index].degree);
      setEditInstitution(qualifications[index].institution);
      setEditYear(qualifications[index].year);
    } else {
      setEditName(specializations[index].name);
      setEditDescription(specializations[index].description);
    }
  };

  const closeEditModal = () => {
    setEditIndex(null);
    setEditType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null && editType) {
      try {
        if (editType === 'qualification') {
          const qualificationId = qualifications[editIndex].id;
          await updateQualification(qualificationId, {
            degree: editDegree,
            institution: editInstitution,
            teacherId: teacherId,
            year: editYear,
          });
          await getTeacherQualifications();
          toast.success('Qualification updated successfully!');
        } else {
          const specializationId = specializations[editIndex].id;
          await updateSpecializations(specializationId, {
            name: editName,
            description: editDescription,
            teacherId: teacherId,
          });
          await getTeacherSpecializations();
          toast.success('Specialization updated successfully!');
        }
        closeEditModal();
      } catch (error) {
        console.error(`Error updating ${editType}:`, error);
        toast.error(`Error updating ${editType}.`);
      }
    }
  };

  const handleDelete = async (
    id: string,
    type: 'qualification' | 'specialization',
  ) => {
    try {
      if (type === 'qualification') {
        await deleteQualification(id);
        await getTeacherQualifications();
        toast.success('Qualification deleted successfully!');
      } else {
        await deletespecializations(id);
        await getTeacherSpecializations();
        toast.success('Specialization deleted successfully!');
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Error deleting ${type}.`);
    }
  };

  return (
    <>
      <TeacherDetails
        hideDropdown={true}
        teacherId={teacherId}
        onSubmitSpecialization={(res: any) => {
          setSpecializations((prevState: any) => [...prevState, res]);
        }}
        onSubmitQualification={(res: any) => {
          setQualifications((prevState: any) => [...prevState, res]);
        }}
        hideAddButtons={props.hideAddButtons}
      />
      <br />
      <div className={props.teacherId ? `font-sans`: `min-h-screen font-sans`}>
        <div className="container mx-auto px-4">
          <div className=" grid-cols-1 md:grid-cols-2 gap-8">
            {/* Qualifications */}
           
            <div>
              <h2 className="text-2xl  font-bold mb-4">Qualifications</h2>
              {qualifications && qualifications.length > 0 ? (
                qualifications.map((qual) => (
                  <div
                    key={qual.id}
                    className="bg-white rounded-lg shadow-md p-3 mb-6 hover:shadow-blue-100 flex  justify-around "
                  >
                    <h3 className="text-xl font-bold text-[#2c3e50] mb-3">
                      {qual.degree}
                    </h3>
                    <p className="text-[#34495e]">{qual.institution}</p>
                    <p className="text-[#34495e]">{qual.year}</p>
                    {!props.hideAddButtons && 
                    <div>
                      <button
                        onClick={() =>
                          openEditModal(
                            qualifications.indexOf(qual),
                            'qualification',
                          )
                        }
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(qual.id, 'qualification')}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  }

                  </div>
                ))
              ) : (
                <p>No qualifications found.</p>
              )}
            </div>

            {/* Specializations */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Specializations</h2>
              {specializations && specializations.length > 0 ? (
                specializations.map((spec) => (
                  <div
                    key={spec.id}
                    className="bg-white rounded-lg shadow-md p-3 mb-6 hover:shadow-blue-100 flex  justify-around "
                  >
                    <h3 className="text-xl font-bold text-[#2c3e50] mb-3">
                      {spec.name}
                    </h3>
                    <p className="text-[#34495e]">{spec.description}</p>
                    {!props.hideAddButtons && 
                    <div>
                      <button
                        onClick={() =>
                          openEditModal(
                            specializations.indexOf(spec),
                            'specialization',
                          )
                        }
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(spec.id, 'specialization')}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
}
                  </div>
                ))
              ) : (
                <p>No specializations found.</p>
              )}
            </div>
          </div>
        </div>

        {editIndex !== null && editType && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Edit{' '}
                  {editType === 'qualification'
                    ? 'Qualification'
                    : 'Specialization'}
                </h2>
                <button onClick={closeEditModal} className="text-3xl">
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {editType === 'qualification' ? (
                  <>
                    <div className="mb-4">
                      <label htmlFor="editDegree" className="block mb-2">
                        Degree:
                      </label>
                      <input
                        type="text"
                        id="editDegree"
                        value={editDegree}
                        onChange={(e) => setEditDegree(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="editInstitution" className="block mb-2">
                        Institution:
                      </label>
                      <input
                        type="text"
                        id="editInstitution"
                        value={editInstitution}
                        onChange={(e) => setEditInstitution(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="editYear" className="block mb-2">
                        Year:
                      </label>
                      <input
                        type="text"
                        id="editYear"
                        value={editYear}
                        onChange={(e) => setEditYear(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label htmlFor="editName" className="block mb-2">
                        Name:
                      </label>
                      <input
                        type="text"
                        id="editName"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="editDescription" className="block mb-2">
                        Description:
                      </label>
                      <textarea
                        id="editDescription"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="bg-[#2ecc71] text-white px-4 py-2 rounded hover:bg-[#27ae60] transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Qualification;
