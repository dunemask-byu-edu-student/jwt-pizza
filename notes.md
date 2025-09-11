# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| **User Activity**                                                   | **Frontend Component**                                                                            | **Backend Endpoints**                                          | **Database SQL**                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View home page                                                      | `src/views/home.tsx`, served at path `/`                                                          | N/A                                                            | N/A                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Register new user ([t@jwt.com](mailto:t@jwt.com), pw: test)         | `src/views/register.tsx`, served at path `/register /:subpath/register`                           | `POST /api/auth`                                               | `INSERT INTO user (name, email, password) VALUES (?, ?, ?);`<br/>`INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?);`<br/>`INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token`                                                                                                                                                                                                   |
| Login new user ([t@jwt.com](mailto:t@jwt.com), pw: test)            | `src/views/login.tsx`, served at path `/login or /:subpath/login`                                 | `PUT /api/auth`                                                | `SELECT * FROM user WHERE email=?;`<br/>`SELECT * FROM userRole WHERE userId=?;`<br/>`INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token;`                                                                                                                                                                                                                                                    |
| Order pizza                                                         | `src/views/menu.tsx`, served at path `/menu` & `src/views/payment.tsx`, served at path `/payment` | `POST /api/order`                                              | `INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now());`<br/>`INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?)`                                                                                                                                                                                                                                                 |
| Verify pizza                                                        | `src/views/delivery.tsx` id `hs-jwt-modal`, served at path `/delivery`                            | `POST /api/order/verify`                                       | N/A                                                                                                                                                                                                                                                                                                                                                                                                                           |
| View profile page                                                   | `src/views/dinerDashboard.tsx`, served at `/diner-dashboard`                                      | `GET /api/order`                                               | `SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT 0,10;`<br/>`SELECT id, menuId, description, price FROM orderItem WHERE orderId=?`                                                                                                                                                                                                                                                                |
| View franchise (as diner)                                           | `src/views/franchiseDashboard.tsx`, served at `/franchise-dashboard`                              | `GET /api/franchise/:franchiseId`                              | `SELECT userId FROM auth WHERE token=?;`<br/>`SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?`                                                                                                                                                                                                                                                                                                             |
| Logout                                                              | `src/views/logout.tsx`, served at path `/logout or /:subpath/logout`                              | `DELETE /api/auth`                                             | `SELECT userId FROM auth WHERE token=?;`<br/>`DELETE FROM auth WHERE token=?`                                                                                                                                                                                                                                                                                                                                                 |
| View About page                                                     | `src/about.tsx`, served at path `/about`                                                          | N/A                                                            | N/A                                                                                                                                                                                                                                                                                                                                                                                                                           |
| View History page                                                   | `src/history.tsx`, served at path `/history`                                                      | N/A                                                            | N/A                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Login as franchisee ([f@jwt.com](mailto:f@jwt.com), pw: franchisee) | `src/views/login.tsx`, served at path `/login or /:subpath/login`                                 | `PUT /api/auth`                                                | `SELECT * FROM user WHERE email=?;`<br/>`SELECT * FROM userRole WHERE userId=?;`<br/>`INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token;`                                                                                                                                                                                                                                                    |
| View franchise (as franchisee)                                      | `src/views/franchiseDashboard.tsx`, served at `/franchise-dashboard`                              | `GET /api/franchise/:franchiseId`                              | `SELECT id, name FROM franchise WHERE id in (1);`<br/>`SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee';`<br/>`SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id`                     |
| Create a store                                                      | `src/views/createStore.tsx`, served at `/franchise-dashboard/create-store`                        | `POST /api/franchise/:franchiseId/store`                       | `SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id;`<br/>`INSERT INTO store (franchiseId, name) VALUES (?, ?)`                                                                                                                                                      |
| Close a store                                                       | `src/views/closeStore.tsx`, served at `/franchise-dashboard/close-store`                          | `DELETE /api/franchise/:franchiseId/store/:storeId`            | `DELETE FROM store WHERE franchiseId=? AND id=?`                                                                                                                                                                                                                                                                                                                                                                              |
| Login as admin ([a@jwt.com](mailto:a@jwt.com), pw: admin)           | `src/views/login.tsx`, served at path `/login or /:subpath/login`                                 | `PUT /api/auth`                                                | `SELECT * FROM user WHERE email=?;`<br/>`SELECT * FROM userRole WHERE userId=?;`<br/>`INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token;`                                                                                                                                                                                                                                                    |
| View Admin page                                                     | `src/views/adminDashboard.tsx`, served at `/admin-dashboard`                                      | `GET /api/franchise?page=:pageNumber&limit=:limitNumber&name=` | `SELECT id, name FROM franchise WHERE name LIKE ? LIMIT 31 OFFSET 0;`<br/>`SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee';`<br/>`SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id` |
| Create a franchise for [t@jwt.com](mailto:t@jwt.com)                | `src/views/createFranchise.tsx`, served at `/admin-dashboard/create-franchise`                    | `POST /api/franchise`                                          | `SELECT userId FROM auth WHERE token=?;`<br/>`SELECT id, name FROM user WHERE email=?;`<br/>`INSERT INTO franchise (name) VALUES (?);`<br/>`INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)`                                                                                                                                                                                                                   |
| Close the franchise for [t@jwt.com](mailto:t@jwt.com)               | `src/views/closeFranchise.tsx`, served at `/admin-dashboard/close-franchise`                      | `DELETE /api/franchise/:franchiseId`                           | `DELETE FROM store WHERE franchiseId=?;`<br/>`DELETE FROM userRole WHERE objectId=?;`<br/>`DELETE FROM franchise WHERE id=?`                                                                                                                                                                                                                                                                                                  |

Raw JSON:

```json
[
  {
    "userActivity": "View home page",
    "frontendComponent": "src/views/home.tsx, served at path /",
    "backendEndpoints": "N/A",
    "databaseSQL": "N/A"
  },
  {
    "userActivity": "Register new user (t@jwt.com, pw: test)",
    "frontendComponent": "src/views/register.tsx, served at path /register /:subpath/register",
    "backendEndpoints": "POST /api/auth",
    "databaseSQL": "INSERT INTO user (name, email, password) VALUES (?, ?, ?);INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?);INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token"
  },
  {
    "userActivity": "Login new user (t@jwt.com, pw: test)",
    "frontendComponent": "src/views/login.tsx, served at path /login or /:subpath/login",
    "backendEndpoints": "PUT /api/auth",
    "databaseSQL": "SELECT * FROM user WHERE email=?;SELECT * FROM userRole WHERE userId=?;INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token;"
  },
  {
    "userActivity": "Order pizza",
    "frontendComponent": "src/views/menu.tsx, served at path /menu & src/views/payment.tsx, served at path /payment",
    "backendEndpoints": "POST /api/order",
    "databaseSQL": "INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now());INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?)"
  },
  {
    "userActivity": "Verify pizza",
    "frontendComponent": "src/views/delivery.tsx id hs-jwt-modal, served at path /delivery",
    "backendEndpoints": "POST /api/order/verify",
    "databaseSQL": "N/A"
  },
  {
    "userActivity": "View profile page",
    "frontendComponent": "src/views/dinerDashboard.tsx, served at /diner-dashboard",
    "backendEndpoints": "GET /api/order",
    "databaseSQL": "SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT 0,10;SELECT id, menuId, description, price FROM orderItem WHERE orderId=?"
  },
  {
    "userActivity": "View franchise (as diner)",
    "frontendComponent": "src/views/franchiseDashboard.tsx, served at /franchise-dashboard",
    "backendEndpoints": "GET /api/franchise/:franchiseId",
    "databaseSQL": "SELECT userId FROM auth WHERE token=?;SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?"
  },
  {
    "userActivity": "Logout",
    "frontendComponent": "src/views/logout.tsx, served at path /logout or /:subpath/logout",
    "backendEndpoints": "DELETE /api/auth",
    "databaseSQL": "SELECT userId FROM auth WHERE token=?;DELETE FROM auth WHERE token=?"
  },
  {
    "userActivity": "View About page",
    "frontendComponent": "src/about.tsx, served at path /about",
    "backendEndpoints": "N/A",
    "databaseSQL": "N/A"
  },
  {
    "userActivity": "View History page",
    "frontendComponent": "src/history.tsx, served at path /history",
    "backendEndpoints": "N/A",
    "databaseSQL": "N/A"
  },
  {
    "userActivity": "Login as franchisee (f@jwt.com, pw: franchisee)",
    "frontendComponent": "src/views/login.tsx, served at path /login or /:subpath/login",
    "backendEndpoints": "PUT /api/auth",
    "databaseSQL": "SELECT * FROM user WHERE email=?;SELECT * FROM userRole WHERE userId=?;INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token;"
  },
  {
    "userActivity": "View franchise (as franchisee)",
    "frontendComponent": "src/views/franchiseDashboard.tsx, served at /franchise-dashboard",
    "backendEndpoints": "GET /api/franchise/:franchiseId",
    "databaseSQL": "SELECT id, name FROM franchise WHERE id in (1);SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee';SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id"
  },
  {
    "userActivity": "Create a store",
    "frontendComponent": "src/views/createStore.tsx, served at /franchise-dashboard/create-store",
    "backendEndpoints": "POST /api/franchise/:franchiseId/store",
    "databaseSQL": "SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id;INSERT INTO store (franchiseId, name) VALUES (?, ?)"
  },
  {
    "userActivity": "Close a store",
    "frontendComponent": "src/views/closeStore.tsx, served at /franchise-dashboard/close-store",
    "backendEndpoints": "DELETE /api/franchise/:franchiseId/store/:storeId",
    "databaseSQL": "DELETE FROM store WHERE franchiseId=? AND id=?"
  },
  {
    "userActivity": "Login as admin (a@jwt.com, pw: admin)",
    "frontendComponent": "src/views/login.tsx, served at path /login or /:subpath/login",
    "backendEndpoints": "PUT /api/auth",
    "databaseSQL": "SELECT * FROM user WHERE email=?;SELECT * FROM userRole WHERE userId=?;INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token;"
  },
  {
    "userActivity": "View Admin page",
    "frontendComponent": "src/views/adminDashboard.tsx, served at /admin-dashboard",
    "backendEndpoints": "GET /api/franchise?page=:pageNumber&limit=:limitNumber&name=",
    "databaseSQL": "SELECT id, name FROM franchise WHERE name LIKE ? LIMIT 31 OFFSET 0;SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee';SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id"
  },
  {
    "userActivity": "Create a franchise for t@jwt.com",
    "frontendComponent": "src/views/createFranchise.tsx, served at /admin-dashboard/create-franchise",
    "backendEndpoints": "POST /api/franchise",
    "databaseSQL": "SELECT userId FROM auth WHERE token=?;SELECT id, name FROM user WHERE email=?;INSERT INTO franchise (name) VALUES (?);INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)"
  },
  {
    "userActivity": "Close the franchise for t@jwt.com",
    "frontendComponent": "src/views/closeFranchise.tsx, served at /admin-dashboard/close-franchise",
    "backendEndpoints": "DELETE /api/franchise/:franchiseId",
    "databaseSQL": "DELETE FROM store WHERE franchiseId=?;DELETE FROM userRole WHERE objectId=?;DELETE FROM franchise WHERE id=?"
  }
]
```
