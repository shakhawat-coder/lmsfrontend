import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-4 mb-4">
            <button 
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 transition-all shadow-sm"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    const isCurrent = pageNum === currentPage;
                    
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                                isCurrent
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-110'
                                : 'border-2 border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>
            
            <button 
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 transition-all shadow-sm"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
