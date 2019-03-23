import {environment} from '../../environments/environment';


export class Urls {
  static base = environment.apiUrl + 'ecommerce/api/';
  static login = Urls.base + 'login.php';

  static stats = Urls.base + 'getCount.php';

  static product = Urls.base + 'getProducts.php';
  static upload_product_image = Urls.base + 'upload.php';
  static add_product = Urls.base + 'addProducts.php';
  static edit_product = Urls.base + 'editProducts.php';
  static changeStatus_product = Urls.base + 'changeProductStatus.php';

  static get_slider = Urls.base + 'getSlides.php';
  static add_slider = Urls.base + 'addSlide.php';
  static delete_slidder = Urls.base + 'deleteSlides.php';

  static add_category = Urls.base + 'addCategories.php';
  static edit_category = Urls.base + 'editCategories.php';
  static get_category = Urls.base + 'getCategories.php';
  static changeStatus_category = Urls.base + 'changeCategoryStatus.php';
}
