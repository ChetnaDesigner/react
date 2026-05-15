import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{count}</h2>
      <button style={{ padding: '10px 20px' , backgroundColor: 'blue', color: 'white', borderRadius: '5px' }} onClick={() => setCount(count + 1)}>
        Counter Increment
        
      </button>
    
    </div>
  );
}

export default Counter