# Phonebook App Backend

This is the backend of the phonebook application we developed the frontend for under the part 2 directory,  
which can be found [here](https://github.com/smwingira/mooc-fullstack/tree/main/part2/phonebook).  

You can interact with the backend here: [https://part3-pb-backend.fly.dev/](https://part3-pb-backend.fly.dev/). Below are a list of usable endpoints.

## Endpoints

### GET

- Info: [https://part3-pb-backend.fly.dev/info](https://part3-pb-backend.fly.dev/info)
- Persons: [https://part3-pb-backend.fly.dev/api/persons](https://part3-pb-backend.fly.dev/api/persons)
- Person: [https://part3-pb-backend.fly.dev/api/persons/1](https://part3-pb-backend.fly.dev/api/persons/1)
  - By changing the number at the end of the link to any of the person IDs as listed under the persons endpoint you can view individual entries

### POST

- Persons: [https://part3-pb-backend.fly.dev/api/persons](https://part3-pb-backend.fly.dev/api/persons)
  - Posting to this endpoint will create a new person entry into the phonebook. Both the name and number must be in the request body, there are error checks to make sure this is the case.  
