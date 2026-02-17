import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import SearchableDropdown from '../../Generic/SearchableDropdown';
import { addMonthlyFee, getAllStudents } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import AdminPaymentHistory from './PaymentHistoryView';

const AddMonthlyFee = () => {
  const [amount, setAmount] = useState('');
  const [students, setStudents] = useState<any>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsResponse = await getAllStudents();

      const studentsData = studentsResponse.data.students || [];

      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let obj = {
      studentId: selectedStudent,
      amount,
    };
    try {
      const response = await addMonthlyFee(obj);
      if (response.data) {
        toast.success('Monthly Fee Added Successfully');
        clearFields();
      }
    } catch (error) {
      console.error('Error recording monthly fee:', error);
      toast.error('Failed to add monthly fee');
    }
  };

  const clearFields = () => {
    setAmount('');
    setSelectedStudent('');
  };

  const studentOptions = useMemo(
    () =>
      students.map((student: any) => (
        <option key={student.id} value={student.id.toString()}>
          {`${student?.firstName} ${student?.lastName}`}
        </option>
      )),
    [students],
  );

  return (
    <>
      <div className="containerr mx-auto p-4">
        <ToastContainer />
        <h1 className="text-xl font-bold mb-4">Add Monthly Fee</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
                    <label className="block text-sm font-medium">Student ID</label>
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                </div> */}
          <SearchableDropdown
            options={studentOptions}
            value={selectedStudent}
            onChange={setSelectedStudent}
            label="Select Student"
            placeholder="Select a student"
            searchPlaceholder="Search students..."
            required
          />
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
      <AdminPaymentHistory />
    </>
  );
};

export default AddMonthlyFee;
