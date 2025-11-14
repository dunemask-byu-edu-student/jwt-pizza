import { sleep, check, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

const fakeAccount = "d@jwt.com";
const fakePassword = "diner";

export const options = {
  cloud: {
    distribution: { 'amazon:us:columbus': { loadZone: 'amazon:us:columbus', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    buy_a_pizza: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 20, duration: '10s' },
        { target: 50, duration: '25s' },
        { target: 0, duration: '1s' },
      ],
      gracefulRampDown: '30s',
      exec: 'buy_a_pizza',
    },
  },
}

export function buy_a_pizza() {
  let response
  const vars = {}

  // Logging In
  response = http.put(
    'https://api.pizza.dunemask.org/api/auth',
    `{"email":"${fakeAccount}","password":"${fakePassword}"}`,
    {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        origin: 'https://pizza.dunemask.org',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="142", "Microsoft Edge";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    }
  )

  // Assert the login response is 200
  check(response, {
    'login status code is 200': (r) => r.status === 200,
  }) || fail('Login failed with status ' + response.status);

  vars['token'] = jsonpath.query(response.json(), '$.token')[0];
  const authHeader = {Authorization: `Bearer ${vars['token']}`};

  sleep(2)

  // Get Menu
  response = http.get('https://api.pizza.dunemask.org/api/order/menu', {
    headers: {
      ...authHeader,
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'if-none-match': 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
      origin: 'https://pizza.dunemask.org',
      priority: 'u=1, i',
    },
  })

  // List Stores
  response = http.get('https://api.pizza.dunemask.org/api/franchise?page=0&limit=20&name=*', {
    headers: {
        ...authHeader,
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'if-none-match': 'W/"5c-UrU6FPurLC0JcnOrzddwdfUXFBA"',
      origin: 'https://pizza.dunemask.org',
      priority: 'u=1, i',
    },
  })
  sleep(2)

  // Get Me
  response = http.get('https://api.pizza.dunemask.org/api/user/me', {
    headers: {
        ...authHeader,
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'if-none-match': 'W/"57-MSn6bIfZMcZQ32gHPxRho40KZaE"',
      origin: 'https://pizza.dunemask.org',
      priority: 'u=1, i',
    },
  })
  sleep(1)

  // Buying the pizza
  response = http.post(
    'https://api.pizza.dunemask.org/api/order',
    '{"items":[{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1}',
    {
      headers: {
          ...authHeader,
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        origin: 'https://pizza.dunemask.org',
        priority: 'u=1, i',
      },
    }
  )

  // Assert the purchase response is 200
  check(response, {
    'purchase status code is 200': (r) => r.status === 200,
  }) || fail('Purchase failed with status ' + response.status);

  vars['jwt'] = jsonpath.query(response.json(), '$.jwt')[0];

  // Verify the pizza
  sleep(3);
  response = http.post(
    'https://pizza-factory.cs329.click/api/order/verify',
    `{"jwt": "${vars['jwt']}"}`,
    {
      headers: {
          ...authHeader,
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        origin: 'https://pizza.dunemask.org',
        priority: 'u=1, i',
      },
    }
  )
}
