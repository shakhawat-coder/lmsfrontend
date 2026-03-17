import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <button 
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                const isCurrent = pageNum === currentPage;
                
                return (
                    <button
                        key={pageNum}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-all ${
                            isCurrent
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                    >
                        {pageNum}
                    </button>
                );
            })}
            
            <button 
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
