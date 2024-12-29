const BASE_URL = 'http://localhost:5000/api/review';
async function createReviewCourse(course_slug, formData) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, message: 'Bạn cần đăng nhập trước khi đánh giá khóa học.' };
        }

        const response = await fetch(`${BASE_URL}/Review/${course_slug}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || data.error || 'Đánh giá lỗis' };
        }

        return { success: true, message: data.message, comment: data.review.comment };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default createReviewCourse;
