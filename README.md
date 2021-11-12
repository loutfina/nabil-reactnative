# nabil-reactnative
first react native app base on nabil-quarkus backend

This code is based on ReactNative EXPO sample using CLI (https://reactnative.dev/docs/0.60/enviroment-setup)

Install it
```shell script
yarn install
yarn web
```

Launch the application in the browser
```shell script
yarn web
```
On your Android Mobil, install the EXPO application from google play and scan the QR code given in the web browser.

The application need the project nabil-quarkus to be running on your local PC.
```shell script
mvn compile quarkus:dev -Dquarkus.profile=dev-with-data
```
