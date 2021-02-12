/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var express = require('express');
var request = require('supertest');

var app = require('../app');

describe('Test the user handling functionality', () => {
  test('POST /users/create succeeds', () => {
    return request(app).post('/users/create').send({ email: Date.now() + '@test.com', password: 'test' }).expect(200);
  });
  test('POST /users/login succeeds', () => {
    return request(app).post('/users/login').send({ email: 'jest@test.com', password: 'test' }).expect(200);
  });
  test('POST /users/login returns text', () => {
    return request(app).post('/users/login').send({ email: 'jest@test.com', password: 'test' }).expect('Content-Type', 'text/html; charset=utf-8');
  });
});

describe('Test the scoring functionality', () => {
  test('GET /users/score/download succeeds', () => {
    return request(app).get('/users/score/download').set('ApiAccessKey', 300).expect(200);
  });
  test('GET /users/score/download returns JSON', () => {
    return request(app).get('/users/score/download').set('ApiAccessKey', 300).expect('Content-Type', 'application/json; charset=utf-8');
  });
  test('POST /users/score/upload succeeds', () => {
    return request(app).post('/users/score/upload').send({ retention: {}, score: {}, settings: {} }).set('ApiAccessKey', 300).expect(204);
  });
});

describe('Test the image functionality', () => {
  test('GET /users/icon/download succeeds', () => {
    return request(app).get('/users/icon/download').set('ApiAccessKey', 300).expect(200);
  });
});
