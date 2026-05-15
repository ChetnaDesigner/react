function Condition({ isLoggedIn }) {

  return (
    <div>
      {isLoggedIn ? <h2 style={{ color: 'green' }}>Welcome back</h2> : <h2 style={{ color: 'red' }}>Please login</h2>}
    </div>
  );
}

export default Condition
