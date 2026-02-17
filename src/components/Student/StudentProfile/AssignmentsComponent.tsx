import  { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getStudentAssignments, submitAssignment } from '../../../api/auth';
import ResourceModal from '../../Admin/ResourceUpload/ResourceModal';
import { toast } from 'react-toastify';
import { GetUserImageAndName } from '../../Generic/GetUserImageAndName';
import { EmptyTemplate } from '../../Generic/EmptyTemplate';

interface Assignment {
  id: number;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Graded';
  submissionDate: string | null;
  score: number | null;
  feedback: string | null;
  Assignment: {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    fileUrl: string;
    createdAt: string;
    maxScore: number;
    Teacher: {
      firstName: string;
      lastName: string;
    };
  };
}

export const AssignmentsComponent = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const userId = useSelector((state: any) => state.auth.userId);

  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionAssignmentId, setSubmissionAssignmentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getStudentAssignments(userId);

        // Filter assignments to include only those with a non-empty fileUrl
        const filteredAssignments = response.data.assignments.filter(
          (assignment: Assignment) => assignment.Assignment.fileUrl && assignment.Assignment.fileUrl.trim() !== ''
        );

        setAssignments(filteredAssignments);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch assignments');
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [userId]);

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'Not Started':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Submitted':
      case 'Graded':
        return 'bg-green-100 text-green-800';
    }
  };

  const ClickviewAssigment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleDownloadClick = (assignment: Assignment) => {
    if (assignment.status === 'Not Started' || assignment.status === 'In Progress') {
      setSubmissionAssignmentId(assignment.Assignment.id);
      setShowSubmissionModal(true);
    } else if (assignment.status === 'Submitted') {
      setSelectedAssignment(assignment);
      toast.success('Assignment submitted successfully');
    }
  };

  const handleFileSubmit = async () => {
    if (submissionFile && submissionAssignmentId) {
      try {
        await submitAssignment(submissionAssignmentId.toString(), submissionFile);

        setShowSubmissionModal(false);
        // Refresh assignments after submission
        const response = await getStudentAssignments(userId);
        const filteredAssignments = response.data.assignments.filter(
          (assignment: Assignment) => assignment.Assignment.fileUrl && assignment.Assignment.fileUrl.trim() !== ''
        );
        setAssignments(filteredAssignments);
      } catch (err) {
        toast.error('Error submitting assignment');
        setError('Failed to submit assignment');
      }
    }
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setSubmissionFile(null);
    setShowSubmissionModal(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className=" containerr mx-auto mt-6 p-6 globalCardStyle shadow-lg rounded-lg dark:bg-transparent">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Assignments</h2> */}
      {assignments.length === 0 ? (
        <EmptyTemplate
          heading={"No Assignments Found"}
          description={"You don't have any assignments yet."}
        />
      ) : (
        <div className="space-y-2">
          {assignments.map((assignment:any) => (
            <div
              key={assignment.id}
              className="p-4 globalCardStyle"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-grey-600 dark:text-slate-50">
                    {assignment.Assignment.title}
                  </h3>
                  <p className="text-sm text-grey-600 dark:text-slate-50 mt-1 ">
                    <span className='font-semibold'> Dated: </span>
                    
                    {new Date(assignment.Assignment.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-grey-600 dark:text-slate-50 mt-1">
                  <span className='font-semibold'> Due Date: </span>  {new Date(assignment.Assignment.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-grey-600 dark:text-slate-50 flex items-center gap-2">
                  <span className='font-semibold'> Submitted to: </span> 
                  {/* {`${assignment.Assignment.Teacher.firstName} ${assignment.Assignment.Teacher.lastName}`} */}
                  <GetUserImageAndName 
                    firstName={assignment?.Assignment?.Teacher?.firstName}
                    lastName={assignment?.Assignment?.Teacher?.lastName}
                    imageUrl={assignment.Assignment.Teacher?.imageUrl}
                    userType={"teacher"}
                    userId={assignment?.Assignment?.Teacher?.id}
                  />
                  </p>
                  <p className="text-sm text-grey-600 dark:text-slate-50  ">
                  <span className='font-semibold'>  Max Score: </span> {assignment.Assignment.maxScore}
                  </p>
                  <p className="text-sm text-grey-600 dark:text-slate-50  ">
                  <span className='font-semibold'>  Obtain Score: </span> {assignment.score ?? 'Not graded yet'}
                  </p>
                  <p className="text-sm text-grey-600 dark:text-slate-50  ">
                  <span className='font-semibold'>  Feedback: </span> {assignment.feedback ?? 'No Feedback yet'}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    assignment.status
                  )}`}
                >
                  {assignment.status}
                </span>
              </div>
              {assignment.status !== 'Submitted' && assignment.status !== 'Graded' && (
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => ClickviewAssigment(assignment)}
                  >
                    View Assignment
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => handleDownloadClick(assignment)}
                  >
                    Submit Assignment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedAssignment && (
        <ResourceModal
          resource={{
            id: selectedAssignment.Assignment.id,
            fileName: selectedAssignment.Assignment.title,
            fileType: 'application/pdf', 
            filePath: selectedAssignment.Assignment.fileUrl, 
          }}
          onClose={closeModal}
        />
      )}

      {showSubmissionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Submit Assignment</h3>
            <input
              type="file"
              onChange={(e) => setSubmissionFile(e.target.files ? e.target.files[0] : null)}
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                onClick={handleFileSubmit}
              >
                Submit
              </button>
              <button
                className="bg-red-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
