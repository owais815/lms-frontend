import React, { useState, useEffect } from 'react';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { isBookmark } from '../../../api/auth';

const BookmarkedResource = ({ resource, onToggleBookmark }:any) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkBookmarkStatus = async () => {
    try {
      setIsLoading(true);
      const response:any = await isBookmark(resource.studentId, resource?.resourceId ? resource?.resourceId: resource.id);

      setIsBookmarked(response?.data?.isBookmarked);
    } catch (error) {
      console.error('Error fetching bookmark status:', error);
      toast.error('Failed to fetch bookmark status');
      setIsBookmarked(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(resource){
        checkBookmarkStatus();
    }
  }, [resource]);

  const handleToggleBookmark = async () => {
    try {
      setIsLoading(true);
      const response = await onToggleBookmark(resource);
      setIsBookmarked(response?.data?.bookmark?.isBookmarked);
      toast.success(response?.data?.message);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <span>Loading...</span>; // Or any loading indicator
  }

  return (
    <button onClick={handleToggleBookmark} disabled={isLoading}>
      {isBookmarked ? (
        <IoBookmark size={22} className="mr-1" />
      ) : (
        <IoBookmarkOutline size={22} className="mr-1" />
      )}
    </button>
  );
};

export default BookmarkedResource;