import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const ThreadListContainer = styled.div`
  padding: 2rem;
`;

const CategoryHeader = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #00A3E7;
  display: inline-block;
  padding-bottom: 0.5rem;
`;

const CategoryDescription = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const CreateButton = styled(Link)`
  display: inline-block;
  background-color: #00A3E7;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 2rem;
  
  &:hover {
    background-color: #0089c3;
  }
`;

const ThreadsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Thread = styled(Link)`
  display: block;
  padding: 1.5rem;
  border-bottom: 1px solid #ecf0f1;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f9fa;
    border-left: 3px solid #00A3E7;
  }
`;

const ThreadTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const ThreadMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const NoThreads = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
`;

function ThreadList() {
  const { category } = useParams();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryInfo = {
    soccer: { name: 'サッカー', description: '佐賀県のサッカーに関する話題' },
    baseball: { name: '野球', description: '佐賀県の野球に関する話題' },
    basketball: { name: 'バスケットボール', description: '佐賀県のバスケに関する話題' },
    volleyball: { name: 'バレーボール', description: '佐賀県のバレーに関する話題' },
    other: { name: 'その他', description: 'その他の佐賀県スポーツに関する話題' }
  };
  
  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      
      const q = query(
        collection(db, 'threads'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const threadList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setThreads(threadList);
      setLoading(false);
    };
    
    fetchThreads();
  }, [category]);
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <ThreadListContainer>
      <CategoryHeader>
        <CategoryTitle>{categoryInfo[category]?.name || category}</CategoryTitle>
        <CategoryDescription>
          {categoryInfo[category]?.description || '佐賀県のスポーツに関する話題'}
        </CategoryDescription>
      </CategoryHeader>
      
      <CreateButton to="/create-thread">新しいスレッドを作成</CreateButton>
      
      {loading ? (
        <p>読み込み中...</p>
      ) : threads.length > 0 ? (
        <ThreadsContainer>
          {threads.map(thread => (
            <Thread key={thread.id} to={`/thread/${thread.id}`}>
              <ThreadTitle>{thread.title}</ThreadTitle>
              <ThreadMeta>
                <span>作成者: {thread.authorName || '匿名'}</span>
                <span>返信: {thread.replyCount || 0}</span>
                <span>作成日: {formatDate(thread.createdAt)}</span>
              </ThreadMeta>
            </Thread>
          ))}
        </ThreadsContainer>
      ) : (
        <NoThreads>
          <p>このカテゴリにはまだスレッドがありません。</p>
          <p>最初のスレッドを作成しましょう！</p>
        </NoThreads>
      )}
    </ThreadListContainer>
  );
}

export default ThreadList; 