import React, { useState } from "react";
import { ContactIcon } from "../../Icons/ContactIcon";

const FaqComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      question: "How do I log in to the LMS?",
      answer: "To log in to the LMS, visit the LMS website and enter your username and password. If you're having trouble, contact the support helpdesk.",
    },
    {
      question: "What should I do if I forget my password?",
      answer: "If you forget your password, go to the LMS login page and click on the 'Forgot Password' link. Follow the instructions to reset your password. If you continue to experience issues, reach out to the IT support team.",
    },
    {
      question: "How can I update my personal information?",
      answer: "To update your personal information, log in to the LMS and go to the 'Profile' section. From there, you can edit your details such as contact information and address. Make sure to save any changes.",
    },
    {
      question: "Where can I find my course materials?",
      answer: "Course materials can be found in the 'Courses' section of the LMS. Select the relevant course, and relevant 'Resources' or 'Documents' will appear below.",
    },
    {
      question: "How do I submit an assignment?",
      answer: "To submit an assignment, go to the specific course in the LMS, find the 'Assignments' section, and select the relevant assignment. Follow the prompts to upload your file and submit it before the deadline.",
    },
    {
      question: "Can I see my grades on the LMS?",
      answer: "Yes, you can view your grades on the LMS. Navigate to the 'My Quiz' section under the relevant course to see your grades for quizzes and exams.",
    },
    {
      question: "How do I give feedback regarding a teacher?",
      answer: "To submit feedback for your teacher, go to the 'Feedback' section, select the teacher you want to give feedback on, and then write and submit your message.",
    },
    {
      question: "What should I do if I encounter a technical issue?",
      answer: "If you encounter a technical issue, first try clearing your browser cache or using a different browser. If the problem persists, contact the LMS support team.",
    },
    {
      question: "How do I register for a new course?",
      answer: "To register for a new course, contact the Admin Help Desk.",
    },
  ];

  return (
    <div className="relative mx-auto p-5 mt-6 containerr">
      <h1 className="text-2xl font-bold dark:text-white text-black border-b-2 border-blue-500 pb-2 mb-4">
        LMS FAQ'S for Students
      </h1>

      <div className="mb-6">
        <input
          type="text"
          id="search-input"
          className="dark:bg-black w-full p-2 text-sm border text-black outline-blue-500 rounded"
          placeholder="Search FAQ..."
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>

      <div className="bg-white dark:bg-black rounded-lg shadow-md">
        {faqData
          .filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchTerm) ||
              faq.answer.toLowerCase().includes(searchTerm)
          )
          .map((faq, index) => (
            <details
              key={index}
              className="border-b border-gray-200 p-4 cursor-pointer"
            >
              <summary className="font-semibold text-blue-600 flex justify-between items-center">
                {faq.question}
                <span className="text-gray-500 text-xl">...</span>
              </summary>
              <p className="mt-2 text-black">{faq.answer}</p>
            </details>
          ))}
      </div>

      {/* YouTube Video Embed */}
      <div className="mt-6">
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/uJHle6oWAjg"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* WhatsApp Floating Icon */}
      <a
        href="https://wa.me/1234567890"
        className="group fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300 ease-in-out animate-bounce"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
      >
        <ContactIcon />
        <span className="group-hover:opacity-100 opacity-0 whitespace-nowrap overflow-hidden text-ellipsis bg-black text-white text-xs rounded p-2 absolute bottom-full right-10 transition-opacity duration-300">
          Contact with our support team
        </span>
      </a>
    </div>
  );
};

export default FaqComponent;
