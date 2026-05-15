import Button from './button'
import Counter from './counter'
function Card({ title, text }) {
    return (
          <div className='card shadow-sm bg-white p-4'>
              <h5 className='card-title text-primary'>{title}</h5>
          <div className='card-body p-2'>
          
                <p className='card-text text-secondary'>{text}</p>
            <Counter />   
            </div>
         <Button onClick={() => alert('Button clicked')}>Read More</Button>
        </div>
    )
}

export default Card