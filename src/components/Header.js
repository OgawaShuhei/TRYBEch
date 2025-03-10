import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #00A3E7;
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    background-color: #00A3E7;
    flex-direction: column;
    padding: 1rem 0;
    gap: 0;

    ${props => props.isOpen && `
      display: flex;
    `}
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
  
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const CategoryDropdown = styled.div`
  position: relative;
  display: inline-block;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  min-width: 180px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
  z-index: 1000;

  @media (max-width: 768px) {
    position: static;
    display: ${props => props.isOpen ? 'block' : 'none'};
    box-shadow: none;
    border-radius: 0;
    background-color: rgba(255, 255, 255, 0.1);
    transform: none;
    width: 100%;
  }

  ${CategoryDropdown}:hover & {
    @media (min-width: 769px) {
      display: block;
    }
  }
`;

const DropdownLink = styled(Link)`
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e6f7ff;
    color: #00A3E7;
  }

  @media (max-width: 768px) {
    color: white;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categories = [
    { id: 'soccer', name: 'サッカー' },
    { id: 'baseball', name: '野球' },
    { id: 'basketball', name: 'バスケットボール' },
    { id: 'volleyball', name: 'バレーボール' },
    { id: 'beginner', name: '初心者必見' },
    { id: 'training', name: '選手の練習メニュー' },
    { id: 'other', name: 'その他' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsCategoryOpen(false);
  };

  const toggleCategory = (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setIsCategoryOpen(!isCategoryOpen);
    }
  };
  
  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">TRYBE</Logo>
        
        <MenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>ホーム</NavLink>
          
          <CategoryDropdown>
            <NavLink as="span" style={{ cursor: 'pointer' }} onClick={toggleCategory}>
              カテゴリー {isCategoryOpen ? '▾' : '▸'}
            </NavLink>
            <DropdownContent isOpen={isCategoryOpen}>
              {categories.map(category => (
                <DropdownLink 
                  key={category.id} 
                  to={`/category/${category.id}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsCategoryOpen(false);
                  }}
                >
                  {category.name}
                </DropdownLink>
              ))}
            </DropdownContent>
          </CategoryDropdown>
          
          <NavLink to="/create-thread" onClick={() => setIsMenuOpen(false)}>
            スレッド作成
          </NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default memo(Header); 