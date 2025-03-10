import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Header from '../components/Header';

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f6fa;
`;

const PageHeader = styled.header`
  background-color: #3498db;
  color: white;
  padding: 3rem 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SubTitle = styled.p`
  margin: 1rem 0 0;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TrybeButton = styled.a`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background-color: #fff;
  color: #3498db;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const Section = styled.section`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #00A3E7;
  padding-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;

const StyledThreadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 0.8rem;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 0.8rem;
  }
`;

const ThreadCard = lazy(() => import('../components/ThreadCard'));
const CategoryCard = lazy(() => import('../components/CategoryCard'));

function Home() {
  const [recentThreads, setRecentThreads] = useState([]);
  const [popularThreads, setPopularThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchRecentThreads = useCallback(async () => {
    const q = query(
      collection(db, 'threads'),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }, []);
  
  const fetchPopularThreads = useCallback(async () => {
    const q = query(
      collection(db, 'threads'),
      orderBy('replyCount', 'desc'),
      limit(6)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }, []);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [recent, popular] = await Promise.all([
          fetchRecentThreads(),
          fetchPopularThreads()
        ]);
        
        setRecentThreads(recent);
        setPopularThreads(popular);
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchRecentThreads, fetchPopularThreads]);
  
  const categories = [
    { id: 'soccer', name: 'サッカー', description: '佐賀県のサッカーに関する話題' },
    { id: 'baseball', name: '野球', description: '佐賀県の野球に関する話題' },
    { id: 'basketball', name: 'バスケットボール', description: '佐賀県のバスケに関する話題' },
    { id: 'volleyball', name: 'バレーボール', description: '佐賀県のバレーに関する話題' },
    { id: 'beginner', name: '初心者必見', description: 'スポーツ初心者向けの情報や質問' },
    { id: 'training', name: '選手の練習メニュー', description: '実践的な練習メニューの共有と相談' },
    { id: 'other', name: 'その他', description: 'その他の佐賀県スポーツに関する話題' }
  ];
  
  return (
    <HomeContainer>
      <Header />
      <PageHeader>
        <Title>TRYBE - 佐賀スポーツ掲示板</Title>
        <SubTitle>佐賀県のスポーツに関する情報交換の場</SubTitle>
        <TrybeButton href="https://trybe-9850d.web.app/" target="_blank" rel="noopener noreferrer">
          TRYBEスポーツコミュニティへ移動
        </TrybeButton>
      </PageHeader>
      
      <Section>
        <SectionTitle>最新スレッド</SectionTitle>
        <StyledThreadGrid>
          {isLoading ? (
            <LoadingContainer>読み込み中...</LoadingContainer>
          ) : (
            <Suspense fallback={<LoadingContainer>読み込み中...</LoadingContainer>}>
              {recentThreads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </Suspense>
          )}
        </StyledThreadGrid>
      </Section>
      
      <Section>
        <SectionTitle>人気スレッド</SectionTitle>
        <StyledThreadGrid>
          {isLoading ? (
            <LoadingContainer>読み込み中...</LoadingContainer>
          ) : (
            <Suspense fallback={<LoadingContainer>読み込み中...</LoadingContainer>}>
              {popularThreads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </Suspense>
          )}
        </StyledThreadGrid>
      </Section>
      
      <Section>
        <SectionTitle>カテゴリ</SectionTitle>
        <CategoryGrid>
          <Suspense fallback={<LoadingContainer>読み込み中...</LoadingContainer>}>
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </Suspense>
        </CategoryGrid>
      </Section>
    </HomeContainer>
  );
}

export default Home; 