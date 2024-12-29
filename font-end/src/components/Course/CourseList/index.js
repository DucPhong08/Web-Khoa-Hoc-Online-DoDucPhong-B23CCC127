import React from 'react';
import CourseCard from '../CourseCard';
import './CourseList.css';

function CourseList({ image, name, created_by, price, tag, final_price, discount }) {
    return (
        <div className="course-list">
            <CourseCard
                image={image}
                name={name}
                provider={created_by}
                price={price}
                tag={tag}
                final_price={final_price}
                discount={discount}
            />
        </div>
    );
}

export default CourseList;
