export default function News() {
    const blogs = getBlogs()

    return (
        <div className="m-auto xl:container">
            <div className="py-6">
                <button className="btn btn-outline">Experience in choosing perfume</button>
                <button className="btn btn-outline ml-2">Perfume review</button>
            </div>
            <div>
                <div className="card card-compact bg-base-100 w-96 shadow-xl rounded-none h-[550px]">
                    <figure>
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                            alt="Shoes" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Shoes!</h2>
                        <p><p className='line-clamp-5'>toi xin tran trong gioi thieu san pham moi eoihqodljbasdklasjdbhasodbhnaefaoda daqoqwdibalosdjbn as doasndbalsd  nhat cua chung toi la 1 cuc cut ne la dung co mua gif het va cut me khoi day tao khong nhac lai nua dau day chi noi the thoi 1 la cut 2 la cut</p></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getBlogs() {
    const blogs = [
        {
            "image": "https://laluz.vn/wp-content/uploads/2024/09/chai-nuoc-hoa-hen-ho-cho-nam-khien-nang-say-dam.jpg",
            "title": "12+ Dating Perfumes for Men That Will \"Capture Her Heart\" in a Flash",
            "description": "In dating, scent plays an important role in creating an impression and attracting the other person. A suitable bottle of dating perfume for men will not only help you feel more confident but can also \"capture her heart\" from the first moment. In this article, […]"
        }
    ]

    return blogs;
}