import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import pdf from "../../../images/logo/pdf.svg";


export const ResourceDisplay = (props:any) => {

    const[fileType,setFileType] = useState('');
    const resource = props.resource;
    const course = props.resource?.CourseDetail?.Course;

    useEffect(()=>{
        if(resource?.fileType){
            setFileType(resource?.fileType);
        }else if(resource?.url){
            if(resource?.url?.endsWith('.pdf')){
                setFileType('application/pdf');
            }else{
                setFileType('image');
            }
        }
    },[props.resource]);

    return (
        <div >
          {course?.courseName && 
           <h2 className="text-lg text-center border-2 border-slate-300 rounded-lg mb-3 bg-slate-500 font-semibold text-white dark:text-white">
            {course?.courseName}
          </h2>
          }
            {fileType === 'application/pdf' ? (
                <div className="w-full flex justify-center mb-2">
                  <img src={pdf} alt="PDF Icon" className="w-full h-32 object-cover" />
                </div>
              ) : fileType.includes('image') ? (
                <img
                  src={`${axios.defaults.baseURL}${resource?.url ? resource?.url : resource.filePath}`}
                  alt={resource.filePath}
                  className="w-full h-32 object-cover mb-2"
                />
              ) : (
                <div className="w-full flex justify-center mb-2">
                  <span className="text-gray-500">Unsupported file type</span>
                </div>
              )}
        </div>
      //   <div>
      //   <img
      //     src={
      //       course?.imageUrl
      //         ? `${axios.defaults.baseURL}/${course?.imageUrl}`
      //         : '../../src/images/dummyupcoming.jpg'
      //     }
      //     alt={course?.courseName}
      //     className="w-full h-40 object-cover rounded-t-lg border-2 border-gray-200"
      //   />
       
      // </div>
    );
}