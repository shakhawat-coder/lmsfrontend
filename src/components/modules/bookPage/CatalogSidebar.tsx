"use client";

import React from 'react';
import { Search, Filter, BookOpen, User, Tag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = ["Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography"];
const authors = ["J.K. Rowling", "George Orwell", "Stephen Hawking", "Robert Kiyosaki", "Yuval Noah Harari", "Walter Isaacson"];

const SidebarContent = () => (
    <div className="space-y-8 px-3 lg:px-0">
        {/* Search */}
        <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                Search Books
            </h3>
            <Input type="text" placeholder="Title, author, or ISBN..." className="w-full" />
        </div>

        <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            {/* Categories */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    Categories
                </h3>
                <div className="space-y-2.5">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input 
                                    type="checkbox" 
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />
                                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Authors */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Authors
                </h3>
                <div className="space-y-2.5">
                    {authors.map((author) => (
                        <label key={author} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input 
                                    type="checkbox" 
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />
                                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                {author}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Availability
                </h3>
                <div className="space-y-2.5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 border-2 border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                            />
                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                            Available Now
                        </span>
                    </label>
                </div>
            </div>
        </div>
    </div>
);

const CatalogSidebar = () => {
    return (
        <>
            {/* Mobile Sidebar (Sheet) */}
            <div className="lg:hidden mb-6 px-3 flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <span className="font-semibold text-gray-900 dark:text-white">Filter Books</span>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="text-left flex items-center gap-2">
                                <Filter className="w-5 h-5 text-blue-600" />
                                All Filters
                            </SheetTitle>
                        </SheetHeader>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 shrink-0">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                    <div className="flex items-center gap-2 pb-5 mb-6 border-b border-gray-100 dark:border-gray-800">
                        <Filter className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                    </div>
                    <SidebarContent />
                </div>
            </div>
        </>
    );
};

export default CatalogSidebar;
