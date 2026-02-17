import React,{useState,useEffect} from 'react';
import Loader from '../../../common/Loader';


const Game = () => {
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
       let timer = setTimeout(()=>{
            setLoading(false)
        },2000);

        ()=>{
            clearTimeout(timer);
        }
    },[]);
  return (
    <>
    {loading && 
    <div style={{alignItems:'center'}}>
    <Loader /> 
    </div>
}
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="https://deeppink-dolphin-502280.hostingersite.com/"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Embedded Site"
      ></iframe>
    </div>
   
    </>
  );
};

export default Game;
