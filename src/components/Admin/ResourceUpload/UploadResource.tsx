import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllStudents,
  getCourseByStdId,
  getTeacherById,
  getResourcesByStudentAndCourse,
} from '../../../api/auth';
import ResourceUploadForm from './ResourceUploadForm';
import ResourceList from './ResourceList';
import ResourceModal from './ResourceModal';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

interface Course {
  id: number;
  courseName: string;
}

interface Resource {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
}

const UploadResource: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [teacherId, setTeacherId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalResource, setModalResource] = useState<Resource | null>(null);
  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    fetchStudents();
    if (userId) {
      getTeacher();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedStudent) {
      fetchCourses(selectedStudent);
    } else {
      setCourses([]);
      setSelectedCourse('');
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedStudent && selectedCourse) {
      fetchResources();
    } else {
      setResources([]);
    }
  }, [selectedStudent, selectedCourse]);

  const getTeacher = async () => {
    try {
      const response = await getTeacherById(userId);
      if (response.data && response.data.teacher) {
        setTeacherId(response.data.teacher.id.toString());
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
      toast.error('Failed to fetch teacher information');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      if (response.data && response.data.students) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }
  };

  const fetchCourses = async (studentId: string) => {
    // console.log('Fetching courses for student ID:', studentId);
    try {
      const response = await getCourseByStdId(studentId);
      if (response.data && Array.isArray(response.data.course)) {
        setCourses(response.data.course);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      setCourses([]);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await getResourcesByStudentAndCourse(
        selectedStudent,
        selectedCourse
      );
      if (response.data && Array.isArray(response.data)) {
        setResources(response.data);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to fetch resources');
      setResources([]);
    }
  };

  return (
    <div className="flex containerr flex-col mt-6">
      <ToastContainer />
      <main className="flex-1 overflow-auto p-2">
        <div className="globalCardStyle px-4 pt-4 text-black dark:text-white ">
          <div className="flex flex-col ">
            <h3 className="ch">
              Upload Resource
            </h3>
            <p className="text-sm text-muted-foreground">
              Select a student, course, and file to upload.
            </p>
          </div>
          <div className="p-2">
            <ResourceUploadForm
              students={students}
              courses={courses}
              selectedStudent={selectedStudent}
              selectedCourse={selectedCourse}
              teacherId={teacherId}
              onStudentChange={(studentId) => {
                setSelectedStudent(studentId);
                setSelectedCourse(''); // Clear course selection
              }}
              onCourseChange={(courseId) => setSelectedCourse(courseId)}
              onUploadSuccess={fetchResources}
            />

            {selectedStudent && selectedCourse && (
              <ResourceList
                resources={resources}
                onResourceClick={(resource) => {
                  setModalResource(resource);
                  setShowModal(true);
                }}
                onDeleteResource={fetchResources}
                showDelete={true}
              />
            )}
          </div>
        </div>
      </main>

      {showModal && modalResource && (
        <ResourceModal
          resource={modalResource}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UploadResource;
