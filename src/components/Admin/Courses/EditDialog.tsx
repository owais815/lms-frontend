import axios from '../../../api/axios';
import CrossIcon from '../../Icons/CrossIcon';

export const EditCourseDialog = (props: any) => {
  return (
    <div
      id="editCourseModal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative ml-67.5 bg-whiten dark:bg-slate-800 w-full max-w-2xl max-h-full">
        <div className="relative rounded shadow dark:bg-gray-700">
          <button
            onClick={props.toggleDialog}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="editCourseModal"
          >
            <CrossIcon />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Edit Course
            </h3>
            <form className="space-y-6" onSubmit={props.handleUpdate}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="courseName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    id="courseName"
                    value={props.currentCourse?.courseName || ''}
                    onChange={(e) => props.setCurrentCourse(e, 'courseName')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                    placeholder="Course Name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    id="duration"
                    value={props.currentCourse?.duration || ''}
                    onChange={(e) => props.setCurrentCourse(e, 'duration')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                    placeholder="Duration"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={props.currentCourse?.description || ''}
                  onChange={(e) => props.setCurrentCourse(e, 'description')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  placeholder="Course Description"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="image"
                >
                  Upload Course Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={props.handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {/* {props.currentCourse?.imageUrl && ( */}
                <div className="mt-4">
                  <img
                    src={
                      props.currentCourse?.imageUrl
                        ? `${axios.defaults.baseURL}/${props.currentCourse?.imageUrl}`
                        : '../../../../src/images/dummyupcoming.jpg'
                    }
                    alt={'default'}
                    className="w-50 h-40 object-cover rounded-lg"
                  />
                </div>
                {/* )} */}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
