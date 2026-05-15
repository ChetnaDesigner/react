import CardItem from '../components/card'

export default function CardPage() {
  return (
    <div className='container-fluid py-4'>
      <div className='row'>
        <div className='col-md-4'>
          <CardItem title="Card Title 1" text="Card Text" />
        </div>
        <div className='col-md-4'>
          <CardItem title="Card Title 2" text="Card Text" />
        </div>
        <div className='col-md-4'>
          <CardItem title="Card Title 3" text="Card Text" />
        </div>
      </div>
    </div>
  )
}
