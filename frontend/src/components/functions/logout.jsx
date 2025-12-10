import { deleteCookie } from 'cookies-next';

export async function logout() {
  deleteCookie('token');
  deleteCookie('id_user');
  deleteCookie('id_funcao');
  deleteCookie('id_filial');
  deleteCookie('nome');

  localStorage.removeItem('carrinho');

  return window.location.replace('/');
}
