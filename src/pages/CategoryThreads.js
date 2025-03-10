import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Header';

const CategoryContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f6fa;
`;

const PageHeader = styled.header`
  background-color: #3498db;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
`;

const ThreadsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ThreadList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
`;

const CreateButton = styled(Link)`
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ThreadCard = lazy(() => import('../components/ThreadCard'));

const categoryNames = {
  soccer: 'サッカー',
  baseball: '野球',
  basketball: 'バスケットボール',
  volleyball: 'バレーボール',
  beginner: '初心者必見',
  training: '選手の練習メニュー',
  other: 'その他'
};

function CategoryThreads() {
  const { categoryId } = useParams();
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      if (!categoryId) {
        console.error('カテゴリーIDが指定されていません');
        setIsLoading(false);
        return;
      }

      console.log('カテゴリーの取得開始:', categoryId);
      setIsLoading(true);

      try {
        const threadsRef = collection(db, 'threads');
        console.log('クエリの作成:', categoryId);
        
        const q = query(
          threadsRef,
          where('category', '==', categoryId)
        );

        console.log('データの取得開始');
        const querySnapshot = await getDocs(q);
        console.log('取得完了, ドキュメント数:', querySnapshot.size);

        const threadsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('ドキュメントデータ:', data);
          return {
            id: doc.id,
            ...data
          };
        });
        
        // タイムスタンプでソート
        threadsData.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          if (!a.createdAt.seconds || !b.createdAt.seconds) {
            console.warn('タイムスタンプが不正:', { a: a.createdAt, b: b.createdAt });
            return 0;
          }
          return b.createdAt.seconds - a.createdAt.seconds;
        });
        
        console.log('ソート完了:', threadsData);
        setThreads(threadsData);
      } catch (error) {
        console.error('スレッド取得エラー:', error);
        setThreads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [categoryId]);

  // カテゴリーIDが無効な場合のチェック
  if (!categoryNames[categoryId]) {
    return (
      <CategoryContainer>
        <Header />
        <PageHeader>
          <Title>無効なカテゴリー</Title>
        </PageHeader>
        <ThreadsContainer>
          <EmptyState>
            <EmptyMessage>
              指定されたカテゴリーは存在しません。
            </EmptyMessage>
            <CreateButton to="/">
              ホームに戻る
            </CreateButton>
          </EmptyState>
        </ThreadsContainer>
      </CategoryContainer>
    );
  }

  return (
    <CategoryContainer>
      <Header />
      <PageHeader>
        <Title>{categoryNames[categoryId] || 'カテゴリー'} スレッド一覧</Title>
      </PageHeader>

      <ThreadsContainer>
        {isLoading ? (
          <LoadingContainer>読み込み中...</LoadingContainer>
        ) : threads.length > 0 ? (
          <ThreadList>
            <Suspense fallback={<LoadingContainer>読み込み中...</LoadingContainer>}>
              {threads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </Suspense>
          </ThreadList>
        ) : (
          <EmptyState>
            <EmptyMessage>
              まだスレッドがありません。最初のスレッドを作成しましょう！
            </EmptyMessage>
            <CreateButton to="/create-thread">
              スレッドを作成する
            </CreateButton>
          </EmptyState>
        )}
      </ThreadsContainer>
    </CategoryContainer>
  );
}

export default CategoryThreads; 