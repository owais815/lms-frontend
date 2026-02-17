import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadResource } from '../../../api/auth';
import { Loader } from '../../Loader';

interface Props {
  students: { id: number; firstName: string; lastName: string }[];
  courses: { id: number; courseName: string }[];
  selectedStudent: string;
  selectedCourse: string;
  teacherId: string;
  onStudentChange: (studentId: string) => void;
  onCourseChange: (courseId: string) => void;
  onUploadSuccess: () => void;
}

const ResourceUploadForm: React.FC<Props> = ({
  students,
  courses,
  selectedStudent,
  selectedCourse,
  teacherId,
  onStudentChange,
  onCourseChange,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!selectedStudent || !selectedCourse || !file || !teacherId) {
      toast.info(
        'Please select a student, course, and file.'
      );
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', selectedStudent);
    formData.append('courseId', selectedCourse);
    formData.append('teacherId', teacherId);

    try {
      const response = await uploadResource(formData);
      // // console.log('Upload response:', response);
      if (response && response.data && response.data.message) {
        toast.success(response.data.message);
        setFile(null);
        onStudentChange('');
        onCourseChange('');
        onUploadSuccess();
      } else {
        toast.error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast.error('Failed to upload resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleUpload}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="student"
          >
            Student
          </label>
          <select
            id="student"
            value={selectedStudent}
            onChange={(e) => onStudentChange(e.target.value)}
            className="flex h-10 dark:text-black w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {`${student.firstName} ${student.lastName}`}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="course"
          >
            Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="flex h-10 dark:text-black w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedStudent}
          >
            <option value="">Select course</option>
            {courses.map((course:any) => (
              <option key={course.id} value={course.id}>
                {course.Course.courseName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-12">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="upload-file"
          >
            Upload File
          </label>
          <div className="relative">
            <input
              type="file"
              id="upload-file"
              onChange={handleFileChange}
              className="flex h-10 bg-white dark:bg-black w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="flex justify-end">
              <button
                disabled={isLoading}
                type="submit"
                className="mt-5 text-sm rounded-sm bg-primary py-2 px-4 font-medium text-gray hover:bg-opacity-90"
              >
                {isLoading ? <Loader /> : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ResourceUploadForm;