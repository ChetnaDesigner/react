import { useState } from 'react'
import Card from '../components/curd/card'

const initialContacts = [
  {
    id: '1',
    name: 'Arjun Sharma',
    phone: '+919876543210',
    email: 'arjun@example.com',
    image: 'https://picsum.photos/seed/c1/400/200',
  },
  {
    id: '2',
    name: 'Priya Mehta',
    phone: '+919876543211',
    email: 'priya@example.com',
    image: 'https://picsum.photos/seed/c2/400/200',
  },
  {
    id: '3',
    name: 'Ravi Kumar',
    phone: '+919876543212',
    email: 'ravi@example.com',
    image: 'https://picsum.photos/seed/c3/400/200',
  },
]

function CURD() {
  const [contacts, setContacts] = useState(initialContacts)

  function handleDelete(id) {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {contacts.map((c) => (
          <div key={c.id} className="col-md-4">
            <Card {...c} onDelete={handleDelete} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CURD
