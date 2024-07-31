import React from 'react';
import axiosToBackend from '../../axiosToBackend'


import Button from 'react-bootstrap/Button';


/**
 * `DownloadButton` is a functional component that renders a button to download a file from a specified URL.
 * It conditionally enables or disables the button based on the `loadCondition` prop.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {boolean} props.loadCondition - Determines if the button is enabled or disabled. If `true`, the button is enabled; otherwise, it is disabled.
 * @param {string} props.downloadUrl - The URL to fetch the file for download.
 * @param {string} props.fileName - The name to use for the downloaded file.
 * @param {string} [props.height='auto'] - The height of the button. Default is 'auto'.
 * @param {string} [props.className=''] - Additional CSS class names to apply to the button. Default is an empty string.
 * @returns {JSX.Element} The `DownloadButton` component.
 *
 * @example
 * // Usage of the DownloadButton component
 * <DownloadButton
 *   loadCondition={true}
 *   downloadUrl="https://example.com/file.zip"
 *   fileName="file.zip"
 *   height="50px"
 *   className="custom-class"
 * />
 */
const DownloadButton = ({ loadCondition, downloadUrl, fileName, height, className }) => {
    async function handleDownloadClick() {
        try {
            console.log('Download URL:', downloadUrl);
            console.log('File Name:', fileName);

            const axiosDownloadOptions = {
                responseType: 'blob'
            };

            const getDownloadResponse = await axiosToBackend.get(downloadUrl, axiosDownloadOptions);
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
