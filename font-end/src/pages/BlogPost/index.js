import React, { useEffect, useState } from 'react';
import styles from './BlogPosts.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import Image from '~/components/Image';
import Button from '~/components/Button';
import Tippy from '@tippyjs/react';
import { getBlog } from '~/services/Blog';

const cx = classNames.bind(styles);

const BlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [selectedTag, setSelectedTag] = useState(null);

    const limit = 4;

    const fetchPosts = async (reset = false, tag = null) => {
        if (loading) return;
        setLoading(true);
        try {
            const newOffset = reset ? 0 : offset;
            const data = await getBlog(newOffset, limit, tag);

            if (data.length > 0) {
                const updatedPosts = reset ? data : [...posts, ...data];
                setPosts(updatedPosts);

                if (data.length < limit) {
                    setHasMore(false);
                }

                setOffset(newOffset + limit);
            } else {
                setPosts([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(true, selectedTag);
    }, [selectedTag]);

    const handleShowMore = () => {
        if (hasMore) {
            fetchPosts(false, selectedTag);
        }
    };

    const tags = ['Toán', 'Lập trình', 'Khoa học tự nhiên', 'Khoa học xã hội', 'Khóa học'];

    const handlePage = () => {
        window.location.href = '/blog/create';
    };

    return (
        <div className={cx('blog-posts')}>
            <h2 className={cx('header')}>Bài Viết Nổi Bật</h2>
            <div className={cx('post-wrapper')}>
                <div className={cx('post-highlight')}>
                    <div className={cx('post-item')}>
                        <div className={cx('blog-header')}>
                            <div className={cx('author')}>
                                <Image src="" alt="Author" className={cx('author-img')} />
                                <span>Lý Cao Nguyên</span>
                            </div>
                            <div className={cx('author-save')}>
                                <FontAwesomeIcon icon={faSave} />
                            </div>
                        </div>
                        <h3 className={cx('blog-title')}>
                            Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày
                        </h3>
                        <p className={cx('blog-content')}>
                            Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn
                            100 bài học và 200 bài viết. Bài viết này...
                        </p>
                    </div>
                </div>
                <div style={{ margin: 'auto' }}>
                    <Tippy delay={[0, 50]} content="Tạo bài viết" placement="bottom" zIndex={99999}>
                        <button className={cx('action-btn')} onClick={handlePage} style={{ fontSize: '20px' }}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </Tippy>
                </div>
            </div>
            <div style={{ marginTop: '6rem' }}>
                <h2 className={cx('header')}>Bài Viết</h2>
                <div className={cx('content')}>
                    <div className={cx('post-ds')}>
                        {posts?.length === 0 ? (
                            <p className={cx('no-posts')}>Chưa có bài viết nào.</p>
                        ) : (
                            <div className={cx('post-list')}>
                                {posts?.map((post) => (
                                    <div key={post.id} className={cx('post-item')}>
                                        <div className={cx('blog-header')}>
                                            <div className={cx('author')}>
                                                <Image src={post.img} alt="Author" className={cx('author-img')} />
                                                <span>{post.author}</span>
                                            </div>
                                            <div className={cx('author-save')}>
                                                <FontAwesomeIcon icon={faSave} />
                                            </div>
                                        </div>
                                        <div className={cx('post-container')}>
                                            <div className={cx('blog-abc')}>
                                                <h3 className={cx('blog-title')}>{post.title}</h3>
                                                <p className={cx('blog-content')}>{post.content}</p>
                                            </div>
                                            {post.image && (
                                                <div>
                                                    <Image
                                                        src={post.image}
                                                        alt="Blog image"
                                                        className={cx('blog-img')}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className={cx('blog-meta')}>
                                            {post.tags && (
                                                <Button className={cx('blog-tags')} outline rounded>
                                                    {post.tags}
                                                </Button>
                                            )}
                                            <span className={cx('created-at')}>
                                                Ngày tạo: {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={cx('post-tag')}>
                        <span>Tìm kiếm theo chủ đề</span>
                        <br />
                        <div style={{ marginTop: '1rem' }}>
                            {tags.map((tag, index) => (
                                <Button
                                    key={index}
                                    className={cx('blog-tags')}
                                    outline
                                    rounded
                                    onClick={() => setSelectedTag(tag)}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {hasMore && !loading && (
                        <div className={cx('load-more')}>
                            <Button onClick={handleShowMore} className={cx('load-more-btn')} outline>
                                Xem thêm
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPosts;
