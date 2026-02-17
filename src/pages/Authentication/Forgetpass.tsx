import { Link } from "react-router-dom";
import forgetpass from "../../images/logo/forgotpass.svg";
export default function Forgetpass() {
  return (
    <div className=" text-stone-800 flex items-center justify-evenly bg-[url('../../src/images/logo/background.png')] h-screen ">
      <div>
        <div>
          <div>
            <h2 className="mt-6  text-center text-3xl font-extrabold">
              Forget Password
            </h2>
            <p className="">
              Enter the email address you use to create the account, <br /> we
              will email you instruction to reset your password
            </p>
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
          <hr className="my-4 border-gray-200" />
          <p className="mt-4 text-center text-sm text-gray-600">
            Remember Password?
            <Link
              to="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <img className=" mt-8 w-5/12 " src={forgetpass} alt="login" />
    </div>
  );
}
