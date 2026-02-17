import { toast } from "react-toastify";
import { useState } from "react";
import { addSpecialization } from "../../../api/auth";

export const AddSpecialization = ({teacherId}:any) =>{
  const [specialization, setSpecialization] = useState<any>({
    name: '',
    description: '',
    teacherId: '',
  });

      const handleSpecializationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          await addSpecialization({
            ...specialization,
            teacherId: teacherId,
          });
          toast.success('Specialization added successfully');
          clearFields();
        } catch (error) {
          console.error('Error adding specialization:', error);
          toast.error('Failed to add specialization');
        }
      };

const clearFields = () =>{
  setSpecialization({
    name: '',
    description: '',
  })
}
    return(
        <div className=" mt-10  globalCardStyle containerr p-4">
        
        
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold mb-4">Add Specialization</h3>
                </div>

                <form onSubmit={handleSpecializationSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Specialization Name
                    </label>
                    <input
                      type="text"
                      placeholder="Specialization Name"
                      className="dark:bg-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                      type="text"
                      placeholder="Description"
                      className="dark:bg-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={specialization.year}
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
    )
}