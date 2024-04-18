<!--```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of browser: Text data submitted in the form is sent to the server
    server-- >>browser: Server responds with a URL redirect, making the browser send a new GET request to /notes
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-- >>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-- >>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-- >>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-- >>browser: [{"content": "something","date": "2024-04-17"}, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```-->

<!--```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-- >>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-- >>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-- >>browser: the SPA JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-- >>browser: [{"content": "something","date": "2024-04-17"}, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```-->

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: HTML document
    deactivate server

    Note right of browser: Content submitted in the form is parsed as JSON and sent to the server  
    Note right of browser: Content-type: application/json {content: "spa note sent", date: "2024-04-18T05:33:31.556Z"}

    activate server
    server-->>browser: HTTP 201 created response
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```
