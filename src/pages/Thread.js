import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import Header from '../components/Header';

const ThreadContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f6fa;
`;

const MainContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ThreadHeader = styled.div`
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ThreadTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const ThreadMeta = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
`;

const PostsContainer = styled.div`
  margin-bottom: 2rem;
`;

const Post = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ecf0f1;
`;

const PostAuthor = styled.div`
  font-weight: bold;
  color: #00A3E7;
`;

const PostDate = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const PostContent = styled.div`
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ReplyForm = styled.form`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #00A3E7;
    box-shadow: 0 0 0 2px rgba(0, 163, 231, 0.1);
  }
`;

const AuthorInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #00A3E7;
    box-shadow: 0 0 0 2px rgba(0, 163, 231, 0.1);
  }
`;

const SubmitButton = styled.button`
  background-color: #00A3E7;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0089c3;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

function Thread() {
  const { categoryId, threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [authorName, setAuthorName] = useState('名無しさん');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      const threadDoc = await getDoc(doc(db, 'threads', threadId));
      if (threadDoc.exists()) {
        setThread({ id: threadDoc.id, ...threadDoc.data() });
      }

      const postsQuery = query(
        collection(db, 'posts'),
        where('threadId', '==', threadId),
        orderBy('createdAt', 'asc')
      );
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    };

    fetchThread();
  }, [threadId]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 投稿を追加
      const postData = {
        content: replyContent.trim(),
        authorName: authorName.trim() || '名無しさん',
        threadId,
        createdAt: serverTimestamp()
      };

      // 投稿を追加
      const postRef = await addDoc(collection(db, 'posts'), postData);
      
      if (!postRef.id) {
        throw new Error('投稿の保存に失敗しました');
      }

      // スレッドの返信数を更新
      const threadRef = doc(db, 'threads', threadId);
      await updateDoc(threadRef, {
        replyCount: increment(1),
        updatedAt: serverTimestamp()
      });

      // フォームをリセット
      setReplyContent('');
      setAuthorName('名無しさん');

      // 投稿を再読み込み
      const postsQuery = query(
        collection(db, 'posts'),
        where('threadId', '==', threadId),
        orderBy('createdAt', 'asc')
      );
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

    } catch (error) {
      console.error('返信の投稿中にエラーが発生しました:', error);
      alert('返信の投稿中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!thread) {
    return (
      <ThreadContainer>
        <Header />
        <MainContent>
          <div>読み込み中...</div>
        </MainContent>
      </ThreadContainer>
    );
  }

  return (
    <ThreadContainer>
      <Header />
      <MainContent>
        <ThreadHeader>
          <ThreadTitle>{thread.title}</ThreadTitle>
          <ThreadMeta>
            <span>作成者: {thread.authorName || '名無しさん'}</span>
            <span>カテゴリ: {categoryId}</span>
            <span>返信: {posts.length}</span>
            {thread.createdAt && <span>作成: {formatDate(thread.createdAt)}</span>}
          </ThreadMeta>
        </ThreadHeader>

        <PostsContainer>
          {posts.map(post => (
            <Post key={post.id}>
              <PostHeader>
                <PostAuthor>{post.authorName || '名無しさん'}</PostAuthor>
                {post.createdAt && <PostDate>{formatDate(post.createdAt)}</PostDate>}
              </PostHeader>
              <PostContent>{post.content}</PostContent>
            </Post>
          ))}
        </PostsContainer>

        <ReplyForm onSubmit={handleSubmitReply}>
          <AuthorInput
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="名前（空欄の場合は「名無しさん」）"
          />
          <TextArea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="返信を入力（必須）"
            required
          />
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '送信中...' : '返信する'}
          </SubmitButton>
        </ReplyForm>
      </MainContent>
    </ThreadContainer>
  );
}

export default Thread; 