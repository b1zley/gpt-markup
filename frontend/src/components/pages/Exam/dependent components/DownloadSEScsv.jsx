import { Button } from "react-bootstrap"
import axiosToBackend from "../../../../axiosToBackend"
import BASE_API_URL from "../../../../BASE_API_URL"




const DownloadSEScsv = ({ examInformation }) => {


    console.log('hello from download button')
    // console.log(examInformation)


    async function handleCSVDownload() {

        const { module_id, exam_id } = examInformation
        const apiUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/results_csv`
        const getOptions = { responseType: 'blob' }
        const response = await axiosToBackend.get(apiUrl, getOptions)

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `student_exam_submission_results_${exam_id}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)

        // console.log(response)
        console.log(response)

    }


    return (
        <div className="my-2">
            <Button onClick={handleCSVDownload}>
                Download student results
            </Button>
        </div>
    )


}


export default DownloadSEScsv