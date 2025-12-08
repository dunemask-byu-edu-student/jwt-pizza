# Peer Test

## Elijah Cramer & Elijah Parker

## Self Attack

No successful attacks could be performed.
All attempted attacks failed.
Attacks tried:

- Downloading Artifact
- Using default admin password
- Spoofed JWT
- Sql Injection

## Peer Attack

| Item           | Result                                                                                 |
| -------------- | -------------------------------------------------------------------------------------- |
| Date           | December 4, 2025                                                                       |
| Target         | [https://pizza.cs329jwtpizza.click/](https://pizza.cs329jwtpizza.click/)               |
| Classification | Injection                                                                              |
| Severity       | 1                                                                                      |
| Description    | SQL injection allowed, could delete database .                                         |
| Images         | ![Dead database](/.github/images/sql-injection.png) <br/> Sql injection error messages |
| Corrections    | Sanitize user inputs.                                                                  |

| Item           | Result                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Date           | December 4, 2025                                                                                          |
| Target         | [https://pizza.cs329jwtpizza.click/](https://pizza.cs329jwtpizza.click/)                                  |
| Classification | Access Control / Improper Authorization                                                                   |
| Severity       | 2                                                                                                         |
| Description    | The system allowed unauthorized artifact downloads, suggesting weak or missing access controls.           |
| Images         | ![Artifact download](/.github/images/artifact-download.png) <br/> Evidence of unrestricted file retrieval |
| Corrections    | Enforce authentication and permission checks on all artifact endpoints.                                   |

| Item           | Result                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Date           | December 4, 2025                                                                                  |
| Target         | [https://pizza.cs329jwtpizza.click/](https://pizza.cs329jwtpizza.click/)                          |
| Classification | Misconfiguration / Debug Functionality Exposed                                                    |
| Severity       | 2                                                                                                 |
| Description    | A chaos or stress-test trigger endpoint appeared accessible, indicating debug tools left exposed. |
| Images         | ![Chaos init](/.github/images/chaos-initiated.png) <br/> Exposed debugging or testing interface   |
| Corrections    | Disable or restrict any testing/chaos tooling in production; require authentication.              |

| Item           | Result                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| Date           | December 4, 2025                                                                                     |
| Target         | [https://pizza.cs329jwtpizza.click/](https://pizza.cs329jwtpizza.click/)                             |
| Classification | Logging / Rate Limiting Weakness                                                                     |
| Severity       | 1                                                                                                    |
| Description    | Excessively verbose logs were triggered by simple requests, indicating insufficient filtering.       |
| Images         | ![Log spam](/.github/images/log-spamming.png) <br/> Overly verbose logging on user-triggered actions |
| Corrections    | Add rate limiting, log throttling, and input validation to prevent log flooding.                     |

| Item           | Result                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| Date           | December 4, 2025                                                                                                |
| Target         | [https://pizza.cs329jwtpizza.click/](https://pizza.cs329jwtpizza.click/)                                        |
| Classification | Authentication / Authorization                                                                                  |
| Severity       | 3                                                                                                               |
| Description    | The JWT secret appeared weak or exposed, allowing potential privilege escalation through token manipulation.    |
| Images         | ![JWT escalation](/.github/images/privilge-escalation-with-jwt-secret.png) <br/> Evidence of insecure JWT usage |
| Corrections    | Rotate the JWT secret, store securely, enforce short token lifetimes, and enhance signature validation.         |

| Item           | Result                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Date           | December 4, 2025                                                                                        |
| Target         | [https://pizza.cs329jwtpizza.click/](https://pizza.cs329jwtpizza.click/)                                |
| Classification | Account Security / Default Credentials                                                                  |
| Severity       | 3                                                                                                       |
| Description    | Administrative account was still using a default or unchanged password, creating immediate risk.        |
| Images         | ![Default admin password](/.github/images/unchanged-admin-password.png) <br/> Evidence of default login |
| Corrections    | Require password rotation, enforce strong password policies, and disable default admin credentials.     |

## Summary of learnings
The biggest lesson learned came from a simple text that looked like this:
![Social Engineering](/.github/images/social-engineering.png)

WIth that information, I was able to find his code, download his build artifact (which contained production secrets) and exploit tons of vulnerabilities that could have destroyed a company completely. This code was copy and pasted, it was not vetted and it was not identified as a potential threat. I was successfully able to prevent this by happening first and foremost by not identifying where my code was, and second, by ensuring that every time I copy and pasted code, I knew what it was doing, and removed anything that I thought could be a security vulnerability.

Attacks are both sophisticated and simple. Once you have **a** way in, you have many ways you can exploit the code. No code is magically safe, you must identify every failure point possible and then find the ones that you missed. 
