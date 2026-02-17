import React from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import axios from '../../../api/axios';
import CrossIcon from '../../Icons/CrossIcon';


interface Resource {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  url?: string;
}

interface Props {
  resource: Resource;
  onClose: () => void;
}

const ResourceModal: React.FC<Props> = ({ resource, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-4 md:ml-40 lg:ml-40 ml-0 mt-20 rounded shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <CrossIcon />
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          <DocViewer
            documents={[
              {
                uri: `${axios.defaults.baseURL}${resource?.url ? resource?.url : resource?.filePath}`,
              },
            ]}
            pluginRenderers={DocViewerRenderers}
            style={{ width: '100%', height: '100%' }}
            config={{
              header: {
                disableHeader: true,
                disableFileName: true,
                retainURLParams: false
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;