function Button({ children, onClick }) {
    return (
        <button type="button" onClick={onClick} className='btn btn-primary mt-2'>
            {children}
        </button>
    )
}

export default Button