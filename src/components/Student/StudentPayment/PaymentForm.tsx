import React from 'react';

const PaymentForm: React.FC = () => {
  return (
    <div className="flex justify-center items-center text-black dark:text-white ">
      <div className="bg-[url('../../src/images/logo/background.png')] shadow-lg rounded-lg  border w-full  p-3">
      <div>

        <h2 className="text-xl font-bold mb-1">Make a Payment</h2>
        <p className='text-sm mb-3'>Enter your payment details to complete your transaction.</p>
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor="email" className="block   mb-2">
              Contact info
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              className="w-full border text-black  rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="name" className="block    mb-2">
              Shipping
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Name"
              className="w-full border  text-black rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>




          {/* <div>
            <label htmlFor="country" className="block    mb-2">
              Country or region
            </label>
            <select
              id="country"
              name="country"
              className="w-full border   rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="United States">United States</option>
             
            </select>
          </div> */}

          <div>
            <label htmlFor="address" className="block    mb-2">
              Address line 1
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="210 Townsend st."
              className="w-full border text-black  rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <h3 className="text-lg  mb-2">Payment</h3>
            <div className="flex space-x-4">
              <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-blue-500 focus:ring-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Card
              </button>
              <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-blue-500 focus:ring-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Google Pay
              </button>
              <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-blue-500 focus:ring-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Bank
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="cardNumber" className="block    mb-2">
              Card number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 1234 1234 1234"
              className="w-full border text-black  rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="expiry" className="block    mb-2">
                Expiry
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM / YY"
                className="w-full border text-black  rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cvc" className="block    mb-2">
                CVC
              </label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                placeholder="CVC"
                className="w-full border text-black  rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="billingCheckbox"
              name="billingCheckbox"
              className="h-4 w-4 text-blue-500 focus:ring-blue-500   rounded"
            />
            <label htmlFor="billingCheckbox" className="ml-2  ">
              Billing is same as shipping information
            </label>
          </div> */}

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-blue-500 focus:ring-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;