/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var express = require('express');
var request = require('supertest');

var app = require('../app');

describe('Test the define functionality', () => {
  test('GET /define succeeds', () => {
    return request(app).get('/define?text=dog&lang=en').expect(200);
  });
  test('GET /define returns text', () => {
    return request(app).get('/define?text=dog&lang=en').expect('Content-Type', 'text/html; charset=utf-8');
  });
});
