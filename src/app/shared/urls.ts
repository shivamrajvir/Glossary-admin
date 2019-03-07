import {environment} from '../../environments/environment';


export class Urls {
  static base = environment.apiUrl + 'ecommerce/api/';
  static login = Urls.base + 'login.php';
  static signup = Urls.base + 'register.php';
}
