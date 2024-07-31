import { Fragment } from "react"



/**
 * A component that displays a list of allowed file types.
 * 
 * This component takes a list of file types, filters out those that are not allowed, and displays the remaining file types as a comma-separated list.
 * 
 * @component
 * @example
 * ```jsx
 * <FileTypesDisplay
 *   fileTypes={[
 *     { file_type_extension: 'css', allowed: true },
 *     { file_type_extension: 'html', allowed: false },
 *     { file_type_extension: 'java', allowed: true }
 *   ]}
 * />
 * ```
 * 
 * @param {Object[]} props.fileTypes - An array of file type objects.
 * @param {string} props.fileTypes[].file_type_extension - The file type extension.
 * @param {boolean} props.fileTypes[].allowed - A boolean indicating if the file type is allowed.
 * 
 * @returns {React.Element} The rendered list of allowed file types.
 */
const FileTypesDisplay = ({fileTypes}) => {

    const allowedFileTypes = fileTypes.map((fileTypeObject) =>
        fileTypeObject.allowed ? fileTypeObject.file_type_extension : null
    ).filter((fileType) => fileType !== null)
    return (
        <>
            {allowedFileTypes.map((fileType, i)=>
                <Fragment key={i}>
                {fileType}{i < allowedFileTypes.length-1 ? <>,&nbsp;</> : null }
                </Fragment>
            )}
        </>
    )

}


export default FileTypesDisplay