import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AmazonTemplateRendererProps {
    contentData: any;
    amazonLink?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    authorName?: string;
}

export function AmazonTemplateRenderer({ 
    contentData, 
    amazonLink = "#", 
    title = "The Art of Resilience", 
    description = "", 
    imageUrl,
    category,
    authorName 
}: AmazonTemplateRendererProps) {
    const blocks = contentData?.blocks || [];
    
    const getBlockData = (id: string) => blocks.find((b: any) => b.id === id)?.data || {};

    const breadcrumbs = getBlockData('breadcrumbs');
    const authorAndRatings = getBlockData('authorAndRatings');
    const formats = getBlockData('formats');
    const details = getBlockData('details');
    const buyBox = getBlockData('buyBox');
    const reviews = getBlockData('reviews');

    // Default image if not provided
    const mainImage = imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1074";

    // helper for rendering stars
    const renderStars = (ratingStr: string) => {
        const rating = parseFloat(ratingStr) || 0;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<i key={i} className="fas fa-star"></i>);
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
            } else {
                stars.push(<i key={i} className="far fa-star text-gray-300"></i>);
            }
        }
        return stars;
    };

    return (
        <div className="font-sans bg-[#f8f9fa] text-gray-900 pb-20">
            {/* Custom Styles */}
            <style dangerouslySetInnerHTML={{__html: `
                .amazon-orange { color: #FF9900; }
                .amazon-bg-orange { background-color: #FF9900; }
                .amazon-bg-yellow { background-color: #FFD814; }
                .amazon-bg-yellow:hover { background-color: #F7CA00; }
                .sticky-buy-box { position: sticky; top: 20px; }
            `}} />
            
            {/* FontAwesome */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-600">
                Books &gt; {category || "Self-Help"} &gt; <span className="text-orange-700">{title}</span>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Column 1: Image */}
                    <div className="w-full lg:w-[35%]">
                        <div className="sticky top-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-center">
                            <div className="relative group cursor-zoom-in">
                                <img src={mainImage} alt={title} className="rounded-lg shadow-lg max-h-[500px] w-auto transition duration-300 transform group-hover:scale-[1.02]" />
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Product Details */}
                    <div className="w-full lg:w-[40%] space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 leading-tight">{title}</h1>
                            <div className="mt-2 flex items-center space-x-2">
                                <span className="text-blue-600 hover:text-orange-700 hover:underline cursor-pointer">{authorName || authorAndRatings.authorName || "Author Name"}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500 text-sm">Follow the Author</span>
                            </div>
                            <div className="flex items-center mt-2 space-x-2">
                                <div className="flex text-orange-400">
                                    {renderStars(reviews.ratingNumber)}
                                </div>
                                <span className="text-sm text-blue-600 hover:text-orange-700 cursor-pointer">{authorAndRatings.ratingsCount || "0"} ratings</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-sm text-blue-600 hover:text-orange-700 cursor-pointer">{authorAndRatings.answeredQuestions || "0"} answered questions</span>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1,2,3,4].map(num => {
                                const formatName = formats[`format${num}Name`];
                                const formatPrice = formats[`format${num}Price`];
                                const formatSubtext = formats[`format${num}Subtext`];
                                if (!formatName) return null;
                                return (
                                    <div key={num} className={`border rounded-md p-3 text-center hover:bg-gray-50 cursor-pointer ${num === 1 ? 'border-orange-500 bg-orange-50' : ''}`}>
                                        <p className="text-xs font-bold uppercase text-gray-500">{formatName}</p>
                                        <p className="text-lg font-bold text-red-700">{formatPrice}</p>
                                        <p className="text-[10px] text-gray-500">{formatSubtext}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">About this book</h3>
                            <div className="text-gray-700 leading-relaxed text-sm prose max-w-none">
                                <ReactMarkdown>{description || "Description coming soon."}</ReactMarkdown>
                            </div>
                            
                            <button className="text-blue-600 hover:text-orange-700 font-medium text-sm flex items-center mt-2">
                                Read more <i className="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-bold text-sm mb-3">Product details</h4>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <span className="font-semibold">Publisher:</span> <span>{details.publisher || "-"}</span>
                                <span className="font-semibold">Language:</span> <span>{details.language || "-"}</span>
                                <span className="font-semibold">Pages:</span> <span>{details.pages || "-"}</span>
                                <span className="font-semibold">ISBN-10:</span> <span>{details.isbn || "-"}</span>
                                <span className="font-semibold">Dimensions:</span> <span>{details.dimensions || "-"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Buy Box */}
                    <div className="w-full lg:w-[25%]">
                        <div className="sticky-buy-box bg-white border border-gray-300 rounded-lg p-5 shadow-sm space-y-4">
                            <div className="text-2xl font-medium text-red-700">{buyBox.price || "$0.00"}</div>
                            <div className="text-sm">
                                <p className="text-gray-600">Get <span className="font-bold">{buyBox.shippingText || "Fast, Free Shipping"}</span></p>
                                <p className="text-green-700 font-medium mt-1">FREE Returns</p>
                            </div>

                            <div className="text-green-700 text-lg font-medium">{buyBox.inStockText || "In Stock"}</div>
                            
                            <div className="space-y-3">
                                <a href={amazonLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                                    <button className="w-full amazon-bg-yellow py-2.5 rounded-full text-sm font-medium shadow-sm border border-[#F2C200] transition hover:bg-[#F7CA00] active:scale-[0.98]">
                                        Visit Amazon
                                    </button>
                                </a>
                            </div>

                            <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Ships from</span>
                                    <span className="text-gray-800">{buyBox.shipsFrom || "Amazon.com"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Sold by</span>
                                    <span className="text-gray-800">{buyBox.soldBy || "Summit Books"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Reviews Section */}
                <section className="mt-16 border-t border-gray-200 pt-8">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Review Summary */}
                        <div className="w-full md:w-1/3 space-y-4">
                            <h2 className="text-2xl font-bold">Customer reviews</h2>
                            <div className="flex items-center space-x-2">
                                <div className="flex text-orange-400 text-xl">
                                    {renderStars(reviews.ratingNumber)}
                                </div>
                                <span className="text-lg font-bold">{reviews.ratingNumber}</span>
                            </div>
                            <p className="text-sm text-gray-500">{reviews.globalRatings}</p>

                            {/* Rating Bars */}
                            <div className="space-y-2 mt-4">
                                {[
                                    {stars: 5, percent: 74},
                                    {stars: 4, percent: 15},
                                    {stars: 3, percent: 5},
                                    {stars: 2, percent: 3},
                                    {stars: 1, percent: 3},
                                ].map((bar) => (
                                    <div key={bar.stars} className="flex items-center text-sm">
                                        <span className={`w-12 ${bar.stars >= 3 ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-400'}`}>{bar.stars} star</span>
                                        <div className="flex-1 h-5 bg-gray-100 rounded mx-3 overflow-hidden border">
                                            <div className={`h-full ${bar.stars >= 3 ? 'bg-[#FFA41C]' : 'bg-gray-300'}`} style={{ width: `${bar.percent}%` }}></div>
                                        </div>
                                        <span className={`w-8 ${bar.stars >= 3 ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-400'}`}>{bar.percent}%</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t">
                                <h4 className="font-bold mb-2">Review this product</h4>
                                <p className="text-sm mb-4">Share your thoughts with other customers</p>
                                <button className="w-full py-1.5 border border-gray-400 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    Write a customer review
                                </button>
                            </div>
                        </div>

                        {/* Individual Reviews */}
                        <div className="w-full md:w-2/3 space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Top reviews from the United States</h3>
                            </div>

                            {[1, 2].map((num) => {
                                const revName = reviews[`review${num}Name`];
                                const revRating = reviews[`review${num}Rating`] || (num === 1 ? "5" : "4");
                                const revTitle = reviews[`review${num}Title`];
                                const revDate = reviews[`review${num}Date`];
                                const revText = reviews[`review${num}Text`];
                                
                                if (!revName) return null;
                                
                                return (
                                    <div key={num} className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <i className="fas fa-user text-gray-400 text-sm"></i>
                                            </div>
                                            <span className="text-sm font-medium">{revName}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex text-orange-400 text-xs">
                                                {renderStars(revRating)}
                                            </div>
                                            <span className="font-bold text-sm">{revTitle}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{revDate}</div>
                                        <div className="text-sm font-bold text-orange-700 uppercase tracking-tighter">Verified Purchase</div>
                                        <p className="text-sm leading-relaxed text-gray-800">
                                            {revText}
                                        </p>
                                        <div className="flex items-center space-x-4 pt-2">
                                            <button className="px-6 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">Helpful</button>
                                            <span className="text-xs text-gray-500 border-l pl-4 cursor-pointer hover:underline">Report</span>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            <button className="text-blue-600 hover:text-orange-700 text-sm font-medium">See all reviews <i className="fas fa-chevron-right ml-1 text-[10px]"></i></button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
