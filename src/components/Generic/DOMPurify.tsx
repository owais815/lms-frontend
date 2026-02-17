import DOMPurify from 'dompurify'

const DOMPurifyBlog = ({ content }:any) => {
  const cleanHtml = DOMPurify.sanitize(content);

  return (
    <div
        className='dark:text-white'
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default DOMPurifyBlog;
