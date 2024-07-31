import BootstrapTick from "../../../../icons/BootstrapTick"
import BootstrapX from "../../../../icons/BootstrapX"
import ContentDisplayModal from "../../../../shared/ContentDisplayModal"


/**
 * A table row component that displays information about an exam question.
 * 
 * This component is used to render a row in a table displaying details about an exam question, including its title, content, and readiness status. Depending on the `ready` prop and `useModal` prop, it will either show the content directly or within a modal.
 * 
 * @component
 * @example
 * ```jsx
 * <TableRowExamQuestion
 *   contentTitle="Question 1"
 *   contentToDisplay="This is the content of the question."
 *   ready={true}
 *   useModal={false}
 * />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {string} props.contentTitle - The title of the content to display in the table.
 * @param {string} props.contentToDisplay - The content to be displayed in the table cell.
 * @param {boolean} props.ready - Indicates whether the content is ready or not. Determines if the content is displayed or if a placeholder text is shown.
 * @param {boolean} props.useModal - Determines if the content should be displayed in a modal or directly in the table cell.
 * 
 * @returns {React.Element} The rendered table row with content and status indicators.
 */
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