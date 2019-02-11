<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api/books'], function () use ($router) {
  $router->get('/',  ['uses' => 'BookController@showBooks']);

  $router->get('{book_id}', ['uses' => 'BookController@showOneBook']);

  $router->post('/', ['uses' => 'BookController@create']);

  $router->delete('/{book_id}', ['uses' => 'BookController@delete']);

  $router->put('/{book_id}', ['uses' => 'BookController@update']);
  
  $router->get('/{book_id}/reviews',  ['uses' => 'ReviewController@showReviews']);
  $router->post('/{book_id/reviews', ['uses' => 'BookController@createReviews']);
});

$router->group(['middleware' => 'auth', 'prefix' => 'api/users'], function () use ($router) {
    
  $router->get('/{user_id}/cart', ['uses' => 'UserController@showCart']);
  $router->post('/{user_id}/cart/{book_id}', ['uses' => 'UserController@addToCart']);
  $router->delete('/{user_id}/cart/{cart_item_id}', ['uses' => 'UserController@delCartItem']);
  
  $router->get('/{user_id}/profile', ['uses' => 'UserController@showProfile']);
  $router->post('/{user_id}/profile', ['uses' => 'UserController@createProfile']);
  $router->put('/{user_id}/profile', ['uses' => 'UserController@updateProfile']);

  $router->get('/{user_id}/transactions', ['uses' => 'UserController@showTransaction']);
  $router->post('/{user_id}/checkout', ['uses' => 'UserController@checkout']);
});

$router->group(['prefix' => 'api/auth'], function () use ($router) {

  $router->post('/signup', ['uses' => 'AuthController@signup']);
  $router->post('/signin', ['uses' => 'AuthController@signin']);


});

