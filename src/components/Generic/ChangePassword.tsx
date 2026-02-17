import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"



export const ChangePassword = (props:any) =>{
    const [newPwd,setNewPwd] = useState('')
    const [confirmPwd,setConfirmPwd] = useState('')

    const handleUpdate = () =>{
        if(newPwd.length < 3){
            toast.warn('Password too short')
            return
        }
        if(newPwd !== confirmPwd){
            toast.warn('Password does not match')
            return
        }
        props.handleUpdate(newPwd)
    }
    return(
        <div className="flex flex-col gap-6">
        <ToastContainer />
        <div>
        <label
          htmlFor="firstName"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          New Password
        </label>
        <input
          type="password"
          name="newPwd"
          id="newPwd"
          value={newPwd}
          onChange={(e) =>
            setNewPwd(e.target.value)
          }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
          placeholder="Please enter new password"
          required
        />
      </div>
       
        <div>
        <label
          htmlFor="firstName"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPwd"
          id="confirmPwd"
          value={confirmPwd}
          onChange={(e) =>
            setConfirmPwd(e.target.value)
          }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
          placeholder="Please enter new password"
          required
        />
      </div>
      <button onClick={()=>{handleUpdate()}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
        Update
      </button>
      </div>
    )
}