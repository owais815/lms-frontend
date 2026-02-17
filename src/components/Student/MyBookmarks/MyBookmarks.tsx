import { useSelector } from 'react-redux';
import { getBookmark } from '../../../api/auth';
import ResourceList from '../../Admin/ResourceUpload/ResourceList';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ResourceModal from '../../Admin/ResourceUpload/ResourceModal';
import { EmptyTemplate } from '../../Generic/EmptyTemplate';

export const MyBookmarks = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalResource, setModalResource] = useState<any | null>(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);
  const fetchBookmarks = async () => {
    try {
      const response = await getBookmark(userId);
      if (response.data) {
        setResources(response.data);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to fetch resources');
      setResources([]);
    }
  };

  return (
    <div className='mt-6 containerr'>
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
        <div className='globalCardStyle p-6 '>
        <EmptyTemplate
          heading='No Bookmarks'
          description={"You have'nt added any bookmarks yet."}
        />
        </div>
      )}

      {showModal && modalResource && (
        <ResourceModal
          resource={modalResource}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
