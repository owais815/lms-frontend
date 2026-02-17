import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addPlan, deletePlan, getPlans, updatePlan } from '../../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import { ConfirmationDialog } from '../../Generic/ConfirmationDialog';

const AdminPlanManagement = () => {
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', features: '' });
    const [editId, setEditId] = useState(null);
    const [delId, setDelId] = useState('');
    const [dialog,setDialog] = useState(false);

    // Fetch plans from the backend
    useEffect(() => {
      
        fetchPlans();
    }, []);
    const fetchPlans = async () => {
        try {
            const response = await getPlans();
            setPlans(response.data.plans);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };
    // Add or Update plan
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const features = formData.features.split(',').map((feature) => feature.trim());
        let obj = { ...formData, features };
        try {
            if (editId) {
                const response = await updatePlan(editId,obj);
                if(response.data){
                    toast.info("Plan updated successfully!");
                    clearFields();
                    fetchPlans();
                }
            }else{
                const response = await addPlan(obj);
                if(response.data){
                    toast.success("Plan added successfully!");
                    clearFields();
                    fetchPlans();
                }
            } 
            } catch (error) {
              console.error('Error fetching enrolled teachers:', error);
            }
    };

    // Delete plan
    const handleDelete = async () => {
        try {
            const response = await deletePlan(delId);
            if(response.data){
                toast.info("Plan deleted successfully!");
            }
            setPlans(plans.filter((plan:any) => plan.id !== delId));
            setDelId('');
            setDialog(false);
        } catch (error) {
            console.error('Error deleting plan:', error);
            setDelId('');

        }
    };

    // Populate form for editing
    const handleEdit = (plan:any) => {
        setEditId(plan.id);
        setFormData({ ...plan, features: plan.features.join(', ') });
    };

    const clearFields = () =>{
        setEditId(null);
        setFormData({ name: '', description: '', price: '', features: '' });
    }
    return (
        <div className="p-6">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Admin Plan Management</h1>

            {/* Plan Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="grid gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Plan Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Features (comma-separated)"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        className="p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    {editId ? 'Update Plan' : 'Add Plan'}
                </button>
            </form>

            {/* Plan List */}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Description</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Features</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.map((plan:any) => (
                        <tr key={plan.id}>
                            <td className="border border-gray-300 px-4 py-2">{plan?.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{plan?.description}</td>
                            <td className="border border-gray-300 px-4 py-2">${plan?.price}</td>
                            <td className="border border-gray-300 px-4 py-2">{plan?.features.join(', ')}</td>
                            <td className="border border-gray-300 px-4 py-2 space-x-2">
                                <button onClick={() => handleEdit(plan)} className="px-2 py-1 bg-green-500 text-white rounded">
                                    Edit
                                </button>
                                <button onClick={() => {setDialog(true); setDelId(plan.id)}} className="px-2 py-1 bg-red-500 text-white rounded">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {dialog && 
            <ConfirmationDialog 
             title="Delete"
             message="Are you sure you want to delete this plan?"
             handleConfirm={handleDelete}
             confirmText="Delete"
             closeDialog={()=>{setDialog(false)}}
            />
        }
        </div>
    );
};

export default AdminPlanManagement;
