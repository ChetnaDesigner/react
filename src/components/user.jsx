// Task 1: Simple Props

function User({ name, city, age }) {
  return (
    <div>
      <h1>{name}</h1>
      <p>{city}</p>
      <p>{age}</p>
    </div>
  )
}

export default User