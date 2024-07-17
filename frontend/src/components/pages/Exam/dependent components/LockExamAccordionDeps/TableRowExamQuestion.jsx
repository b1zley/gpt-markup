import BootstrapTick from "../../../../icons/BootstrapTick"
import BootstrapX from "../../../../icons/BootstrapX"
import ContentDisplayModal from "../../../../shared/ContentDisplayModal"



const TableRowExamQuestion = ({ contentTitle, contentToDisplay, ready, useModal }) => {


    return (
        <tr>
            <td>
                {contentTitle}
            </td>
            <td>
                {ready ?
                    useModal ?
                        <ContentDisplayModal
                            contentTitle={contentTitle}
                            contentToDisplay={contentToDisplay}
                            size={'lg'}
                        />
                        :
                        <>{contentToDisplay}</>
                    : 'Not set yet...'}


            </td>
            <td>
                {ready ? <BootstrapTick size={'30'} /> : <BootstrapX size={'30'} />}

            </td>
        </tr>
    )


}


export default TableRowExamQuestion