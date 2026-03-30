"use client";

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import BookCard from '@/components/commonComponents/BookCard';
import CatalogSidebar from '../../../../components/modules/bookPage/CatalogSidebar';
import Pagination from '../../../../components/modules/bookPage/Pagination';
import { bookApi, categoryApi, Book, Category } from '@/lib/api';
import { Loader2Icon, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookCardSkeleton from '@/components/commonComponents/BookCardSkeleton';

const AllBooksPage = () => {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || "";
    const initialCategory = searchParams.get('category');
    
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialCategory ? [initialCategory] : []
    );
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("Most Relevant");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const BOOKS_PER_PAGE = 6;

    // Sync search term and category with URL params
    useEffect(() => {
        const querySearch = searchParams.get('search');
        const queryCategory = searchParams.get('category');
        
        if (querySearch !== null) {
            setSearchTerm(querySearch);
            setCurrentPage(1); 
        }
        
        if (queryCategory !== null) {
            setSelectedCategories([queryCategory]);
            setCurrentPage(1);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksData, categoriesData] = await Promise.all([
                    bookApi.getAll(),
                    categoryApi.getAll()
                ]);
                
                const bookItems = Array.isArray(booksData) ? booksData : (booksData as any).data || [];
                const categoryItems = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any).data || [];
                
                setBooks(bookItems);
                setCategories(categoryItems);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Extract unique authors from the book list
    const authors = useMemo(() => {
        const uniqueAuthors = new Set<string>();
        books.forEach(book => {
            if (book.author) uniqueAuthors.add(book.author);
        });
        return Array.from(uniqueAuthors).sort();
    }, [books]);

    // Filtering logic
    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesSearch = !searchTerm || 
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategories.length === 0 || 
                selectedCategories.includes(book.categoryId);
            
            const matchesAuthor = selectedAuthors.length === 0 || 
                selectedAuthors.includes(book.author);

            const matchesAvailability = !onlyAvailable || book.availability === true;
            
            return matchesSearch && matchesCategory && matchesAuthor && matchesAvailability;
        }).sort((a, b) => {
            if (sortBy === "A-Z") return a.title.localeCompare(b.title);
            if (sortBy === "Z-A") return b.title.localeCompare(a.title);
            if (sortBy === "Newest Arrivals") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0; // Default sorting
        });
    }, [books, searchTerm, selectedCategories, selectedAuthors, sortBy, onlyAvailable]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
    const paginatedBooks = useMemo(() => {
        const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
        return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
    }, [filteredBooks, currentPage]);

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
        setCurrentPage(1); // Reset page on filter change
    };

    const handleAuthorToggle = (author: string) => {
        setSelectedAuthors(prev => 
            prev.includes(author) 
                ? prev.filter(a => a !== author) 
                : [...prev, author]
        );
        setCurrentPage(1); // Reset page on filter change
    };

    const handleAvailabilityToggle = () => {
        setOnlyAvailable(!onlyAvailable);
        setCurrentPage(1); // Reset page on filter change
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategories([]);
        setSelectedAuthors([]);
        setOnlyAvailable(false);
        setCurrentPage(1);
    };

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
                <CatalogSidebar 
                    categories={categories}
                    authors={authors}
                    selectedCategories={selectedCategories}
                    selectedAuthors={selectedAuthors}
                    onCategoryChange={handleCategoryToggle}
                    onAuthorChange={handleAuthorToggle}
                    searchTerm={searchTerm}
                    onSearchChange={(term) => {
                        setSearchTerm(term);
                        setCurrentPage(1);
                    }}
                    onlyAvailable={onlyAvailable}
                    onAvailabilityToggle={handleAvailabilityToggle}
                />
                
                {/* Main Content Area */}
                <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Showing <span className="text-blue-600 dark:text-blue-400 font-bold">{paginatedBooks.length}</span> of <span className="text-gray-900 dark:text-white font-bold">{filteredBooks.length}</span> results
                        </p>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block whitespace-nowrap">Sort by:</span>
                            <div className="relative w-full sm:w-auto">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="appearance-none w-full sm:w-auto bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
                                >
                                    <option>Most Relevant</option>
                                    <option>Newest Arrivals</option>
                                    <option>A-Z</option>
                                    <option>Z-A</option>
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
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-8 min-h-[600px]">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <BookCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : paginatedBooks.length === 0 ? (
                        <div className="text-center py-24 flex flex-col items-center gap-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                            <SearchX className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No books found</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                            </div>
                            <Button variant="outline" onClick={clearFilters} className="mt-4">
                                Clear All Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-8">
                            {paginatedBooks.map((book, idx) => (
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
                    )}

                    {/* Pagination Bottom */}
                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const AllBooksPageWrapper = () => (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading books...</div>}>
        <AllBooksPage />
    </Suspense>
);

export default AllBooksPageWrapper;