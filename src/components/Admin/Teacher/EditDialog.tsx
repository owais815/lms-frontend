import React from 'react'
import CrossIcon from '../../Icons/CrossIcon'

export const EditDialog = (props:any) => {
  return (
    <div
    id="editUserModal"
    tabIndex={-1}
    aria-hidden="true"
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full"
  >
    <div className="relative md:ml-67.5 lg:ml-67.5 ml-0 bg-whiten dark:bg-slate-800 w-full max-w-2xl max-h-full">
      <div className="relative  rounded shadow dark:bg-gray-700">
        <button
          onClick={props.toggleDialog}
          type="button"
          className="absolute  top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
          data-modal-hide="editUserModal"
        >
            <CrossIcon />
          <span className="sr-only">Close modal</span>
        </button>
        <div className="px-6 py-6 lg:px-8">
          <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit user</h3>
          <form className="space-y-6"  onSubmit={props.handleUpdate} >
          <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={props.currentTeacher?.firstName || ''}
                      onChange={(e) =>
                        props.setCurrentTeacher(e, 'firstName')
                      }
                      className="bg-gray-50 dark:bg-black dark:text-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                      placeholder="First Name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={props.currentTeacher?.lastName || ''}
                      onChange={(e) =>
                        props.setCurrentTeacher(e, 'lastName')
                      }
                      className="bg-gray-50 dark:bg-black dark:text-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Contact
                    </label>
                    <input
                      type="number"
                      name="contact"
                      id="contact"
                      value={props.currentTeacher?.contact || ''}
                      onChange={(e) =>
                        props.setCurrentTeacher(e, 'contact')
                      }
                      className="bg-gray-50 dark:bg-black dark:text-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:text-black dark:border-gray-500 dark:placeholder-gray-400 "
                      placeholder="Contact"
                      required
                    />
                  </div>

                </div>


           
            <button
              type="submit"
              className="w-full text-white dark:text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save changes
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
   
  )
}
