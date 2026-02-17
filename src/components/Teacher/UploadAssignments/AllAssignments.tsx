import React, { useEffect, useState } from 'react';
import { getAllAssignmentsTeacher, deleteAssignmentFile } from '../../../api/auth';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SearchIcon from '../../Icons/SearchIcon';
import ResourceModal from '../../Admin/ResourceUpload/ResourceModal';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  fileUrl: string;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  teacherId: number;
  CourseDetails: {
    id: number;
    courseName: string;
    duration: string;
    description: string;
    teacherId: number;
    studentId: number;
    createdAt: string;
    updatedAt: string;
  };
}

export const AllAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const teacherId = useSelector((state: any) => state.auth.userId);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getAllAssignmentsTeacher(teacherId);
        // console.log('Raw response data:', response.data);
        if (Array.isArray(response.data.assignments)) {
          setAssignments(response.data.assignments);
          setFilteredAssignments(response.data.assignments);
        } else {
          console.error('Unexpected response structure:', response.data);
          setAssignments([]);
          setFilteredAssignments([]);
        }
      } catch (error) {
        toast.error('Error fetching assignments');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [teacherId]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = assignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(lowercasedFilter) ||
        assignment.CourseDetails.courseName.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredAssignments(filteredData);
  }, [searchTerm, assignments]);

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteAssignment = async () => {
    if (assignmentToDelete) {
      try {
        await deleteAssignmentFile(assignmentToDelete);
        setAssignments(assignments.filter((assignment) => assignment.id.toString() !== assignmentToDelete));
        setFilteredAssignments(filteredAssignments.filter((assignment) => assignment.id.toString() !== assignmentToDelete));
        toast.success('Assignment deleted successfully');
      } catch (error) {
        toast.error('Error deleting assignment');
      } finally {
        setShowDeleteModal(false);
        setAssignmentToDelete(null);
      }
    }
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const closeModal = () => {
    setSelectedAssignment(null);
  };

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  return (
    <div className="containerr mt-6">
      <div className="flex justify-between items-center">
        <h2 className="MainHeadings mb-6">All Assignments</h2>
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-50 pl-10 pr-3 py-1 text-sm text-gray-900 rounded-lg bg-gray-50 focus:outline-none border"
            placeholder="Search Assignments..."
          />
        </div>
      </div>
      {filteredAssignments.length === 0 ? (
        <div>No assignments found</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAssignments.map((assignment:any) => (
            <div
              key={assignment.id}
              className="p-6 rounded-lg globalCardStyle text-black dark:text-white bg-cover bg-no-repeat "
            >
              <div className="flex justify-between">
                <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-600 mb-2">
                <strong>Course:</strong> {assignment.CourseDetails?.Course?.courseName}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Max Score:</strong> {assignment.maxScore}
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleViewAssignment(assignment)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Assignment
                </button>
                <button
                  onClick={() => handleDeleteAssignment(assignment.id.toString())}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this assignment?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAssignment}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAssignment && (
        <ResourceModal
          resource={{
            id: selectedAssignment.id,
            fileName: selectedAssignment.title,
            fileType: 'application/pdf', // Assuming PDF, adjust if needed
            filePath: selectedAssignment.fileUrl,
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
};