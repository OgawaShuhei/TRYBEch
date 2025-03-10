import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CardContainer = styled(Link)`
  display: block;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
  border: 1px solid #eee;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.8rem 0;
  color: #2c3e50;
`;

const Meta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const ThreadCard = ({ thread }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    // Firestoreのタイムスタンプオブジェクトの場合
    if (timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // 通常のDate型の場合
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <CardContainer to={`/category/${thread.category}/thread/${thread.id}`}>
      <Title>{thread.title}</Title>
      <Meta>
        <span>カテゴリ: {thread.category}</span>
        <span>返信: {thread.replyCount || 0}</span>
        {thread.createdAt && <span>作成: {formatDate(thread.createdAt)}</span>}
      </Meta>
    </CardContainer>
  );
};

ThreadCard.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    replyCount: PropTypes.number,
    createdAt: PropTypes.string
  }).isRequired
};

// memoでコンポーネントをメモ化して不要な再レンダリングを防止
export default memo(ThreadCard); 