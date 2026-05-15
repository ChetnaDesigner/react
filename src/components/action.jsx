function Action() { 
    function handleClick() {
        alert('Button clicked')
    }
    return (
        <button onClick={handleClick}>
           click me
        </button>
    )
}