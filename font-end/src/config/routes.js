const routes = {
    home: '/',
    login: '/login',
    register: '/register',
    profile: '/user',
    management: '/management',
    post: 'blog',
    search: '/search',
    description: '/description/:slug',
    video: '/description/:slug/:video_id',
    acc: '/acc/:nick',
    // route private
    dashboard: 'dashboard',
    users: 'user',
    courses: 'courses',
    other: 'other',
};

export default routes;
