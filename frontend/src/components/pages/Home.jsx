import { Fragment } from 'react';
import Container from 'react-bootstrap/Container'


import loremIpsumMarketingImage from '../../assets/img/marketingloremipsum.png'
import ImageContentPair from '../home/ImageContentPair';

function Home() {

  let imageContentPairs = []

  for (let i = 0; i < 3; i++) {
    imageContentPairs.push({
      imageSource: loremIpsumMarketingImage,
      textTitle: 'Lorem Ipsum',
      textBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at blandit nunc, eget mollis lacus. Proin bibendum efficitur lorem at auctor. Nunc fringilla ipsum a magna euismod placerat. Duis et eros semper, gravida lorem in, scelerisque massa. Donec purus elit, volutpat nec hendrerit sit amet, malesuada ut turpis. Fusce dignissim ante sit amet purus vestibulum porttitor.'

    })
  }


  return (
    <>
      <Container className=''>
        <div>
          <h1 className='my-3'>
            Welcome to MarkUp-GPT
          </h1>
        </div>
        {imageContentPairs.map((pair, i) =>
          <Fragment key={i}>
            <hr className='divider'></hr>
            <ImageContentPair  imageSource={pair.imageSource} textTitle={pair.textTitle} textBody={pair.textBody} imageLeft={i % 2 === 0} />
            {i === imageContentPairs.length-1 ? <hr className='divider'/> : null}
          </Fragment>

        )}

      </Container>

    </>


  )


}

export default Home;