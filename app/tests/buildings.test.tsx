// tests/buildings.test.ts
import request from 'supertest';

describe('Buildings API', () => {
  const baseUrl = 'http://localhost:3000/api/buildings';

  it('should retrieve all buildings', async () => {
    const res = await request(baseUrl).get('/');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('buildings'); // Adjust based on your API response structure
  });

  it('should create a new building', async () => {
    const newBuilding = { name: 'New Building', address: '123 Main St' };
    
    const res = await request(baseUrl)
      .post('/')
      .send(newBuilding);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newBuilding.name);
  });

  it('should update an existing building', async () => {
    const updateData = { name: 'Updated Building Name' };
    const buildingId = 1; // Replace with an existing building ID

    const res = await request(baseUrl)
      .put(`/${buildingId}`)
      .send(updateData);
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updateData.name);
  });

  it('should delete a building', async () => {
    const buildingId = 1; // Replace with an existing building ID

    const res = await request(baseUrl).delete(`/${buildingId}`);
    
    expect(res.status).toBe(204); // No content for successful deletion
  });
});
