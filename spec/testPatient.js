'use strict';
const chai = require('chai')
const should = chai.should();
const supertest = require('supertest');

const api = supertest('http://localhost:3000')

const mockPatientsData = require('./mockPatientsData');

// TODO WARNING VERY DANGEROUS
describe('DELETE /api/patients/deleteAll', () => {
	it('should delete all users', (done) => {
		api.delete('/api/patients/deleteAll')
			.set('Accept', 'application/json')
			.expect(200)
			.end((err, res) => {
				console.log(res.body);
				done();
			})
	})
})

let userIds = [];
describe('POST /api/patient', (done) => {
	it('should create a user', (done) => {
		api.post('/api/patient')
			.set('Accept', 'application/json')
			// TODO iterate through all patients
			.send(mockPatientsData[0])
			.expect(200)
			.end((err, res) => {
				let id = res.body;
				userIds.push(id);
				done();
			})
	})
})

describe('GET /api/patients', () => {
	it('should list all users', (done) => {
		api.get('/api/patients')
			.set('Accept', 'application/json')
			.expect(200)
			.end((err, res) => {
				let users = res.body;
				for (let user of users) {
					console.log(user);
					user['_id'].should.include(userIds);
				}
				done();
			})
	})

})
