'use client';

// region Imports

// Import Package
import Image from 'next/image';
import { useState, type ReactNode } from 'react';

// Import Types
import type { IProductImage } from '@/types/product.types';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface ProductImageGalleryProps {
    images: IProductImage[];
    className?: string;
}

// Renders a product image gallery with a large active image and a row of tappable
// thumbnails to switch the active image; shows a placeholder when there are no images
export function ProductImageGallery({ images, className }: ProductImageGalleryProps): ReactNode {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const activeImage = images[activeIndex] ?? images[0];

    if (!activeImage) {
        return (
            <div
                className={cn(
                    'flex aspect-square w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400',
                    className,
                )}
            >
                No image available
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
                <Image
                    src={activeImage.url}
                    alt={activeImage.alt}
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                />
            </div>
            {images.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                        <button
                            key={`${image.url}-${index}`}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Show image ${index + 1}`}
                            aria-current={index === activeIndex}
                            className={cn(
                                'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition-colors duration-150',
                                index === activeIndex
                                    ? 'border-indigo-600'
                                    : 'border-transparent hover:border-slate-300',
                            )}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                unoptimized
                                sizes="64px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
