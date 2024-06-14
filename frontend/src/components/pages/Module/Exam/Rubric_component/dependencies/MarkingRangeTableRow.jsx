import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { useState } from 'react'
import BASE_API_URL from '../../../../../../BASE_API_URL'

import axios from 'axios'
import DoubleClickModifyCell from './DoubleClickModifyCell'

const MarkingRangeTableRow = ({rubricComponent, setRubricComponent, index }) => {

    


    return (
        <tr >
            <DoubleClickModifyCell
                parameterInCell={'rating_desc'}
                rubricComponent={rubricComponent}
                setRubricComponent={setRubricComponent}
                index={index}
            />
            <DoubleClickModifyCell
                parameterInCell={'rating_min_incl'}
                rubricComponent={rubricComponent}
                setRubricComponent={setRubricComponent}
                index={index}
            />
            <DoubleClickModifyCell
                parameterInCell={'rating_max_incl'}
                rubricComponent={rubricComponent}
                setRubricComponent={setRubricComponent}
                index={index}
            />
        </tr>
    )




}



export default MarkingRangeTableRow