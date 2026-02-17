import React, { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import pdf from "../../../images/logo/pdf.svg";
import DeleteResourceConfirmation from './DeleteResourceConfirmation';
import { ResourceDisplay } from './ResourceDisplay';
import BookmarkedResource from '../../Student/StudentCourses/IsBookmarked';
import { toast } from 'react-toastify';
import { toggleBookmark } from '../../../api/auth';

interface Resource {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
}

interface Props {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
  onDeleteResource: () => void;
  showDelete?: boolean;
  showBookmark?: boolean;

}

const ResourceList: React.FC<Props> = ({ resources:initialResources, onResourceClick, onDeleteResource, showDelete,showBookmark }) => {
  // const isImageFile = (fileType: string) => {
  //   return fileType.startsWith('image/');
  // };
  const [resources, setResources] = useState<Resource[]>(initialResources);

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);
  
  const toggleBookMark = async (resource:any)=>{
    try {
      let obj ={
        studentId:resource?.studentId,
        courseId: resource?.courseId,
        url: resource?.filePath,
        resourceId: resource?.resourceId ? resource?.resourceId: resource?.id
      }
      const response:any = await toggleBookmark(obj);
      const updatedResources = resources.filter((r:any) => r.resourceId !== (resource.resourceId ? resource.resourceId: resource.id) );
      setResources(updatedResources);
      toast.success('Bookmark toggled successfully');
      return response;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast.error('Failed to add bookmark');
    }

  }
  
  return (
    <div className="mt-2">
      <h4 className="text-lg font-semibold mb-2">Resources</h4>
      {resources.length > 0 ? (
        <div className="md:grid md:grid-cols-4 lg:grid lg:grid-cols-4 grid grid-col-1 gap-16" >
          {resources.map((resource:any) => (
            
            <div
              key={resource.id}
              className=" p-3 flex rounded-lg border-2 border-bg-slate-300 flex-col bg-slate-200 dark:bg-slate-800 w-75  items-center"  
            >
            
              <ResourceDisplay 
                resource={resource}
              />
              <div className="flex mt-2 text-wrap ">
                <h5
                  onClick={() => onResourceClick(resource)}
                  className="cursor-pointer text-xs  text-blue-500 hover:underline"
                >
                  {resource?.url ? resource?.url?.split('/').pop().split('-').pop() : (resource?.fileName?.length > 25 ? resource?.fileName?.slice(0, 25) + '...' : resource?.fileName)} 
                </h5>

                {showBookmark && 
                 <div className="flex">
                 <button
                   className="px-2 transition-colors flex items-center"
                 >
                   <BookmarkedResource
                     key={resource.id}
                     resource={resource}
                     onToggleBookmark={toggleBookMark}
                   />
                 </button>
                 </div>
                }

                {showDelete && 
                <DeleteResourceConfirmation
                  resourceId={resource.id.toString()}
                  onDeleteSuccess={onDeleteResource}
                />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No resources found.</p>
      )}
    </div>
  );
};

export default ResourceList;
