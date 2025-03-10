import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Header from '../components/Header';

const CreateThreadContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f6fa;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const SubmitButton = styled.button`
  background-color: #2ecc71;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #27ae60;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin: 0;
  font-size: 0.9rem;
`;

function CreateThread() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'soccer', name: 'サッカー' },
    { id: 'baseball', name: '野球' },
    { id: 'basketball', name: 'バスケットボール' },
    { id: 'volleyball', name: 'バレーボール' },
    { id: 'beginner', name: '初心者必見' },
    { id: 'training', name: '選手の練習メニュー' },
    { id: 'other', name: 'その他' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      setError('すべての項目を入力してください。');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const threadData = {
        title: title.trim(),
        content: content.trim(),
        category,
        authorName: '名無しさん',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        replyCount: 0
      };

      const docRef = await addDoc(collection(db, 'threads'), threadData);
      
      if (!docRef.id) {
        throw new Error('スレッドの作成に失敗しました');
      }

      console.log('Created thread with ID:', docRef.id);
      navigate(`/category/${category}`);
      
      alert('スレッドを作成しました！');
    } catch (error) {
      console.error('Error creating thread:', error);
      setError('スレッドの作成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CreateThreadContainer>
      <Header />
      <MainContent>
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="category">カテゴリー</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">カテゴリーを選択</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="スレッドのタイトルを入力"
                required
                maxLength={100}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="content">本文</Label>
              <TextArea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="スレッドの本文を入力"
                required
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '作成中...' : 'スレッドを作成'}
            </SubmitButton>
          </Form>
        </FormContainer>
      </MainContent>
    </CreateThreadContainer>
  );
}

export default CreateThread; 