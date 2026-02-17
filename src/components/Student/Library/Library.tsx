import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getResourcesByStudent } from "../../../api/auth";
import { toast } from "react-toastify";
import ResourceList from "../../Admin/ResourceUpload/ResourceList";
import ResourceModal from "../../Admin/ResourceUpload/ResourceModal";
import { EmptyTemplate } from "../../Generic/EmptyTemplate";



export const Library = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const [resources,setResources] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalResource, setModalResource] = useState<any | null>(null);

  useEffect(()=>{
    fetchLibrary();
  },[]);
  const fetchLibrary = async () => {
    try {
        const response = await getResourcesByStudent(userId);
        if (response.data && Array.isArray(response.data)) {
          console.log("library:::",response.data);
          setResources(response.data);
        } else {
          setResources([]);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to fetch resources');
        setResources([]);
      }
  }
    return (
        <>
      {resources.length > 0 ? (
        <ResourceList
          resources={resources}
          onResourceClick={(resource) => {
            setModalResource(resource);
            setShowModal(true);
          }}
          onDeleteResource={() => {}}
          showBookmark={true}
        />
      ) : (
        <div className='globalCardStyle p-6 mt-6 containerr '>
        <EmptyTemplate
          heading={"Library is empty"}
          description={"We will be adding some resources soon"}
        />
        </div>
      )}

      {showModal && modalResource && (
        <ResourceModal
          resource={modalResource}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
    )
}