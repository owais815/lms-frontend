import React from 'react'

export const PaymentComponent = () => {
  return (
    <div className="flex flex-col bg-[url('../../src/images/logo/background.png')] dark:bg-transparent shadow-md rounded p-8">
      <div className="font-bold  text-graydark dark:text-slate-50 text-lg mb-4">Payment History</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-600">
            <tr>
              <th className="py-2 text-graydark dark:text-slate-50 px-4">Date</th>
              <th className="py-2  text-graydark dark:text-slate-50  px-4">Amount</th>
              <th className="py-2 text-graydark dark:text-slate-50  px-4">Status</th>
            </tr>
          </thead>
          <tbody >
            <tr className="border-b border-gray-200">
              <td className="py-2 text-graydark dark:text-slate-50  px-4">01/01/2022</td>
              <td className="py-2  text-graydark dark:text-slate-50 px-4">$100</td>
              <td className="py-2    px-4 bg-green-50 dark:bg-transparent text-green-500">Success</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-graydark dark:text-slate-50  px-4">02/01/2022</td>
              <td className="py-2  text-graydark dark:text-slate-50 px-4">$50</td>
              <td className="py-2 px-4 bg-red-50 dark:bg-transparent text-red-500">Failed</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-graydark dark:text-slate-50  px-4">03/01/2022</td>
              <td className="py-2  text-graydark dark:text-slate-50 px-4">$75</td>
              <td className="py-2 px-4 bg-yellow-50 dark:bg-transparent text-yellow-500">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

