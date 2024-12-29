import './Rating.css';
import { useEffect, useState } from 'react';
import ToastContainer from '~/components/Toast';
import { createReviewCourse, deleteReviewCourse } from '~/services/Review';

function Rating({ data, slug }) {
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [toasts, setToasts] = useState([]);
    const [hoverRating, setHoverRating] = useState(0);
    const addToast = ({ title, message, type, duration }) => {
        setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
    };

    const handleSubmit = async () => {
        if (newComment.trim()) {
            try {
                const formData = {
                    rating,
                    comment: newComment,
                };

                const response = await createReviewCourse(slug, formData);

                if (response.success) {
                    addToast({
                        title: 'Thành công!',
                        message: response.message || 'Đánh giá đã hoàn thành',
                        type: 'success',
                        duration: 5000,
                    });
                    setNewComment('');
                } else {
                    addToast({
                        title: 'Lỗi',
                        message: response.message || 'Đã xảy ra lỗi khi đánh giá',
                        type: 'warning',
                        duration: 5000,
                    });
                }
            } catch (error) {
                addToast({
                    title: 'Lỗi',
                    message: 'Đã xảy ra lỗi khi đánh giá',
                    type: 'error',
                    duration: 5000,
                });
            }
        }
    };
    console.log(data);
    return (
        <div className="rating-container">
            <ToastContainer toasts={toasts} />

            {/* Summary */}
            <div className="rating-summary">
                <h2>Đánh giá</h2>
                <div className="rating-overall">
                    <div className="rating-score">
                        <span className="score">1</span>
                        <div className="stars">★★★★☆</div>
                        <p>(2 đánh giá)</p>
                    </div>
                    <div className="rating-distribution">
                        {[
                            { label: '5 sao', percent: 3 },
                            { label: '4 sao', percent: 0 },
                            { label: '3 sao', percent: 0 },
                            { label: '2 sao', percent: 0 },
                            { label: '1 sao', percent: 1 },
                        ].map((item) => (
                            <div className="rating-row" key={item.label}>
                                <span>{item.label}</span>
                                <div className="rating-bar">
                                    <div className="rating-bar-filled" style={{ width: `${item.percent}%` }}></div>
                                </div>
                                <span>{item.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="stars-container">
                <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${hoverRating >= star || rating >= star ? 'filled' : ''}`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <p>Đánh giá & comment </p>
            </div>

            {/* Input */}
            <div className="rating-input">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Đánh giá của bạn"
                    className="rating-textarea"
                ></textarea>
                <button className="rating-submit-btn" onClick={handleSubmit}>
                    Gửi đánh giá
                </button>
            </div>

            {/* Comments */}
            <div className="rating-comments">
                {data?.length > 0 ? (
                    data.map((review) => (
                        <div className="comment" key={review.id}>
                            <div className="comment-header">
                                <span className="comment-author">{review.user_name || 'Người dùng ẩn danh'}</span>
                                <span className="comment-date">{review.created_at || 'Không rõ ngày'}</span>
                            </div>
                            <div className="comment-rating">
                                {'★'.repeat(Math.max(0, Math.min(review.rating, 5))) +
                                    '☆'.repeat(5 - Math.max(0, Math.min(review.rating, 5)))}
                            </div>
                            <p>{review.comment || 'Không có bình luận'}</p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có đánh giá nào.</p>
                )}
            </div>
        </div>
    );
}

export default Rating;
