// FileBrowser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosToBackend from '../../../axiosToBackend';
import BASE_API_URL from '../../../BASE_API_URL';
import FileViewerComponent from './FileViewerComponent';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap'
import useConfirmation from '../../hooks/useConfirmation';


/**
 * `MyFileBrowser` is a component that allows users to browse and view files and directories.
 * 
 * It displays a list of files and directories in the current path, allows navigation through directories, and shows a file viewer for selected files.
 * 
 * @component
 * @param {string} basePath - The initial base path for the file browser.
 * @example
 * const basePath = 'projectFolder';
 * return <MyFileBrowser basePath={basePath} />;
 */
const MyFileBrowser = ({ basePath }) => {
    const [files, setFiles] = useState([]);
    const [currentPath, setCurrentPath] = useState(basePath);
    const DELIM = 'x--x'

    const [fileToViewUrl, setFileToViewUrl] = useState('')


    useEffect(() => {
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
        let newName = 'projectFolder/'

        for (let i = 3; i < splitReplacedPath.length; i++) {
            newName += splitReplacedPath[i]
            newName += '/'
        }

        return newName
    }

    return (

        <div className='my-2 border rounded ' style={{ minHeight: "200px" }} >
            <Container className='my-2'>
                <h3>{userFriendlyPath(currentPath)}</h3>
                <hr className='divider'/>

                <Container className=''>
                    <Row>
                        <Col xs={4} className='px-1 border-end'>
                            <Button variant="light" onClick={navigateUp} disabled={currentPath === basePath}>Up</Button>
                            <div className='overflow-auto mt-0 pt-1  px-0 d-flex flex-column' >
                                {files.map((file, index) => (
                                    <Button variant="light" style={{ borderRadius: 0 }} key={index} onClick={() => handleFileDirClick(file)}>
                                        {file.name}
                                    </Button>
                                ))}
                            </div>
                        </Col>
                        <Col xs={8} className='px-1 mt-2'>
                            {fileToViewUrl ? <FileViewerComponent
                                fileToViewUrl={fileToViewUrl}
                            /> : <div className='' style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Please specify a file to view</div>}

                        </Col>
                    </Row>
                </Container>



            </Container>
        </div>
    );
};

export default MyFileBrowser