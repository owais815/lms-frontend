import React, { useState } from 'react';

interface Specializations {
  title: string;
  details: string;
}

const Specializations: React.FC = () => {
  const [specializations, setSpecializations] = useState<Specializations[]>([
    { title: "Tafseer and Hadith Studies", details: "International Islamic University Islamabad (IIUI), 2010-2014" },
    { title: "Quranic Studies", details: "Allama Iqbal Open University (AIOU), 2015-2017" },
    { title: "Quranic Arabic", details: "Al-Huda International, 2018" }
  ]);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDetails, setEditDetails] = useState('');

  const openEditModal = (index: number) => {
    setEditIndex(index);
    setEditTitle(specializations[index].title);
    setEditDetails(specializations[index].details);
  };

  const closeEditModal = () => {
    setEditIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedQualifications = [...specializations];
      updatedQualifications[editIndex] = { title: editTitle, details: editDetails };
      setSpecializations(updatedQualifications);
      closeEditModal();
    }
  };

  return (
    <div className=" bg-[url('../../src/images/logo/background.png')] min-h-screen font-sans">
      
      
       
          {specializations.map((qual, index) => (
            <div key={index} className=" flex  justify-between bg-white rounded-lg shadow-md p-4 mb-6 hover:shadow-blue-100">

                <div className=''>
              <h2 className="text-xl font-bold text-[#2c3e50] mb-3">{qual.title}</h2>
              <p className="text-[#34495e] ">{qual.details}</p>
              </div>
              <button
                onClick={() => openEditModal(index)}
                className="bg-[#3498db] text-white h-7 w-20  mt-5 rounded hover:bg-[#2980b9] transition-colors"
              >
                Edit
              </button>
            </div>
          ))}
       
     

      {editIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Qualification</h2>
              <button onClick={closeEditModal} className="text-3xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="editTitle" className="block mb-2">Title:</label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editDetails" className="block mb-2">Details:</label>
                <textarea
                  id="editDetails"
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-[#2ecc71] text-white px-4 py-2 rounded hover:bg-[#27ae60] transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Specializations;