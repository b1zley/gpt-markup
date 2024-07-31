import { useState, useEffect } from 'react';
import axiosToBackend from '../../../axiosToBackend';
import BASE_API_URL from '../../../BASE_API_URL';


// code block highlighting
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';


/**
 * `FileViewerComponent` is a component that fetches and displays the content of a file.
 * 
 * It uses syntax highlighting to display the content of the file in a user-friendly manner.
 * 
 * @component
 * @param {string} fileToViewUrl - The URL of the file to be fetched and displayed.
 * @example
 * const fileToViewUrl = 'path/to/file';
 * return <FileViewerComponent fileToViewUrl={fileToViewUrl} />;
 */
const FileViewerComponent = ({ fileToViewUrl }) => {
    const [fileUrl, setFileUrl] = useState('');
    const [error, setError] = useState(null);


    const [fileContent, setFileContent] = useState('')



    useEffect(() => {

        const fetchAndDisplayFile = async () => {
            try {
                // Fetch the file from the server
                const response = await axiosToBackend.get(`${BASE_API_URL}files/${fileToViewUrl}`);
                console.log(response)

                const content = response.data

                setFileContent(content)

            } catch (error) {
                console.error('Error fetching file:', error);
                setError('Error fetching file. Please try again later.');
            }
        };

        fetchAndDisplayFile()

    }, [fileToViewUrl])



    if (!fileToViewUrl) {
        return (
            <>
                No file specified.
            </>
        )
    }

    function userFriendlyFileNamer(fileToViewUrl) {
        let splitUrl = fileToViewUrl.split('x--x')
        return splitUrl[splitUrl.length - 1]
    }

    return (
        <div className='d-flex flex-column' style={{ height: '500px' }}>
            {error && <div>{error}</div>}

            <h6>File Name: {userFriendlyFileNamer(fileToViewUrl)}</h6>
            <div className={'overflow-auto '} >
                
                <SyntaxHighlighter wrapLongLines={true} className='' language="java" >

                    {fileContent}
                </SyntaxHighlighter>
            </div>

        </div>
    );
};

export default FileViewerComponent;
