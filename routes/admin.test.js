/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var express = require('express');
var request = require('supertest');

var app = require('../app');

describe('Test the admin functionality', () => {
  test('GET /admin/sessions succeeds', () => {
    return request(app).get('/admin/sessions').set({ ApiAccessKey: '300', ApiAdminKey: '123456789' }).expect(200);
  });
  test('GET /admin/sessions returns JSON', () => {
    return request(app).get('/admin/sessions').set({ ApiAccessKey: '300', ApiAdminKey: '123456789' }).expect('Content-Type', 'application/json; charset=utf-8');
  });
  test('GET /admin/users succeeds', () => {
    return request(app).get('/admin/users').set({ ApiAccessKey: '300', ApiAdminKey: '123456789' }).expect(200);
  });
  test('GET /admin/users returns JSON', () => {
    return request(app).get('/admin/users').set({ ApiAccessKey: '300', ApiAdminKey: '123456789' }).expect('Content-Type', 'application/json; charset=utf-8');
  });
});
