import React, { useEffect, useState } from 'react';
import {
  getTeacherAssignments,
  deleteSubmittedAssignmentFile,
  gradeAssignment,
} from '../../../api/auth';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SearchIcon from '../../Icons/SearchIcon';
import ResourceModal from '../../Admin/ResourceUpload/ResourceModal';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';
import { DeleteIcon } from 'lucide-react';
interface Assignment {
  title: string;
  description: string;
  dueDate: Date;
  CourseDetails: {
    courseName: string;
  };
  maxScore: number;
  fileUrl?: string;
}

interface AssignmentResponse {
  id: string;
  Assignment: Assignment;
  status: string;
  fileUrl?: string;
  Student: {
    firstName: string;
    lastName: string;
  };
}

export const SubmittedAssignments = () => {
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<AssignmentResponse | null>(null);

  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<
    AssignmentResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const teacherId = useSelector((state: any) => state.auth.userId);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentResponse | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(
    null,
  );

  const handleAddMarks = (assignment: AssignmentResponse) => {
    setSelectedAssignment(assignment);
    setScore(0);
    setFeedback('');
    setShowModal(true);
  };

  const handleSaveGrade = async () => {
    if (selectedAssignment) {
      try {
        await gradeAssignment({
          submittedAssignmentId: selectedAssignment.id,
          score,
          feedback,
        });
        toast.success('Assignment graded successfully');
        setShowModal(false);

        // Update the assignments list with the new grade
        const updatedAssignments = assignments.map((assignment) =>
          assignment.id === selectedAssignment.id
            ? { ...assignment, status: 'Graded', score, feedback }
            : assignment,
        );
        setAssignments(updatedAssignments);
        setFilteredAssignments(updatedAssignments);
      } catch (error) {
        toast.error('Error grading assignment');
      }
    }
  };

  const handleViewSubmission = (assignment: AssignmentResponse) => {
    setSelectedSubmission(assignment);
    setShowResourceModal(true);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getTeacherAssignments(teacherId);
        const filteredAssignments = response.data.assignments.filter(
          (assignment: AssignmentResponse) => 
            assignment.status === 'Submitted' || assignment.status === 'Graded'
        );
        setAssignments(filteredAssignments);
        setFilteredAssignments(filteredAssignments);
      } catch (error) {
        toast.error('Error fetching assignments');
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
        (assignment.Assignment.title.toLowerCase().includes(lowercasedFilter) ||
        assignment.Student.firstName.toLowerCase().includes(lowercasedFilter) ||
        assignment.Student.lastName.toLowerCase().includes(lowercasedFilter) ||
        assignment.Assignment.CourseDetails.courseName
          .toLowerCase()
          .includes(lowercasedFilter) ||
        assignment.status.toLowerCase().includes(lowercasedFilter)) &&
        (assignment.status === 'Submitted' || assignment.status === 'Graded')
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
        await deleteSubmittedAssignmentFile(assignmentToDelete);
        setAssignments(
          assignments.filter(
            (assignment) => assignment.id !== assignmentToDelete,
          ),
        );
        setFilteredAssignments(
          filteredAssignments.filter(
            (assignment) => assignment.id !== assignmentToDelete,
          ),
        );
        toast.success('Assignment deleted successfully');
      } catch (error) {
        toast.error('Error deleting assignment');
      } finally {
        setShowDeleteModal(false);
        setAssignmentToDelete(null);
      }
    }
  };

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  return (
    <div className="mt-6 containerr">
      <div className="flex justify-between items-center">
        <h2 className="MainHeadings mb-6">
          Submitted Assignments
        </h2>
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-50 pl-10 pr-3 py-1 text-sm text-gray-900 rounded-lg bg-gray-50 dark:bg-black focus:outline-none border"
            placeholder="Search Assignments..."
          />
        </div>
      </div>
      {filteredAssignments.length === 0 ? (
        <div>No assignments found</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-6">
          {filteredAssignments.map((assignment:any) => (
            <div
              key={assignment.id}
              className="p-4 rounded-lg globalCardStyle text-black dark:text-white "
            >
              <div className="flex justify-between">
                <h3 className="text-xl font-bold mb-2">
                  {assignment.Assignment.title}
                </h3>
                
              </div>
              <div className='md:flex md:items-center md:justify-between lg:flex lg:items-center lg:justify-between grid grid-col-1'>
                <div className="flex  flex-col gap-2">
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <strong>Student:</strong> 
                <GetUserImageAndName 
                  userType={"student"}
                  userId={assignment?.Student?.id}
                  firstName={assignment?.Student?.firstName}
                  lastName={assignment?.Student?.lastName}
                  imageUrl={assignment.Student.profileImg}
                />
              </p>
              <p className="text-gray-600 mb-2 flex items-center gap-2 ">
                <strong>Course:</strong>
                {assignment.Assignment.CourseDetails?.Course?.courseName}
              </p>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <strong>Max Score:</strong> {assignment.Assignment.maxScore}
              </p>
              </div>
              <div className="flex  flex-col gap-2">
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <strong>Due:</strong>
                  <span className='bg-red-400 text-white px-4 py-2 rounded-full'> {new Date(assignment.Assignment.dueDate).toLocaleDateString()}</span>
                </p>
                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <strong>Status:</strong> 
                  <span className='bg-blue-400 text-white px-4 py-2 rounded-full'>{assignment.status}</span>
                </p>
            </div>
              </div>
             
              <div className="md:flex md:justify-end md:items-center lg:flex lg:justify-end lg:items-center grid grid-col-1 gap-2 mt-4">
                <button
                  onClick={() => handleViewSubmission(assignment)}
                  className={`px-4 py-2 rounded mr-2 ${
                     assignment.status === 'Not Started'
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-500 text-white'
                  }`}
                  disabled={ assignment.status === 'Not Started'}
                >
                  View Submission
                </button>
                <button
                  onClick={() => handleAddMarks(assignment)}
                  className={`px-4 py-2 rounded mr-2 ${
                    assignment.status === 'Graded'|| assignment.status === 'Not Started'
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-500 text-white'
                  }`}
                  disabled={assignment.status === 'Graded' || assignment.status === 'Not Started'}
                >
                  Add Marks & Feedback
                </button>

                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  <DeleteIcon />
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

      {showModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h3 className="text-xl font-semibold mb-4">Add Marks & Feedback</h3>
            <p>Assignment: {selectedAssignment.Assignment.title}</p>
            <p>
              Student: {selectedAssignment.Student.firstName}{' '}
              {selectedAssignment.Student.lastName}
            </p>
            <input
              type="number"
              placeholder="Marks"
              className="border p-2 rounded mb-2 w-full"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
            />
            <textarea
              placeholder="Feedback"
              className="border p-2 rounded mb-2 w-full"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Close
              </button>
              <button
                onClick={handleSaveGrade}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showResourceModal && selectedSubmission && (
        <ResourceModal
          resource={{
            id: parseInt(selectedSubmission.id),
            fileName: `${selectedSubmission.Student.firstName} ${selectedSubmission.Student.lastName}'s Submission`,
            fileType: 'application/pdf',
            filePath: selectedSubmission.fileUrl || '',
          }}
          onClose={() => {
            setShowResourceModal(false);
            setSelectedSubmission(null);
          }}
        />
      )}
    </div>
  );
};
