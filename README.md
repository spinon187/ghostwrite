## Ghostwrite Readme

Live deployment can be found [here](https://ghostwrite.xyz)

### General Outline

The aim of Ghostwrite is to provide a platform for anonymous, secure two-way messaging that can be discarded at any time and makes it as difficult as possible for any hypothetical party who could compromise the database to extract anything of value. Ghostwrite attempts this from several angles:

**`No Username or Password`**
If users aren't required to log in, they can't have their login credentials stolen. Instead, the app assigns the user a random 10-digit ID number which can be cleared and reset at any time, deleting all activity of the previous ID from other users' devices.

**`Deletion-on-Retrieval`**
Sent messages are only stored on the server for as long as it takes to access them. Post requests to the messages endpoint trigger deletion of the associated messages from the database as part of the sending function. Messages themselves are kept in the serialized Redux store on the front-end for the remainder of their existence.

**`Zero-Knowledge Server`**
Ghostwrite uses a second layer of anonymity as an additional protection. When a connection between two users is approved, they exchange encrypted 256-bit aliases to use for actual message exchange. If the database content were to be compromised, it would not even be clear who the senders and recipients of individual messages were, as these aliases have nothing connecting them to the original account ID and are individualized for every user pair.

### Specific Flow

**`1. ID assignment`**
On page load, the client checks the serialized Redux store for a registered 10-digit ID. If not found, it generates one at random and posts to the server to see if the ID is in use. If not, the backend registers it and passes back a server authentication token. Otherwise, the app picks a new number and tries again until it is successful. Once that happens, the client will generate a DH key pair for encryption purposes.

**`2. User connection`**
To connect to someone else, a user just needs to enter their desired partner's ID and submit it. This posts a message to the server with the 'request' flag set to true and includes the requesting user's public DH key.

The partner will then have the option of accepting or denying the request. When the request comes in, the partner client will calculate the shared key regardless of acceptance/denial while it waits and simply purges it from the store upon denial. If accepted, the partner client will generate a pair of 256-bit aliases to use for further communication. It then uses the shared key to encrypt them, and sends a message back to the original requesting client containing these encrypted aliases as well as a true 'accept' flag and its own public DH key.

From this stage onward, the 10-digit IDs no longer serve a purpose for paired users and are maintained strictly for cosmetic purposes.

**`Sending messages`**
Encryption is end-to-end, performed by the clients. An individual client retrieves messages by posting an array to the server consisting of its connection ID and all its aliases(which ought to result in a length of N+1 where N is the number of other clients it's currently paired with). As part of the retrieval process, the server endpoint being hit here will store the messages it finds in a JSON object and then delete them in the database before sending the response back to the client. No other conversation records are kept on the server. If two users are actively using the app, this results in storage durations of ~1 second at the maximum.

**`Deletion functions`**
Ghostwrite offers several deletion functions, hereafter referred to as 'full,' 'targeted,' and 'partial.' These can be invoked unilaterally at any time and rely on flags similar to the request and acceptance flags used in connection establishment.

FULL: Full deletion is invoked via complete account reset. It resets the local Redux store, clears the 10-digit connection ID from the server's user ID table, purges any incoming or outgoing messages still remaining on the message server associated with the user's previous ID or aliases, and then dispatches dummy messages to any/all partnered devices with the 'nuke' flag set to true. When a partnered device receives a nuke-flagged message, it automatically purges all data associated with the deleted user from its own store.

TARGETED: Same core operations as the full deletion, but terminates the connection with only a single partner while leaving the remainder of the user's stored data intact.

PARTIAL: Does NOT sever communications between the user and the targeted partner, but simply erases their shared chat history via a dummy message with the 'partial' flag set to true. Any further messages behave as normal.