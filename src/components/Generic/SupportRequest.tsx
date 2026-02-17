import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { submitRequest } from "../../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { SupportCard } from "./SupportCard";
import { changeEventActions } from "../../redux/Slices/changeEvent";


export const SupportRequest = () => {
    const [title,setTitle] = useState('');
    const [problem,setProblem] = useState('');
    const [priority,setPriority] = useState('normal');
    const userId = useSelector((state:any) => state.auth.userId);
    const userType = useSelector((state:any) => state.auth.userType);
    const dispatch = useDispatch();
    const handleSubmit = async(e: any) => {
        if(!title || !problem){
          toast.info("Please fill out title and problem statement");
          return;
        }
        e.preventDefault();
        let obj ={
          title,
          problem,
          priority,
          userId,
          userType
        }
        const response = await submitRequest(obj);
        if(response){
            toast.success("Request submitted successfully");
            dispatch(changeEventActions.setSupportTrigger());
            clearFields();
        }
      };
      const clearFields = () => {
        setTitle('');
        setProblem('');
        setPriority('normal');
      }
    return (
        <>
        <ToastContainer />
        <div
          className="p-4 bg-white dark:bg-black shadow-md rounded-lg mt-6 mx-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Support System</h2>
        
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
            required
          />
    
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Problem Statement
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
            required
          />
    
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring"
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
    
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Send Request
          </button>
        </div>
        <SupportCard />
        </>
    );
};