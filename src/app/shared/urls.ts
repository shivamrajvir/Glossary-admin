import {environment} from '../../environments/environment';


export class Urls {
  static base = environment.apiUrl + 'ecommerce/api/';
  static login = Urls.base + 'login.php';

  static product = Urls.base + 'getProducts.php';
  static upload_product_image = Urls.base + 'upload.php';
  static add_product = Urls.base + 'addProducts.php';
}
