import {environment} from '../../environments/environment';


export class Urls {
  static base = environment.apiUrl + 'ecommerce/api/';
  static login = Urls.base + 'login.php';

  static product = Urls.base + 'getProducts.php';
  static upload_product_image = Urls.base + 'addSlide.php';
  static add_product = Urls.base + 'addProducts.php';

  static get_slider = Urls.base + 'getSlides.php';

  static add_slider = Urls.base + 'addSlide.php';
}
