/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var express = require('express');
var request = require('supertest');

var app = require('../app');

describe('Test the define functionality', () => {
  test('GET /translate succeeds', () => {
    return request(app).get('/translate?text=dog&from=en&to=de').set('ApiAccessKey', 300).expect(200);
  });
  test('GET /translate returns JSON', () => {
    return request(app).get('/translate?text=dog&from=en&to=de').set('ApiAccessKey', 300).expect('Content-Type', 'application/json; charset=utf-8');
  });
});
