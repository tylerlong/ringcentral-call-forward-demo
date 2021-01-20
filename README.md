# RingCentral call forward demo


## Setup

Rename `.env.sample` to `.env` and edit it to specify credentials.

```
yarn install
```


## Run

```
yarn test
```


## Test

- Login soft phone as `RINGCENTRAL_USERNAME`
- Login web phone as `RINGCENTRAL_FORWARD_TO_NUMBER`
- from soft phone make a call to any phone (such as your personal mobile phone)

### Expected behavior

The call will be forwarded to `RINGCENTRAL_FORWARD_TO_NUMBER`.

## Actual behavior

`RINGCENTRAL_FORWARD_TO_NUMBER` web phone doesn't ring at all.
