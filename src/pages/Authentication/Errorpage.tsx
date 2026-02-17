import { Link } from "react-router-dom";
import error from "../../images/logo/error.svg";

export default function Errorpage() {
    return (
        <div className="flex items-center justify-evenly bg-[url('../../src/images/logo/background.png')] h-screen ">
      <div>
        <div>
          <div>
            <h2 className="mt-6  text-center text-3xl font-extrabold">
             Page Not Found
            </h2>
           
           
          </div>
          <hr className="my-4 border-gray-200" />
          <p className="mt-4 text-center text-sm text-gray-600">
            Go back 
            <Link
              to="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Home
            </Link>
          </p>
        </div>
      </div>

      <img className=" mt-8 w-5/12 " src={error} alt="error" />
    </div>
    );
}