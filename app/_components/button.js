"use client";

function Button( {text, className, type = "button", onClick} ) {
    return (
        <>
            <button type={type} className={`btn_square text-center ${className}`} onClick={onClick}>
                {text}
            </button>
        </>
    );
}

export default Button;