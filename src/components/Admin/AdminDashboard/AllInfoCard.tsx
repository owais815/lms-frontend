

export const AllInfoCard = (props:any) => {
    return (
        <div  className={`rounded-lg shadow-sm globalCardStyle text-white p-4 flex flex-col justify-between transition-all duration-100 hover:opacity-100 opacity-80`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="ch">{props?.title}</h3>
          <div className="w-6 h-6 text-zinc-500">{typeof props?.icon === 'string' ? props?.icon : props?.icon}</div>
        </div>
        <div className="text-center text-zinc-500">
          <div className="standout mb-1">{props?.value}</div>
          <p className="text-xs">{props?.description}</p>
        </div>
      </div>
    );
};