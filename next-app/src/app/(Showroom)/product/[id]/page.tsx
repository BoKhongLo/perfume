import ImageGallery from '@/components/Gallery'
import TopPerfumeCarousel from '@/components/Carousel/TopPerfumeCarousel'
import { Perfume, ProductType } from '@/types';
import { GetProductForSearch, GetProductById } from '@/lib/api';
import { SearchProductDto } from '@/lib/dtos/product'

export default async function Page({
    params
}: {
    params: { id: number }
}) {

    const product: ProductType = await GetProductById(params.id)

    const brandFilter: SearchProductDto = {
        index: 1,
        count: 10,
        brand: [{ type: "brand", value: product?.details?.brand && product.details.brand?.value }]
    }

    const linkedPerfume = (await GetProductForSearch(brandFilter)).data

    const imageUrls: string[] = product?.details?.imgDisplay
        ? product.details.imgDisplay
            .map(img => img.url)
            .filter((url): url is string => url !== undefined)
        : [];
    const formatVND = (amount : number) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '0 ₫';
    }

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
    };
    return (
        <div className="bg-[#0a0a0a] text-zinc-300 min-h-screen font-sans selection:bg-amber-500/30">
            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Left: Image Gallery (Sticky) */}
                    <div className="lg:col-span-6">
                        <div className="sticky top-28 group">
                            <div className="absolute -inset-1 bg-gradient-to-b from-amber-900/20 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative bg-neutral-900 rounded-xl overflow-hidden p-4">
                                <ImageGallery images={imageUrls || []} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-6 flex flex-col justify-center space-y-10">
                        <header className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-amber-500 font-bold tracking-[0.3em] text-xs uppercase">
                                    {product?.details?.brand?.value}
                                </span>
                                <div className="h-[1px] w-12 bg-amber-500/30"></div>
                                <span className="text-zinc-500 text-xs uppercase tracking-widest">
                                    {product?.details?.sex?.value}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif text-white font-light leading-tight">
                                {product?.name}
                            </h1>
                            <div className="flex items-baseline gap-4 pt-2">
                                <span className="text-3xl font-light text-amber-400">
                                    {formatVND(product?.displayCost)}
                                </span>
                                <span className="text-zinc-500 text-sm line-through opacity-50 font-light">
                                    {/* Ví dụ giá cũ nếu có */}
                                    2.500.000đ
                                </span>
                            </div>
                        </header>

                        {/* Quick Specs Grid */}
                        <div className="grid grid-cols-3 gap-4 border-y border-zinc-800/50 py-6">
                            <div className="text-center">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mb-1">Dung tích</p>
                                <p className="text-sm font-medium text-zinc-200">{product?.details?.size?.[0].value}</p>
                            </div>
                            <div className="text-center border-x border-zinc-800/50">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mb-1">Lưu hương</p>
                                <p className="text-sm font-medium text-zinc-200">{product?.details?.sillage?.value}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mb-1">Tình trạng</p>
                                <p className="text-sm font-medium text-emerald-500">Còn hàng</p>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest mb-4">Lựa chọn kích thước</h3>
                                <div className="flex gap-3">
                                    <button className="h-12 px-8 bg-white text-black font-bold text-xs uppercase hover:bg-amber-400 transition-colors">
                                        Fullsize
                                    </button>
                                    <button className="h-12 px-8 border border-zinc-700 text-zinc-300 font-bold text-xs uppercase hover:bg-zinc-800 transition-all">
                                        Chiết 10ml
                                    </button>
                                </div>
                            </div>
                            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white h-14 font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-amber-900/20">
                                GỌI ĐIỆN ĐẶT HÀNG
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            Hotline tư vấn chuyên gia: <strong className="text-zinc-300">0325986545</strong>
                        </div>
                    </div>
                </div>

                {/* Info Tabs */}
                <div className="mt-32 border-t border-zinc-800/50">
                    <div className="max-w-4xl mx-auto">
                        <div role="tablist" className="tabs tabs-bordered grid-cols-2">
                            <input type="radio" name="product_tabs" role="tab" className="tab h-20 text-zinc-500 checked:!text-amber-500 !border-zinc-800 checked:!border-amber-500 uppercase tracking-widest text-xs" aria-label="Câu chuyện mùi hương" defaultChecked />
                            <div role="tabpanel" className="tab-content py-12 text-zinc-400 leading-loose font-light">
                                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product?.details?.description || '' }}></div>
                            </div>

                            <input type="radio" name="product_tabs" role="tab" className="tab h-20 text-zinc-500 checked:!text-amber-500 !border-zinc-800 checked:!border-amber-500 uppercase tracking-widest text-xs" aria-label="Nghệ thuật sử dụng" />
                            <div role="tabpanel" className="tab-content py-12 text-zinc-400 leading-loose font-light">
                                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product?.details?.tutorial || '' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-1 px-6 bg-zinc-900/30 py-10 rounded-xl border border-zinc-800/50">
                    <div className="p-6 text-center space-y-2">
                        <h4 className="text-white text-xs font-bold uppercase tracking-widest">Bảo chứng Authentic</h4>
                        <p className="text-[11px] text-zinc-500">Cam kết đền 200% nếu phát hiện hàng giả</p>
                    </div>
                    <div className="p-6 text-center space-y-2 border-y md:border-y-0 md:border-x border-zinc-800">
                        <h4 className="text-white text-xs font-bold uppercase tracking-widest">Đặc quyền VIP</h4>
                        <p className="text-[11px] text-zinc-500">Tích điểm đổi quà & thử mùi tại nhà</p>
                    </div>
                    <div className="p-6 text-center space-y-2">
                        <h4 className="text-white text-xs font-bold uppercase tracking-widest">Quà tặng tinh tế</h4>
                        <p className="text-[11px] text-zinc-500">Miễn phí gói quà Luxury cho mọi đơn hàng</p>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-32">
                    <h2 className="text-2xl font-serif text-white mb-12 text-center tracking-widest uppercase">Có thể bạn sẽ thích</h2>
                    <div className="opacity-80 hover:opacity-100 transition-opacity duration-500">
                         <TopPerfumeCarousel Perfume={linkedPerfume} reverse={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}