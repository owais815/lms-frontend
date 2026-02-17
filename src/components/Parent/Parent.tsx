import { useEffect, useState } from "react"
import { getParentById } from "../../api/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export const Parent = () => {
  const userId = useSelector((state:any) => state.auth.userId);
  const [studentId,setStudentId] = useState<string>('');
  const navigate = useNavigate();

    const fetchParents = async () => {
        try {
          const response = await getParentById(userId);
          debugger;
          if (typeof response.data === 'object' && response.data !== null) {
            debugger;
            setStudentId(response.data.parent?.studentId);
            handleRowClick(response.data.parent?.studentId);
          } else {
            setStudentId('');
          }
        } catch (error) {
          console.error('Error fetching parents:', error);
          setStudentId('');
        }
      };
    
      useEffect(() => {
        fetchParents();
      }, []);

      const handleRowClick = (studentId:string) =>{
        navigate('/student/' + studentId );
      }

    return (
        <div>

        </div>
    )
}