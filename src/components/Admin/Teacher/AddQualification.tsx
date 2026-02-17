import { toast } from "react-toastify";
import { addQualification } from "../../../api/auth";
import { useState } from "react";


export const AddQualification = ({teacherId}:any) =>{
    const [qualification, setQualification] = useState<any>({
        degree: '',
        institution: '',
        year: '',
        teacherId: '',
      });
    const handleQualificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          await addQualification({
            ...qualification,
            teacherId: teacherId,
          });
          toast.success('Qualification added successfully');
        } catch (error) {
          console.error('Error adding qualification:', error);
          toast.error('Failed to add qualification');
        }
      };


    return(
        <div className=" mt-10  globalCardStyle containerr p-4">
        
          <div className="flex">
            <h3 className="text-lg dark:text-white font-bold mb-4">Add Qualification</h3>
            {/* <button
              type="button"
              onClick={handleCloseModals}
              className="focus:outline-none focus:shadow-outline"
            >
              <CrossIcon />
            </button> */}
          </div>
          <form onSubmit={handleQualificationSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Qualification Name
              </label>
              <input
                type="text"
                placeholder="Enter Qualification Name"
                className="dark:bg-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                placeholder="Enter Institution Name"
                className="dark:bg-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                Year
              </label>
              <input
                type="text"
                placeholder="Enter Year"
                className="dark:bg-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
    )
}