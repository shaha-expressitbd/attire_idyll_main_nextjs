import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const DurgaPujaBannerSkeleton: React.FC = () => {
    return (
        <div>
            <SkeletonComponent
                type="image"
                className="w-full h-auto aspect-[53/19] rounded-lg"
            />
        </div>
    );
};

export default DurgaPujaBannerSkeleton;