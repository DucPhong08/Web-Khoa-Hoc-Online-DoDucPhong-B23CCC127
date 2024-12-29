import styles from './UserInfo.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Image from '~/components/Image';
import images from '~/assets/images';
import { Wrapper as UserContainer } from '~/components/Popper';
import { useEffect, useState } from 'react';
import InfoForm from './Form-info';
import MxhForm from './Form-Mxh';
import IntroduceForm from './Form-introduce';
import { getUser } from '~/services/User';
import { useModal } from '~/Context/Modal';

const cx = classNames.bind(styles);

function UserInfo() {
    const [inputValue, setInputValue] = useState('');
    const [imas, setImas] = useState('');
    const { openModal } = useModal();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);

    // Tải danh sách khóa học khi component được mount
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const data = await getUser();
                setUser(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);
    useEffect(() => {
        if (user.introduce) {
            setInputValue(user.introduce || '');
        }
    }, [user.introduce]);
    useEffect(() => {
        setImas(user.image);
    }, [user]);

    const handleOpenModal = (a) => {
        switch (a) {
            case 'info':
                openModal(<InfoForm data={user} updateUser={updateUser} />);
                break;
            case 'Mxh':
                openModal(<MxhForm data={user} updateUser={updateUser} />);
                break;
            case 'introduce':
                openModal(<IntroduceForm data={user} updateUser={updateUser} />);
                break;
            default:
                break;
        }
    };
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    return (
        <div className={cx('profile-container')}>
            {/* Info */}
            <UserContainer className={cx('profile-wrapper')}>
                <div className={cx('info-heading')}>
                    <div className={cx('user-info')}>THÔNG TIN</div>
                    <Button outline onClick={() => handleOpenModal('info')}>
                        Cập nhật
                    </Button>
                </div>
                <div className={cx('content')}>
                    <div className={cx('content-avatar')}>
                        <Image src={user.image} alt="Avatar" className={cx('avatar-frame')} />
                    </div>
                    <div className={cx('content-info')}>
                        <div className={cx('content-info-setting')}>
                            <div className={cx('content-info-full')}>
                                <span className={cx('user-label')}>
                                    Họ tên<span>*</span>
                                </span>
                                <span className={cx('user-content')}>{user.name}</span>
                            </div>
                            <div className={cx('content-info-full')}>
                                <span className={cx('user-label')}>Ngày sinh</span>
                                <span className={cx('user-content')}>{user.date_of_birth}</span>
                            </div>
                            <div className={cx('content-info-full')}>
                                <span className={cx('user-label')}>
                                    Tài khoản<span>*</span>
                                </span>
                                <span className={cx('user-content')}>{user.account}</span>
                            </div>
                            <div className={cx('content-info-full')}>
                                <span className={cx('user-label')}>
                                    Thường trú<span>*</span>
                                </span>
                                <span className={cx('user-content')}>{user.permanent_residence}</span>
                            </div>
                            <div className={cx('content-info-full')}>
                                <span className={cx('user-label')}>
                                    Quê quán<span>*</span>
                                </span>
                                <span className={cx('user-content')}>{user.hometown}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </UserContainer>
            {/* Liên kết MXH */}
            <UserContainer className={cx('profile-wrapper')}>
                <div className={cx('info-heading')}>
                    <div className={cx('user-info')}>MẠNG XÃ HỘI</div>
                    <Button outline onClick={() => handleOpenModal('Mxh')}>
                        Cập nhật
                    </Button>
                </div>
                <div className={cx('content')}>
                    {/* fb */}
                    <div className={cx('content-avatar')}>
                        <Image src={images.fbImage} alt="icon" className={cx('icon-frame')} />
                    </div>
                    <div className={cx('content-info')}>
                        <div className={cx('content-info-setting')}>
                            <div className={cx('content-info-full')}>
                                <span className={cx('user-content')}>{user.fb}</span>
                            </div>
                        </div>
                    </div>
                    {/* gg */}
                    <div className={cx('content-avatar')}>
                        <Image src={images.googleImage} alt="icon" className={cx('icon-frame')} />
                    </div>
                    <div className={cx('content-info')}>
                        <div className={cx('content-info-setting')}>
                            <div className={cx('content-info-full')}>
                                <span className={cx('user-content')}>{user.google}</span>
                            </div>
                        </div>
                    </div>
                    {/* zalo */}
                    <div className={cx('content-avatar')}>
                        <Image src={images.zaloImage} alt="icon" className={cx('icon-frame')} />
                    </div>
                    <div className={cx('content-info')}>
                        <div className={cx('content-info-setting')}>
                            <div className={cx('content-info-full')}>
                                <span className={cx('user-content')}>{user.zalo}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </UserContainer>
            {/* Introduce */}
            <UserContainer className={cx('profile-wrapper')}>
                <div className={cx('info-heading')}>
                    <div className={cx('user-info')}>GIỚI THIỆU</div>
                    <Button outline onClick={() => handleOpenModal('introduce')}>
                        Cập nhật
                    </Button>
                </div>
                <textarea
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className={cx('user-input')}
                    placeholder="Giới thiệu"
                    readOnly
                />
            </UserContainer>
        </div>
    );
}

export default UserInfo;
