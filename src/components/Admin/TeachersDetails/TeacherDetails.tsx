import React, { useEffect, useState } from 'react';
import { getAllTeachers, addQualification, addSpecialization } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CrossIcon from '../../Icons/CrossIcon';


interface Qualification {
    degree: string;
    institution: string;
    teacherId: string;
    year: string;
}

interface Specialization {
    name: string;
    description: string;
    teacherId: string;
}

type Teacher = {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
};
interface TeacherDetailsProps {
    hideDropdown?: boolean;
    teacherId?: string;
    onSubmitQualification?: (qualification: Qualification) => void;
    onSubmitSpecialization?: (specialization: Specialization) => void ;
    hideAddButtons?: boolean;

}

const TeacherDetails: React.FC<TeacherDetailsProps> = ({ hideDropdown = false, teacherId,onSubmitQualification,onSubmitSpecialization,hideAddButtons }) => {
    const [showQualificationModal, setShowQualificationModal] = useState(false);
    const [showSpecializationModal, setShowSpecializationModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<string>(teacherId || '');
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const [qualification, setQualification] = useState<Qualification>({
        degree: '',
        institution: '',
        year: '',
        teacherId: '',
    });

    const [specialization, setSpecialization] = useState<Specialization>({
        name: '',
        description: '',
        teacherId: '',
    });


    useEffect(() => {
        if (!hideDropdown) {
            const fetchData = async () => {
                try {
                    const teachersResponse = await getAllTeachers();
                    const teachersData = teachersResponse.data.teachers || [];
                    setTeachers(teachersData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    toast.error('Failed to fetch teachers');
                }
            };
            fetchData();
        }
    }, [hideDropdown]);

    useEffect(() => {
        if (teacherId) {
            setSelectedTeacher(teacherId);
        }
    }, [teacherId]);
    const handleQualificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
           const response = await addQualification({
                ...qualification,
                teacherId: selectedTeacher,
            });
            // console.log("qualification response:",response);
            if(onSubmitQualification){
                onSubmitQualification(response.data.qualification);
            }
            toast.success('Qualification added successfully');
            setShowQualificationModal(false);
            setQualification({
                degree: '',
                institution: '',
                year: '',
                teacherId: '',
            });
        } catch (error) {
            console.error('Error adding qualification:', error);
            toast.error('Failed to add qualification');
        }
    };

 const handleSpecializationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
           const response = await addSpecialization({
                ...specialization,
                teacherId: selectedTeacher,
            });
            if(onSubmitSpecialization){
                onSubmitSpecialization(response.data.specialization);
            }
            toast.success('Specialization added successfully');
            setShowSpecializationModal(false);
            setSpecialization({
                name: '',
                description: '',
                teacherId: '',
            });
        } catch (error) {
            console.error('Error adding specialization:', error);
            toast.error('Failed to add specialization');
        }
    };

    return (
        <div className="container mx-auto p-2">
            <ToastContainer />
            <div className="flex justify-between">
            {!hideAddButtons  && (
                <div className='flex md:flex-row lg:flex-row flex-col md:w-auto lg:w-auto w-full gap-2'><button
                        onClick={() => setShowQualificationModal(true)}
                        className="bg-blue-500 dark:bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Qualification
                    </button><button
                        onClick={() => setShowSpecializationModal(true)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                            Add Specialization
                        </button></div>
           )}
            </div>

            {/* Qualification Modal */}
            {showQualificationModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full  w-full">
                    <div className="relative top-40 mx-auto p-5 border border-zinc-300 w-96 globalCardStyle">
                        
                        <div className='flex justify-between'>
                        <h3 className="text-lg font-bold mb-4">Add Qualification</h3>
                        <button
                                    type="button"
                                    onClick={() => setShowQualificationModal(false)}
                                    className="focus:outline-none focus:shadow-outline"
                                >
                                    <CrossIcon />
                                </button>
                        </div>
                        <form className=' ' onSubmit={handleQualificationSubmit}>
                        {!hideDropdown && (
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Select Teacher:
                                        <select
                                            value={selectedTeacher}
                                            onChange={(e) => setSelectedTeacher(e.target.value)}
                                            className="bg-gray-50 dark:bg-black border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                                        >
                                            <option value="">Select a teacher</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher.id} value={teacher.id.toString()}>
                                                    {`${teacher.firstName} ${teacher.lastName}`}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Qualification Name
                                </label>
                                <input
                                    type="text"
                                    placeholder='Qualification Name'
                                    className="shadow dark:bg-black appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={qualification.degree}
                                    onChange={(e) =>
                                        setQualification({
                                            ...qualification,
                                            degree: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Institution Name
                                </label>
                                <input
                                    type="text"
                                    placeholder='Institution Name'
                                    className="shadow dark:bg-black appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={qualification.institution}
                                    onChange={(e) =>
                                        setQualification({
                                            ...qualification,
                                            institution: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                year
                                </label>
                                <input
                                    type="text"
                                    placeholder='YYYY'
                                    className="shadow dark:bg-black appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={qualification.year}
                                    onChange={(e) =>
                                        setQualification({
                                            ...qualification,
                                            year: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Submit
                                </button>
                              
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Specialization Modal */}
            {showSpecializationModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50  overflow-y-auto h-full w-full">
                    <div className="relative top-40 mx-auto p-5 border border-zinc-300  w-96 globalCardStyle">

                        <div className='flex justify-between'>
                        <h3 className="text-lg font-bold mb-4">Add Specialization</h3>
                        <button
                                    type="button"
                                    onClick={() => setShowSpecializationModal(false)}
                                    className="focus:outline-none focus:shadow-outline"
                                >
                                    <CrossIcon />
                                </button>
                        </div>
                       
                        <form onSubmit={handleSpecializationSubmit}>
                        {!hideDropdown && (
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Select Teacher:
                                        <select
                                            value={selectedTeacher}
                                            onChange={(e) => setSelectedTeacher(e.target.value)}
                                            className="bg-gray-50 dark:bg-black border border-gray-300 text-gray-900 text-sm rounded-lg block w-full focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:bg-slate-800"
                                        >
                                            <option value="">Select a teacher</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher.id} value={teacher.id.toString()}>
                                                    {`${teacher.firstName} ${teacher.lastName}`}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Specialization Name
                                </label>
                                <input
                                    type="text"
                                    placeholder='Specialization Name'
                                    className=" dark:bg-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={specialization.name}
                                    onChange={(e) =>
                                        setSpecialization({
                                            ...specialization,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                Description
                                </label>
                                <input
                                    type="textarea"
                                    className="shadow dark:bg-black appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={specialization.description}
                                    placeholder='Description'
                                    onChange={(e) =>
                                        setSpecialization({
                                            ...specialization,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Submit
                                </button>
                                
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDetails;
