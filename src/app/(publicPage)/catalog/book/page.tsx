import React from 'react';
import BookCard from '@/components/commonComponents/BookCard';
import CatalogSidebar from '../../../../components/modules/bookPage/CatalogSidebar';
import Pagination from '../../../../components/modules/bookPage/Pagination';
import { mockBooks } from '@/lib/mockData';


const AllBooksPage = () => {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-4 tracking-tight">
                    All Books Collection
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                    Browse our comprehensive library of expertly curated books. Use the tailored filters to find exactly what you're looking for.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
                {/* Sidebar */}
                <CatalogSidebar />
                
                {/* Main Content Area */}
                <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Showing <span className="text-blue-600 dark:text-blue-400 font-bold">1-{mockBooks.length}</span> of <span className="text-gray-900 dark:text-white font-bold">120</span> results
                        </p>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block whitespace-nowrap">Sort by:</span>
                            <div className="relative w-full sm:w-auto">
                                <select className="appearance-none w-full sm:w-auto bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-gray-600">
                                    <option>Most Relevant</option>
                                    <option>Newest Arrivals</option>
                                    <option>A-Z</option>
                                    <option>Popularity</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-8">
                        {mockBooks.map((book, idx) => (
                            <BookCard 
                                key={book.id} 
                                book={book} 
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { delay: idx * 0.05, duration: 0.4 } }
                                }}
                            />
                        ))}
                    </div>

                    {/* Pagination Bottom */}
                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <Pagination currentPage={2} totalPages={6} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllBooksPage;