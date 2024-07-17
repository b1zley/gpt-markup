



const FileTypesDisplay = ({fileTypes}) => {

    const allowedFileTypes = fileTypes.map((fileTypeObject) =>
        fileTypeObject.allowed ? fileTypeObject.file_type_extension : null
    ).filter((fileType) => fileType !== null)
    return (
        <>
            {allowedFileTypes.map((fileType, i)=>
                <>
                {fileType}{i < allowedFileTypes.length-1 ? <>,&nbsp;</> : null }
                </>
            )}
        </>
    )

}


export default FileTypesDisplay