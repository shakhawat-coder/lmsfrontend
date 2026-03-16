"use client";

import React from 'react';
import { motion, Variants } from 'motion/react';
import Link from 'next/link';

export interface Category {
    id: number;
    name: string;
    bookCount: number;
    image: string;
}

export interface CategoryCardProps {
    category: Category;
    variants?: Variants;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, variants }) => {
    return (
        <motion.div variants={variants}>
            <Link
                href={`/categories/${category.id}`}
                className="group block relative h-72 md:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
            >
                {/* Background Image Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <motion.div
                        className="transform transition-transform duration-300 group-hover:-translate-y-2"
                    >
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {category.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-600/90 text-white text-sm font-medium backdrop-blur-sm">
                                {category.bookCount.toLocaleString()} Books
                            </span>
                        </div>
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CategoryCard;