import React, { useEffect, useState } from 'react'
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { dulieu } from '../../../data/connectdata';

export const ProductItem = ({ tim = [], onSelect }) => {

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };


    return (
        <>
            {tim.length === 0 ? (
                <p>Không tìm thấy món cần tìm</p>
            ) : (
                tim.map(item => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow text-left"
                    >
                        <div className="cursor-pointer select-none w-full h-40 mb-3 overflow-hidden rounded-md bg-gray-200">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="cursor-pointer select-none font-semibold text-gray-800 mb-1">
                            {item.name}
                        </h3>
                        <p className="cursor-pointer select-none text-blue-600 font-bold">
                            {formatPrice(item.price)}
                        </p>
                    </div>
                ))
            )}
            {/* {props.tim.length === 0 ? ( //nếu không tìm thấy sản phẩm nào
                <p>Không tìm thấy món cần tìm</p>
            ) : ( //nếu tìm thấy sản phẩm
                props.tim.map((item) => (
                    < div key={item.id} className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow text-left" >
                        <div className="w-full h-40 mb-3 overflow-hidden rounded-md bg-gray-200">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className='font-semibold text-gray-800 mb-1'>{item.name}</h3>
                        <p className='text-green-600 font-bold'>{item.price}</p>
                    </div >
                ))
            )
            } */}
        </>


    )
}
