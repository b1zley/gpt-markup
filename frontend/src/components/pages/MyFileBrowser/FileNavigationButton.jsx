
import Button from 'react-bootstrap/Button'

const FileNavigationButton = ({ onClickFunction, file }) => {



    const styleObject = {
        borderRadius: '5px',
        width: '120px',
        height: '120px',
        wordBreak: 'break-all'


    }

    const classNames = 'm-1'

    return (
        <Button className={classNames} variant="light" style={styleObject}  onClick={() => onClickFunction(file)}>
            {file.name}
        </Button>
    )


}

export default FileNavigationButton