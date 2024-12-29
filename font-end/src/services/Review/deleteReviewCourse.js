const BASE_URL = 'http://localhost:5000/api/review';
async function deleteReviewCourse(course_slug) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước khi đánh giá khóa học.' };
        }

        const response = await fetch(`${BASE_URL}/DeleteReview/${course_slug}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || data.error || 'Đánh giá lỗis' };
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default deleteReviewCourse;
