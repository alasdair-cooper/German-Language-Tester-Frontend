/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var express = require('express');
var request = require('supertest');

var app = require('../app');

describe('Test the data functionality', () => {
  test('GET /data/chapters succeeds', () => {
    return request(app).get('/data/chapters?book=a1').set('ApiAccessKey', 300).expect(200);
  });
  test('GET /data/chapters returns JSON', () => {
    return request(app).get('/data/chapters?book=a1').set('ApiAccessKey', 300).expect('Content-Type', 'application/json; charset=utf-8');
  });
  test('GET /data/words succeeds', () => {
    return request(app).get('/data/words?book=a1&chapter=1').set('ApiAccessKey', 300).expect(200);
  });
  test('GET /data/words returns JSON', () => {
    return request(app).get('/data/words?book=a1&chapter=1').set('ApiAccessKey', 300).expect('Content-Type', 'application/json; charset=utf-8');
  });
});
