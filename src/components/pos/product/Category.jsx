import React, { useEffect, useState } from 'react'
import { dulieu } from '../../../data/connectdata';
import { collection, getDocs } from 'firebase/firestore';

export const Category = ({onSelectCategory}) => {

    const [category, setCategory] = useState([]);
    const [active, setActive] = useState(null);
    

    //đọc api
    useEffect(() => {
        const fetchCategories = async () => {
            const colRef = collection(dulieu, "categories");
            const snapshot = await getDocs(colRef);

            const data = snapshot.docs.map(doc => {
                const docData = doc.data();
                return {
                    id: doc.id,
                    ...docData
                };
            });
            // console.log(data);
            setCategory(data);
        };
        fetchCategories();
    }, [dulieu]);

    return (
        <>
            <div className="flex flex-wrap gap-2 select-none">
                {/* {category.map((item) => (
                    <button key={item.id} className="px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:bg-blue-600 transition">
                        {item.name}
                    </button>
                ))} */}
                <button
                    onClick={() => {
                        setActive(null);
                        onSelectCategory(null);
                    }}
                    className={`px-4 py-2 rounded-sm ${active === null ? 'bg-blue-600 text-white' : 'bg-gray-300'
                        }`}
                >
                    Tất cả
                </button>

                {category.map(item => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActive(item.categoryId);
                            onSelectCategory(item.categoryId);
                        }}
                        className={`px-4 py-2 rounded-sm transition
                        ${active === item.categoryId
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-300 hover:bg-blue-500'
                            }`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </>
    )
}
