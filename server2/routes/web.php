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

$router->group(['prefix' => 'api'], function () use ($router) {
  $router->get('books',  ['uses' => 'BookController@showBooks']);

  $router->get('books/{id}', ['uses' => 'BookController@showOneBook']);

  $router->post('books', ['uses' => 'BookController@create']);

  $router->delete('books/{id}', ['uses' => 'BookController@delete']);

  $router->put('books/{id}', ['uses' => 'BookController@update']);
});

$router->group(['prefix' => 'api'], function () use ($router) {
    
  $router->get('users/{user_id}/cart', ['uses' => 'UserController@showCart']);
  $router->post('users/{user_id}/cart/{book_id}', ['uses' => 'UserController@addToCart']);
  $router->delete('users/{user_id}/cart/{cart_item_id}', ['uses' => 'UserController@delCartItem']);
  
  $router->get('users/{user_id}/profile', ['uses' => 'UserController@showProfile']);
  $router->post('users/{user_id}/profile', ['uses' => 'UserController@createProfile']);
  $router->put('users/{user_id}/profile', ['uses' => 'UserController@updateProfile']);

  $router->get('users/{user_id}/transactions', ['uses' => 'UserController@showTransaction']);
  $router->post('users/{user_id}/checkout', ['uses' => 'UserController@checkout']);
});

$router->group(['prefix' => 'api'], function () use ($router) {

  $router->post('auth/signup', ['uses' => 'AuthController@signup']);
  $router->post('auth/signin', ['uses' => 'AuthController@signin']);


});

$router->group(['prefix' => 'api'], function () use ($router) {
  $router->get('reviews/{book_id}/{limit}/{offset}',  ['uses' => 'ReviewController@showReviews']);
  $router->post('reviwes', ['uses' => 'BookController@createReviews']);

  // $router->delete('reviews/{review_id}', ['uses' => 'BookController@delete']);

  // $router->put('reviews/{review_id}', ['uses' => 'BookController@update']);
});