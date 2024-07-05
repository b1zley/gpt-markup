// FileBrowser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosToBackend from '../../../axiosToBackend';
import BASE_API_URL from '../../../BASE_API_URL';
import FileViewerComponent from './FileViewerComponent';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

const MyFileBrowser = ({ basePath }) => {
    const [files, setFiles] = useState([]);
    const [currentPath, setCurrentPath] = useState(basePath);
    const DELIM = 'x--x'

    const [fileToViewUrl, setFileToViewUrl] = useState('')

    useEffect(()=>{
        setCurrentPath(basePath)
        setFileToViewUrl('')

    }, [basePath])

    useEffect(() => {
        console.log('effect')

        const fetchFiles = async () => {
            try {
                // console.log('basePath', basePath)
                // console.log(`${BASE_API_URL}files/'${currentPath}'`)
                const response = await axiosToBackend.get(`${BASE_API_URL}files/${currentPath}`);
                setFiles(response.data);
            } catch (error) {
    
                console.error('Error fetching files', error);
            }
        };

        fetchFiles();
    }, [currentPath, basePath]);

    

    const navigateToFolder = (folderName) => {
        setCurrentPath(`${currentPath}${DELIM}${folderName}`);
    };

    const navigateUp = () => {
        const newPath = currentPath.split(DELIM).slice(0, -1).join(DELIM);
        setFileToViewUrl('')
        setCurrentPath(newPath);
    };

    async function handleFileDirClick(file) {
        if (file.isDirectory) {
            setFileToViewUrl('')
            navigateToFolder(file.name)

        } else {
            console.log('this is a file...')
            let pathOfFileToView = `${currentPath}${DELIM}${file.name}`


            setFileToViewUrl(pathOfFileToView)
        }
    }

    function userFriendlyPath(path) {
        
        const splitReplacedPath = path.split('x--x')
        let newName = '../'

        for (let i = 3 ; i < splitReplacedPath.length ; i++){
            newName += splitReplacedPath[i]
            newName += '/'
        }

        return newName
    }

    return (

        <div className='my-2 border rounded 'style={{minHeight:"200px"}} >
            <Container>
                <div className='my-2'>
                    <h4>{userFriendlyPath(currentPath)}</h4>
                    <Button onClick={navigateUp} disabled={currentPath === basePath}>Up</Button>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index} onClick={() => handleFileDirClick(file)}>
                                {file.name}
                            </li>
                        ))}
                    </ul>
                    <div>
                        {fileToViewUrl ? <FileViewerComponent
                            fileToViewUrl={fileToViewUrl}
                        /> : null}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default MyFileBrowser