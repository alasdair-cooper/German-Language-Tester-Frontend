prog-1920-cw-2

This coursework uses Azure and Wiktionary for extra functionality. Without an internet connection there will be:
> No ability to define words using Wiktionary
> No access to the admin section of settings
> No way to move an account online if it is created offline. This applies to any icon image chosen as well
> Translations will be worse as the offline option is a fixed size JSON, not Microsoft's servers. This means sentences will not be translated and incorrectly capitalised or un-capitalised words
> No way to sign in after you have signed out

Users and sessions are stored in an Azure SQL database and timestamped. Anyone can see sessions and existing users by entering the admin code 123456789. Therefore if you do not wish to have your email seen by other people, you should probably use a fake email. The validation for the email field is deliberately poor, and will accept any string containing an '@' and '.' . Any images uploaded are stored in blob storage along with user files as well. There is a test image in the same directory as this readme. 

The words ApiAccessKey, session key, access key are all used interchangeably throughout the code and docs. Sessions timeout after 3 hours and will clear cookies and display a session expired page. If this happens, you can log back in and start a new session.

The Azure functionality includes:
> An Azure SQL database
> Azure Blob Storage
> Azure Cognitive Service Translate

They all require session keys, and are protected against SQL injection, and return valid status codes like the NodeJS server. The Node server handles the return status codes, so if Azure goes down (UK South has just had some issues so it is not unlikely there will be issues), then the client will respond appropriately.

Danke für eure Hilfe.

#   G e r m a n - L a n g u a g e - T e s t e r - F r o n t e n d  
 