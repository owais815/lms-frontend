

export const EmptyTemplate = (props:any) => {
    const {heading,description} = props
    return (
        <div className='p-6 text-center'>
        <h3 className="ch mb-4">{heading}</h3>
        <p className="text-gray-500 text-2xl">{description}</p>
      </div>
    )
}