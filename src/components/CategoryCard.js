import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CardContainer = styled(Link)`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
  display: block;
  border: 1px solid #e1e8ed;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-decoration: none;
    color: inherit;
    border-color: #00A3E7;
  }
`;

const CategoryName = styled.h3`
  font-size: 1.3rem;
  margin: 0 0 0.8rem 0;
  color: #2c3e50;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '#';
    color: #00A3E7;
    font-weight: bold;
  }
`;

const CategoryDescription = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

function CategoryCard({ category }) {
  return (
    <CardContainer to={`/category/${category.id}`}>
      <CategoryName>{category.name}</CategoryName>
      <CategoryDescription>{category.description}</CategoryDescription>
    </CardContainer>
  );
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired
};

export default CategoryCard; 