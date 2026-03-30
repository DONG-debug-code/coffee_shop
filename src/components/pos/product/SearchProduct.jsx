import React from 'react'


export const SearchProduct = (props) => {

    return (
        <div className='border border-gray-300 rounded-lg select-none'>
            <input onChange={(e) => props.setKeyword(e.target.value)} className='w-full pl-5 pr-4 py-2  focus-visible:outline-none focus:ring-2 focus:rounded-lg focus:ring-blue-500'
                type='text' placeholder='Tìm kiếm sản phẩm' ></input>
        </div>
    )
}
