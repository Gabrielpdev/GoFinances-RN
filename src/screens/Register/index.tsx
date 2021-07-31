import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Keyboard, 
  Modal, 
  TouchableWithoutFeedback,
  Alert
 } from 'react-native';
import uuid from 'react-native-uuid';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { InputForm } from '../../components/Forms/InputForm';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsType
 } from './styles';
import { useAuth } from '../../hooks/auth';

 interface FormData {
   name: string;
   price: number;
 }

 const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  price: Yup
  .number()
  .typeError('Informe um valor numerico')
  .positive('O valor não pode ser negativo')
  .required('O valor é obrigatório')
 })

export function Register({ navigation }){
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const { user } = useAuth();

  const [ transactionType, setTransactionType ] = useState('');
  const [ categoryModalOpen, setCategoryModalOpen ] = useState(false);


  const [ category, setCategory ] = useState({
    key: 'category',
    name: 'Categoria',
    icon: null
  });

  function handleTransactionTypeSelect(type: 'positive' | 'negative'){
    setTransactionType(type)
  }

  function handleCloseSelectCategory(){
    setCategoryModalOpen(false)
  }

  function handleOpenModalSelectCategory(){
    setCategoryModalOpen(true)
  }

  async function handleRegister(form: FormData){
    if(!transactionType){
      return Alert.alert('Selecione o tipo da transação.')
    }

    if(category.key === 'category'){
      return Alert.alert('Selecione a categoria.')
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      price: form.price,
      transactionType,
      category: category.key,
      date: new Date()
    }

    try{
      const dataKey = `@goFinances:transactions_user:${user.id}`;

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria',
        icon: null
      })

      navigation.navigate('Listagem')
    }catch(error){
      console.log(error);
      Alert.alert("Não foi possível salvar")
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
      <Container>
        <Header>
          <Title>Cadastro</Title>

        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name="name"
              placeholder="Nome"
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              control={control}
              name="price"
              placeholder="Preço"
              keyboardType='numeric'
              error={errors.price && errors.price.message}
            />

          <TransactionsType>
            <TransactionTypeButton 
              title="Entrada"
              type="positive"
              onPress={() => {handleTransactionTypeSelect('positive')}}
              isActive={transactionType === 'positive'}
            />

            <TransactionTypeButton 
              title="Saida"
              type="negative"
              onPress={() => {handleTransactionTypeSelect('negative')}}
              isActive={transactionType === 'negative'}
            />
          </TransactionsType>

          <CategorySelectButton
            icon={category.icon}
            title={category.name}
            onPress={handleOpenModalSelectCategory}
          />
          </Fields>

          <Button 
            title='Enviar'
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            closeSelectCategory={handleCloseSelectCategory}
            setCategory={setCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}