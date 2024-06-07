import Button from 'react-bootstrap/Button';



const MyButton = ({text, onClickFunction}) => {


    return(
        <Button className='text-white' onClick={onClickFunction}>{text}</Button>
    )


}


export default MyButton