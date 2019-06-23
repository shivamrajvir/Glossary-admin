import {environment} from '../../environments/environment';


export class Urls {
  static base = environment.apiUrl + 'ecommerce/api/';
  static login = Urls.base + 'login.php';

  static stats = Urls.base + 'getCount.php';
  static dailyOrder = Urls.base + 'dayWiseMasterOrder.php';

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

  static get_states = Urls.base + 'getStates.php';
  static add_state = Urls.base + 'addState.php';
  static change_state_status = Urls.base + 'changeStateStatus.php';

  static get_cities = Urls.base + 'getCities.php';
  static add_city = Urls.base + 'addCity.php';
  static change_city_status = Urls.base + 'changeCityStatus.php';

  static get_notification = Urls.base + 'getNotifications.php';
  static add_notification = Urls.base + 'addNotifications.php';
  static edit_notification = Urls.base + 'editNotification.php';
  static delete_notification = Urls.base + 'deleteNotification.php';

  static get_subcategories = Urls.base + 'subcatNew.php';
  static changeSubCatStatus = Urls.base + 'changeSubcatStatus.php';
  static add_subcategories = Urls.base + 'addSubCategories.php';
  static edit_subcategories = Urls.base + 'editSubCategories.php';


  static add_subcat_details = Urls.base + 'addSubCatDetails.php';
  static edit_subcat_details = Urls.base + 'editSubCatDetails.php';
  static change_subcat_details = Urls.base + 'changeSubQuantityStatus.php';

  static get_units = Urls.base + 'getUnits.php';

  static add_unit = Urls.base + 'addUnit.php';

  static change_unit_status = Urls.base + 'changeUnitStatus.php';

  static get_users = Urls.base + 'getUsers.php';
  static change_user_status = Urls.base + 'changeUserStatus.php';

  static transaction_history = Urls.base + '';

  static user_orders = Urls.base + 'getMasterOrders.php';

  static user_cart = Urls.base + 'getCart.php';
  static cart_balance = Urls.base + 'getWallet.php';
  static wallet_balance = Urls.base + 'getCurrentWalletBalance.php';
  static edit_wallet_balance = Urls.base + 'updateBalance.php';

  static get_orders = Urls.base + 'getOrder.php';

  static complete_order = Urls.base + 'completeStatusOrder.php';

  static getCancelReason = Urls.base + 'getCancellationReason.php';
  static addCancelReason = Urls.base + 'addCancellationReason.php';
  static changeCancelReason = Urls.base + 'changeStatusCancellation.php';

}
