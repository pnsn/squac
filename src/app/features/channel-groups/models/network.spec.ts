import { TestBed } from '@angular/core/testing';
import { ApiGetNetwork, Network, NetworkAdapter } from './network';

describe('Network', () => {
  let adapter: NetworkAdapter;
  it('should create an instance', () => {
    expect(new Network(
      'code',
      'name',
      'description'
    )).toBeTruthy();
  });

  it('should adapt api json to Network', ()=> {
    adapter = TestBed.inject(NetworkAdapter);

    let testData : ApiGetNetwork = {
      class_name: "class",
      code: "code",
      name: "testName",
      url: "url",
      description: "string",
      created_at: "string",
      updated_at: "string",
      user_id: "1"
    }

    const network = adapter.adaptFromApi(testData);
    expect(network).toBeDefined();
    expect(network.name).toBe("testName");
  });

});
