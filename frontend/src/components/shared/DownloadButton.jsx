import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const DownloadButton = ({ loadCondition, downloadUrl, fileName, height, className }) => {
    async function handleDownloadClick() {
        try {
            console.log('Download URL:', downloadUrl);
            console.log('File Name:', fileName);

            const axiosDownloadOptions = {
                responseType: 'blob'
            };

            const getDownloadResponse = await axios.get(downloadUrl, axiosDownloadOptions);
            const url = window.URL.createObjectURL(new Blob([getDownloadResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    }

    console.log('Load Condition:', loadCondition);

    if (loadCondition) {
        return (
            <Button style={{ height: `${height}` }}
                className={`my-auto ${className}`}
                onClick={handleDownloadClick}
            >
                Download
            </Button>
        );
    } else {
        return (
            <Button disabled style={{ height: `${height}` }} className={`my-auto ${className}`}>
                Download
            </Button>
        );
    }
};

export default DownloadButton;
