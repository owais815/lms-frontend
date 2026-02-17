import { DeleteIcon } from "../Icons/DeleteIcon"
import { EditIcon } from "../Icons/EditIcon"
import { formatDate } from "./FormatDate";


const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((value, key) => (value && value[key] !== undefined ? value[key] : "N/A"), obj);
  };
  
 

  export const TableComponent = (props: any) => {
    const { headings, tableData, dataKeys } = props;
  
    return (
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headings.map((heading: any) => (
                <th key={heading} scope="col" className="px-6 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((data: any, index: number) => (
                <tr
                  key={index}
                  className="bg-url border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {dataKeys.map((key: string, idx: number) => (
                    <>
                  <td key={idx} className="px-6 py-4">
                    {/* Handle concatenation for TeacherName or StudentName */}
                    {key.endsWith("Name") && (key.startsWith("Teacher") || key.startsWith("Student"))
                      ? `${getNestedValue(data, `${key.split('.')[0]}.firstName`)} ${getNestedValue(
                          data,
                          `${key.split('.')[0]}.lastName`
                        )}`
                      : key.includes("Date") ||( key.includes("startingFrom") && getNestedValue(data, key)) 
                      ? formatDate(getNestedValue(data, key)) // Check if the key contains "Date" to apply formatting
                      : getNestedValue(data, key) || "N/A"}
                  </td>
                  
                </>
                ))}
                 <td className="px-6 py-4">
                  <button onClick={() => {props.editModal(data.id)}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2">
                    <EditIcon />
                  </button>
                  <button onClick={() => {props.openDeleteDialog(data.id)}} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                    <DeleteIcon />
                  </button>
                </td> 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headings.length} className="px-6 py-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

