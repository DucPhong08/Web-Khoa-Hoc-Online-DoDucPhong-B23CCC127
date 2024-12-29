const BASE_URL = 'http://localhost:5000/api/blog';
async function getBlog(offset = 0, limit = 4, tag) {
    try {
        let url = `${BASE_URL}/getAllPost?offset=${offset}&limit=${limit}`;
        if (tag) {
            url += `&tag=${tag}`;
        }

        // Make GET request
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status !== 200) {
            return { success: false, message: data.message || data.error || 'Lỗi khi xem blog ' };
        }

        return data.posts;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: 'Không thể kết nối đến server' };
    }
}

export default getBlog;
