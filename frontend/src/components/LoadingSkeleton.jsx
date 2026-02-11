import React from 'react';
import '../styles/LoadingSkeleton.css';

const LoadingSkeleton = ({
    variant = 'text',
    width,
    height,
    count = 1,
    className = '',
    animate = true
}) => {
    const skeletons = Array.from({ length: count }, (_, index) => {
        const style = {
            width: width || (variant === 'circular' ? '40px' : '100%'),
            height: height || (variant === 'circular' ? '40px' : variant === 'text' ? '16px' : '100px'),
            borderRadius: variant === 'circular' ? '50%' : variant === 'rectangular' ? '8px' : '4px',
        };

        return (
            <div
                key={index}
                className={`skeleton ${animate ? 'skeleton-animate' : ''} ${className}`}
                style={style}
                aria-busy="true"
                aria-live="polite"
            />
        );
    });

    return <>{skeletons}</>;
};

// Specialized skeleton components
export const SkeletonCard = ({ height = '200px' }) => (
    <div className="skeleton-card" style={{ height }}>
        <LoadingSkeleton variant="rectangular" height="60%" />
        <div style={{ padding: '1rem' }}>
            <LoadingSkeleton variant="text" width="80%" />
            <LoadingSkeleton variant="text" width="60%" />
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
    <div className="skeleton-table">
        <div className="skeleton-table-header">
            {Array.from({ length: columns }, (_, i) => (
                <LoadingSkeleton key={i} variant="text" width="80px" />
            ))}
        </div>
        {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="skeleton-table-row">
                {Array.from({ length: columns }, (_, colIndex) => (
                    <LoadingSkeleton key={colIndex} variant="text" width="100%" />
                ))}
            </div>
        ))}
    </div>
);

export const SkeletonStockCard = () => (
    <div className="skeleton-stock-card">
        <LoadingSkeleton variant="circular" width="40px" height="40px" />
        <div className="skeleton-stock-info">
            <LoadingSkeleton variant="text" width="100px" />
            <LoadingSkeleton variant="text" width="60px" />
        </div>
        <LoadingSkeleton variant="rectangular" width="80px" height="40px" />
    </div>
);

export default LoadingSkeleton;
