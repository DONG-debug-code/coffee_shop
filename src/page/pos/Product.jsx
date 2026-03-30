import React, { useEffect, useState } from 'react'
import { SearchProduct } from '../../components/pos/product/SearchProduct'
import { ProductItem } from '../../components/pos/product/ProductItem'
import { Category } from '../../components/pos/product/Category'
import { useRealtimeCollection } from '../../data/useCollection'


export const Product = () => {

    //state sản phẩm
    const { data: products, loading } = useRealtimeCollection("products");
    //state từ khóa tìm kiếm
    const [keyword, setKeyword] = useState("");
    //state danh mục được chọn
    const [selectedCategory, setSelectedCategory] = useState(null);


    const filteredProduct = products?.filter(item => { //kiểm tra từng sản phẩm
        const matchKeyword = item.name
            ?.toLowerCase()
            .includes(keyword.toLowerCase()); //kiểm tra từ khóa tìm kiếm

        const matchCategory = selectedCategory === null //nếu không chọn danh mục nào
            ? true //hiển thị tất cả sản phẩm
            : item.categoryId === selectedCategory; //kiểm tra sản phẩm có thuộc danh mục được chọn hay không

        return matchKeyword && matchCategory; //trả về sản phẩm thỏa mãn cả 2 điều kiện trên 
    });


    if(loading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <div className="sticky top-0 z-10 p-4 bg-white shadow-sm">
                <SearchProduct setKeyword={setKeyword} />
            </div>
            <div className="p-4 bg-white shadow-sm">
                <Category onSelectCategory={setSelectedCategory} />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <ProductItem tim={filteredProduct} />
                </div>
            </div>
        </div>
    )
}
