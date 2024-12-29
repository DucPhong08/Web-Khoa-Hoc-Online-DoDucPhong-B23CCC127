import config from '~/config';

// Layouts
// import { HeaderOnly } from '~/layouts';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Profile from '~/pages/Profile';
import Description from '~/pages/Description';
import Management from '~/pages/Management';
import Search from '~/pages/Search';
import CourseContent from '~/pages/CourseVideo';
import Blog from '~/pages/BlogPost';
import Cart from '~/pages/ShopCart';
import Contact from '~/pages/Contact';
import CreatePost from '~/pages/BlogPost/CreateBlog';

// Route quản lý con children
import Students from '~/pages/Management/Students';
import Courses from '~/pages/Management/Courses';
import Teacher from '~/pages/Management/Teacher';
import Approved_Certificate from '~/pages/Management/AprovedCertificate';
import CreateCourses from '~/pages/Management/Courses/CreateCourses';
import ApprovedRole from '~/pages/Management/ApproveRole';
import ApproveQc from '~/pages/Management/ApproveImg';

import ChangePass from '~/pages/Profile/ChangePass';
import UserInfo from '~/pages/Profile/UserInfo';
import MyCourse from '~/pages/Profile/MyCourse';
import ProPerty from '~/pages/Profile/Property';
import RoleRequest from '~/pages/Profile/RoleRequest';
import QcRequest from '~/pages/Profile/QcRequest';

import SendNotification from '~/pages/Management/MagKhac/Notification';

// Pulblic routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.register, component: Login, layout: null },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.post, component: Blog },
    { path: `${config.routes.post}/create`, component: CreatePost },
    {
        path: config.routes.description,
        component: Description,
    },
    {
        path: config.routes.video,
        component: CourseContent,
    },
    {
        path: '/cart',
        component: Cart,
    },
    {
        path: '/lien-he',
        component: Contact,
    },
];

const privateRoutes = [
    {
        path: config.routes.management,
        component: Management,
        layout: null,
        children: [
            // Students
            {
                path: `${config.routes.users}/students`,
                component: Students,
                layout: null,
            },
            {
                path: `${config.routes.users}/teacher`,
                component: Teacher,
                layout: null,
            },
            {
                path: `${config.routes.users}/role-request`,
                component: ApprovedRole,
                layout: null,
            },
            {
                path: `${config.routes.users}/certificate-student`,
                component: Approved_Certificate,
                layout: null,
            },
            // Course
            {
                path: config.routes.courses,
                component: Courses,
                layout: null,
            },
            {
                path: `${config.routes.courses}/add`,
                component: CreateCourses,
                layout: null,
            },
            {
                path: `${config.routes.courses}/ds-khoa-hoc`,
                component: Courses,
                layout: null,
            },
            // other
            {
                path: config.routes.other,
                component: SendNotification,
                layout: null,
            },
            {
                path: `${config.routes.other}/send-all-notification`,
                component: SendNotification,
                layout: null,
            },
            {
                path: `${config.routes.other}/quang-cao`,
                component: ApproveQc,
                layout: null,
            },
        ],
    },
    {
        path: config.routes.profile,
        component: Profile,
        children: [
            {
                path: `thong-tin`,
                component: UserInfo,
                layout: null,
            },
            {
                path: `doi-mk`,
                component: ChangePass,
                layout: null,
            },
            {
                path: `khoa-hoc-cua-toi`,
                component: MyCourse,
                layout: null,
            },
            {
                path: `nap-xu`,
                component: ProPerty,
                layout: null,
            },
            {
                path: `quang-cao`,
                component: QcRequest,
                layout: null,
            },
            {
                path: `nang-quyen`,
                component: RoleRequest,
                layout: null,
            },
        ],
    },
];

export { publicRoutes, privateRoutes };
