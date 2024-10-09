const fs = require('fs');
const supertest = require('supertest');
const path = require('path');


let authToken;
let authToken1;
let reservationId;
let confirmationId;
let externalReferenceId;
let pmsConfirmationNumber;
let externalConfirmationNumber;
let ihgConfirmationNumber;
let cardId;
//let excelData = [];

const FilePath = './Config.json';
const Data = JSON.parse(fs.readFileSync(FilePath, 'utf8'));
const filepath = Data.filepath;
 
// Load the JSON data from the file
const jsonFilePath = filepath.jsoninputpath5;
const testData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

describe('api Authu Token', function () {
    before(async function () {
        // Authenticate and set authToken before running tests 
        const reservation = testData.reservation;
        await supertest(reservation.request)
            .post(reservation.Authendpath)
            .set('Content-Type', reservation['Content-Type'])
            .set('x-app-key', reservation['x-app-key'])
            .set('Authorization', reservation.Authorization)
            .send({
                username: reservation.username1,
                password: reservation.password1,
                grant_type: 'password'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(function (response) {
                authToken = response._body.access_token;
             //   console.log(response)
            });
       
        // Authenticate and set the second authToken before running tests
        await supertest(reservation.request1)
            .post(reservation.Authendpath1)
            .set('X-IHG-M2M', reservation['X-IHG-M2M'])
            .set('User-Agent', reservation['User-Agent'])
            .set('X-IHG-AUTO', reservation['X-IHG-AUTO'])
            .set('X-IHG-API-KEY', reservation['X-IHG-API-KEY'])
            .set('Authorization', reservation.Authorization1)
            .send({
                username: reservation.username2,
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(function (response) {
                authToken1 = response.body.access_token;
             //  console.log(response)
            })
    });

    const reservation = testData.reservation;
         //check availability
    it('GET Check Availability', async function ({ supertest }) {  
        await supertest
          .request(reservation.request)
          .get(reservation.Getendpath2)
          .query({
            "roomStayStartDate": reservation.arrivalDate,
            "roomStayEndDate": reservation.departureDate,
            "hotelIds": reservation.hotelId,
            "children": reservation.children,
            "roomTypeInfo": true,
            "adults": reservation.adults,
            "ratePlanInfo": true,
            "limit": reservation.limit,
            "redeemAwards": false,
            "roomStayQuantity": reservation.roomStayQuantity,
            "initialRatePlanSet": true,
            "resGuaranteeInfo": false
          })
        // .set('Content-Type', reservation['Content-Type1'])
          .set('x-hotelid', reservation.hotelId)
          .set('x-app-key', reservation['x-app-key1'])
          .set('bypass-routing', reservation['bypass-routing'])
          .set('Authorization', 'Bearer ' + authToken)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(function (response) {
            console.log("Check Availability done Successfully")
          })
      });

      //check validation
   it('PUT Check Validation', async function ({ supertest }) {
        await supertest
          .request(reservation.request)
          .put(reservation.Putendpath)
          .set('Content-Type', reservation['Content-Type1'])
          .set('x-hotelid', reservation.hotelId)
          .set('x-app-key', reservation['x-app-key'])
          .set('bypass-routing', reservation['bypass-routing'])
          .set('Authorization', 'Bearer ' + authToken)
          .send(
            {
              "instructions": {
                "instruction": [
                  "Packages",
                  "InventoryItems",
                  "ReservationGuarantee",
                  "StayHeader",
                  "RefreshRates"
                ]
              },
              "reservation": {
                "roomStay": {
                  "roomRates": {
                    "rates": {
                      "rate": {
                        "base": {
                          "amountBeforeTax": 179,
                          "baseAmount": 179,
                          "currencyCode": "USD"
                        },
                        "discount": "",
                        "eventStartDate": reservation.startDate,
                        "startDate": reservation.startDate,
                        "start": reservation.startDate,
                        "end": reservation.endDate,
                        "endDate": reservation.endDate,
                        "eventEndDate": reservation.endDate
                      }
                    },
                    "stayProfiles": [
                      {
                        "reservationProfileType": "Company"
                      },
                      {
                        "reservationProfileType": "Group"
                      },
                      {
                        "reservationProfileType": "TravelAgent"
                      },
                      {
                        "reservationProfileType": "ReservationContact"
                      },
                      {
                        "reservationProfileType": "BillingContact"
                      },
                      {
                        "reservationProfileType": "Source"
                      }
                    ],
                    "guestCounts": {
                      "adults": reservation.adults,
                      "children": reservation.children
                    },
                    "taxFreeGuestCounts": {
                      "adults": 0,
                      "children": 0
                    },
                    "roomType": reservation.roomType,
                    "ratePlanCode": reservation.ratePlanCode,
                    "marketCode": reservation.marketCode,
                    "sourceCode": reservation.sourceCode,
                    "numberOfUnits": reservation.numberOfUnits,
                    "pseudoRoom": false,
                    "roomTypeCharged": reservation.roomTypeCharged,
                    "eventStartDate":  reservation.startDate,
                    "startDate":  reservation.startDate,
                    "start":  reservation.startDate,
                    "end": reservation.endDate,
                    "endDate": reservation.endDate,
                    "eventEndDate": reservation.endDate
                  },
                  "guestCounts": {
                    "adults": reservation.adults,
                    "children": reservation.children
                  },
                  "expectedTimes": {
                    "reservationExpectedArrivalTime": reservation.arrivalDate,
                    "resExpectedArrivalTime": reservation.arrivalDate,
                    "reservationExpectedDepartureTime": reservation.departureDate,
                    "resExpectedDepartureTime": reservation.departureDate
                  },
                  "guarantee": {
                    "guaranteeCode": reservation.guaranteeCode
                  },
                  "arrivalDate": reservation.arrivalDate,
                  "departureDate": reservation.departureDate
                },
                "hotelId": reservation.hotelId,
                "preRegistered": false,
                "allowMobileCheckout": false,
                "overrideOutOfServiceCheck": true
              },
              "timeSpan": {
                "startDate": reservation.startDate,
                "endDate": reservation.endDate
              }
            }
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .then(function (response) {
            console.log("Validation done Successfully")
          })
      });
    
      it('POST Create Reservation', async function ({ supertest }) {
        await supertest
            .request(reservation.request)
            .post(reservation.Postendpath)
            .set('Content-Type', reservation['Content-Type1'])
            .set('x-hotelid', reservation.hotelId)
            .set('x-app-key', reservation['x-app-key1'])
            .set('bypass-routing', reservation['bypass-routing'])
            .set('Authorization', 'Bearer ' + authToken)
            .send({
                "reservations": {
                    "reservation": {
                        "roomStay": {
                            "roomRates": {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "219",
                                            "baseAmount": "219"
                                        },
                                        "start": "2024-12-02",
                                        "end": "2024-12-02"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "roomType": "KSBN",
                                "ratePlanCode": "IGCOR",
                                "marketCode": "G",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KSBN",
                                "start": "2024-12-02",
                                "end": "2024-12-02"
                            },
                            "guestCounts": {
                                "adults": "1",
                                "children": "0"
                            },
                            "expectedTimes": {
                                "reservationExpectedArrivalTime": "2024-12-02",
                                "reservationExpectedDepartureTime": "2024-12-08"
                            },
                            "guarantee": {
                                "guaranteeCode": "INN",
                                "onHold": "false"
                            },
                            "arrivalDate": "2024-12-02",
                            "departureDate": "2024-12-08"
                        },
                        "reservationGuests": {
                            "profileInfo": {
                                "profileIdList": {
                                    "type": "Profile",
                                    "id": "52123"
                                },
                                "profile": {
                                    "customer": {
                                        "personName": [
                                            {
                                                "givenName": "KP1",
                                                "surname": "Test",
                                                "nameType": "Primary"
                                            },
                                            {
                                                "nameType": "Alternate"
                                            }
                                        ]
                                    },
                                    "addresses": {
                                        "addressInfo": {
                                            "address": {
                                                "isValidated": "false",
                                                "addressLine": [
                                                    "",
                                                    "",
                                                    "",
                                                    ""
                                                ],
                                                "country": ""
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "reservationProfiles": {
                            "reservationProfile": [
                                {
                                    "reservationProfileType": "Company"
                                },
                                {
                                    "reservationProfileType": "Group"
                                },
                                {
                                    "reservationProfileType": "TravelAgent"
                                },
                                {
                                    "reservationProfileType": "ReservationContact"
                                },
                                {
                                    "reservationProfileType": "Source"
                                },
                                {
                                    "reservationProfileType": "Addressee"
                                }
                            ]
                        },
                        "reservationPaymentMethods": [
                            {
                                "emailFolioInfo": {
                                    "emailFolio": "false"
                                },
                                "paymentMethod": "CASH",
                                "folioView": "1"
                            },
                            {
                                "emailFolioInfo": {
                                    "emailFolio": "false"
                                },
                                "folioView": "2"
                            },
                            {
                                "emailFolioInfo": {
                                    "emailFolio": "false"
                                },
                                "folioView": "3"
                            },
                            {
                                "emailFolioInfo": {
                                    "emailFolio": "false"
                                },
                                "folioView": "4"
                            },
                            {
                                "emailFolioInfo": {
                                    "emailFolio": "false"
                                },
                                "folioView": "5"
                            },
                            {
                                "emailFolioInfo": {
                                    "emailFolio": "false"
                                },
                                "folioView": "6"
                            },
                            {
                                "emailFolioInfo": {
                                    "emailFolio": "false"
                                },
                                "folioView": "7"
                            },
                            {
                                "emailFolioInfo": {
                                    "emailFolio": "false"
                                },
                                "folioView": "8"
                            }
                        ],
                        "cashiering": {
                            "taxType": {
                                "code": "",
                                "collectingAgentTax": "false",
                                "printAutoAdjust": "false"
                            },
                            "reverseCheckInAllowed": "false",
                            "reverseAdvanceCheckInAllowed": "false"
                        },
                        "hotelId": "GRVXX",
                        "reservationStatus": "Reserved",
                        "customReference": "",
                        "displayColor": "",
                        "markAsRecentlyAccessed": "true",
                        "preRegistered": "false",
                        "allowMobileCheckout": "false",
                        "overrideOutOfServiceCheck": "true"
                    }
                },
                "_xmlns": "http://xmlns.oracle.com/cloud/adapter/REST/CreateReservation/types"
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(function (response) {
                //console.log(response)
                const locationHeader = response.headers.location;
                const urlParts = locationHeader.split('/');
                reservationId = urlParts[urlParts.length - 1];
                console.log("Reservation created successfully, Reservation ID:", reservationId);
            });
    });

    it('GET Reservation OHIP', async function ({ supertest }) {
      await supertest
          .request(reservation.request)
          .get(reservation.Getendpath + reservationId)
          .set('Content-Type', reservation['Content-Type1'])
          .set('x-hotelid', reservation.hotelId)
          .set('x-app-key', reservation['x-app-key1'])
          .set('bypass-routing', reservation['bypass-routing'])
          .set('Authorization', 'Bearer ' + authToken)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(function (response) {
              const responseBody = JSON.parse(response.text);
              const reservation = responseBody.reservations.reservation[0];

              const confirmationIdEntry = reservation.reservationIdList.find(idEntry => idEntry.type === 'Confirmation');
              confirmationId = confirmationIdEntry ? confirmationIdEntry.id : 'Not found';

              const externalReferenceIdEntry = reservation.externalReferences.find(ref => ref.idContext === 'CRS_HIEUAT');
              externalReferenceId = externalReferenceIdEntry ? externalReferenceIdEntry.id : 'Not found';

              console.log("Status : Reservation created Successfully in OHIP");
              console.log("Reservation ID :", reservationId);
              console.log('Confirmation ID:', confirmationId);
              console.log('External Reference ID:', externalReferenceId);
          })
  });

  it('GET Reservation GRS', async function ({ supertest }) {
    await supertest
        .request(reservation.request2)
        .get(reservation.Getendpath1 + externalReferenceId)
        .query({
            lastName: reservation.surname3
        })
        .set('Content-Length', '0')
        .set('X-IHG-M2M', reservation['X-IHG-M2M'])
        .set('User-Agent', reservation['User-Agent'])
        .set('X-IHG-AUTO', reservation['X-IHG-AUTO'])
        .set('X-IHG-API-KEY', reservation['X-IHG-API-KEY'])
        .set('bypass-routing', reservation['bypass-routing'])
        .set('Authorization', 'Bearer ' + authToken1)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(function (response) {
         // console.log(response.text)
            const responseBody = JSON.parse(response.text);
            const reservation = responseBody.hotelReservation;

            const ihgConfirmationNumberEntry = reservation.reservationIds.confirmationNumbers.find(entry => entry.ihgConfirmationNumber);
            ihgConfirmationNumber = ihgConfirmationNumberEntry ? ihgConfirmationNumberEntry.ihgConfirmationNumber : 'Not found';

            const externalConfirmationNumberEntry = reservation.reservationIds.confirmationNumbers.find(entry => entry.externalConfirmationNumber && entry.externalConfirmationNumber.number);
            externalConfirmationNumber = externalConfirmationNumberEntry ? externalConfirmationNumberEntry.externalConfirmationNumber.number : 'Not found';

            const pmsConfirmationNumberEntry = reservation.reservationIds.confirmationNumbers.find(entry => entry.pmsConfirmationNumber);
            pmsConfirmationNumber = pmsConfirmationNumberEntry ? pmsConfirmationNumberEntry.pmsConfirmationNumber : 'Not found';

            console.log("Status: Reservation created Successfully in GRS");
            console.log("IHG Confirmation Number:", ihgConfirmationNumber);
            console.log("External Confirmation Number:", externalConfirmationNumber);
            console.log("PMS Confirmation Number:", pmsConfirmationNumber);
        })
    });
  
    it("PUT Update Reservation-added Company details", async function ({ supertest }) {
      await supertest
     .request(reservation.request)
     .put(reservation.Getendpath + reservationId)
     .set("Content-Type", reservation['Content-Type1'])
     .set("x-hotelid", reservation.hotelId)
     .set("x-app-key", reservation['x-app-key'])
     .set("bypass-routing", reservation['bypass-routing'])
     .set("Authorization", "Bearer " + authToken)
     .send({
        "reservations": {
            "reservationIdList": {
                "type": "Reservation",
                "idContext": "OPERA",
                "id": reservationId
            },
            "roomStay": {
                "roomRates": [
                    {
                        "rates": {
                            "rate": {
                                "base": {
                                    "amountBeforeTax": "171",
                                    "currencyCode": "USD"
                                },
                                "discount": "",
                                "eventStartDate": "2024-12-02",
                                "startDate": "2024-12-02",
                                "start": "2024-12-02",
                                "end": "2024-12-02",
                                "endDate": "2024-12-02",
                                "eventEndDate": "2024-12-02"
                            }
                        },
                        "stayProfiles": [
                            {
                                "profileIdList": {
                                    "type": "Profile",
                                    "idContext": "OPERA",
                                    "id": "36970"
                                },
                                "resProfileType": "Company",
                                "reservationProfileType": "Company"
                            },
                            {
                                "resProfileType": "Group",
                                "reservationProfileType": "Group"
                            },
                            {
                                "resProfileType": "TravelAgent",
                                "reservationProfileType": "TravelAgent"
                            },
                            {
                                "resProfileType": "ReservationContact",
                                "reservationProfileType": "ReservationContact"
                            },
                            {
                                "resProfileType": "BillingContact",
                                "reservationProfileType": "BillingContact"
                            },
                            {
                                "resProfileType": "Source",
                                "reservationProfileType": "Source"
                            }
                        ],
                        "guestCounts": {
                            "adults": "1",
                            "children": "0"
                        },
                        "taxFreeGuestCounts": {
                            "adults": "0",
                            "children": "0"
                        },
                        "roomType": "KNGN",
                        "ratePlanCode": "IKPCM",
                        "marketCode": "K",
                        "sourceCode": "GD",
                        "numberOfUnits": "1",
                        "pseudoRoom": "false",
                        "roomTypeCharged": "KNGN",
                        "fixedRate": "true",
                        "discountAllowed": "false",
                        "eventStartDate": "2024-12-02",
                        "startDate": "2024-12-02",
                        "start": "2024-12-02",
                        "end": "2024-12-02",
                        "endDate": "2024-12-02",
                        "eventEndDate": "2024-12-02"
                    },
                    {
                        "rates": {
                            "rate": {
                                "base": {
                                    "amountBeforeTax": "169",
                                    "currencyCode": "USD"
                                },
                                "discount": "",
                                "eventStartDate": "2024-12-03",
                                "startDate": "2024-12-03",
                                "start": "2024-12-03",
                                "end": "2024-12-03",
                                "endDate": "2024-12-03",
                                "eventEndDate": "2024-12-03"
                            }
                        },
                        "stayProfiles": [
                            {
                                "profileIdList": {
                                    "type": "Profile",
                                    "idContext": "OPERA",
                                    "id": "36970"
                                },
                                "resProfileType": "Company",
                                "reservationProfileType": "Company"
                            },
                            {
                                "resProfileType": "Group",
                                "reservationProfileType": "Group"
                            },
                            {
                                "resProfileType": "TravelAgent",
                                "reservationProfileType": "TravelAgent"
                            },
                            {
                                "resProfileType": "ReservationContact",
                                "reservationProfileType": "ReservationContact"
                            },
                            {
                                "resProfileType": "BillingContact",
                                "reservationProfileType": "BillingContact"
                            },
                            {
                                "resProfileType": "Source",
                                "reservationProfileType": "Source"
                            }
                        ],
                        "guestCounts": {
                            "adults": "1",
                            "children": "0"
                        },
                        "taxFreeGuestCounts": {
                            "adults": "0",
                            "children": "0"
                        },
                        "roomType": "KNGN",
                        "ratePlanCode": "IKPCM",
                        "marketCode": "K",
                        "sourceCode": "GD",
                        "numberOfUnits": "1",
                        "pseudoRoom": "false",
                        "roomTypeCharged": "KNGN",
                        "fixedRate": "true",
                        "discountAllowed": "false",
                        "eventStartDate": "2024-12-03",
                        "startDate": "2024-12-03",
                        "start": "2024-12-03",
                        "end": "2024-12-03",
                        "endDate": "2024-12-03",
                        "eventEndDate": "2024-12-03"
                    },
                    {
                        "rates": {
                            "rate": {
                                "base": {
                                    "amountBeforeTax": "166",
                                    "currencyCode": "USD"
                                },
                                "discount": "",
                                "eventStartDate": "2024-12-04",
                                "startDate": "2024-12-04",
                                "start": "2024-12-04",
                                "end": "2024-12-04",
                                "endDate": "2024-12-04",
                                "eventEndDate": "2024-12-04"
                            }
                        },
                        "stayProfiles": [
                            {
                                "profileIdList": {
                                    "type": "Profile",
                                    "idContext": "OPERA",
                                    "id": "36970"
                                },
                                "resProfileType": "Company",
                                "reservationProfileType": "Company"
                            },
                            {
                                "resProfileType": "Group",
                                "reservationProfileType": "Group"
                            },
                            {
                                "resProfileType": "TravelAgent",
                                "reservationProfileType": "TravelAgent"
                            },
                            {
                                "resProfileType": "ReservationContact",
                                "reservationProfileType": "ReservationContact"
                            },
                            {
                                "resProfileType": "BillingContact",
                                "reservationProfileType": "BillingContact"
                            },
                            {
                                "resProfileType": "Source",
                                "reservationProfileType": "Source"
                            }
                        ],
                        "guestCounts": {
                            "adults": "1",
                            "children": "0"
                        },
                        "taxFreeGuestCounts": {
                            "adults": "0",
                            "children": "0"
                        },
                        "roomType": "KNGN",
                        "ratePlanCode": "IKPCM",
                        "marketCode": "K",
                        "sourceCode": "GD",
                        "numberOfUnits": "1",
                        "pseudoRoom": "false",
                        "roomTypeCharged": "KNGN",
                        "fixedRate": "true",
                        "discountAllowed": "false",
                        "eventStartDate": "2024-12-04",
                        "startDate": "2024-12-04",
                        "start": "2024-12-04",
                        "end": "2024-12-04",
                        "endDate": "2024-12-04",
                        "eventEndDate": "2024-12-04"
                    },
                    {
                        "rates": {
                            "rate": {
                                "base": {
                                    "amountBeforeTax": "159",
                                    "currencyCode": "USD"
                                },
                                "discount": "",
                                "eventStartDate": "2024-12-05",
                                "startDate": "2024-12-05",
                                "start": "2024-12-05",
                                "end": "2024-12-05",
                                "endDate": "2024-12-05",
                                "eventEndDate": "2024-12-05"
                            }
                        },
                        "stayProfiles": [
                            {
                                "profileIdList": {
                                    "type": "Profile",
                                    "idContext": "OPERA",
                                    "id": "36970"
                                },
                                "resProfileType": "Company",
                                "reservationProfileType": "Company"
                            },
                            {
                                "resProfileType": "Group",
                                "reservationProfileType": "Group"
                            },
                            {
                                "resProfileType": "TravelAgent",
                                "reservationProfileType": "TravelAgent"
                            },
                            {
                                "resProfileType": "ReservationContact",
                                "reservationProfileType": "ReservationContact"
                            },
                            {
                                "resProfileType": "BillingContact",
                                "reservationProfileType": "BillingContact"
                            },
                            {
                                "resProfileType": "Source",
                                "reservationProfileType": "Source"
                            }
                        ],
                        "guestCounts": {
                            "adults": "1",
                            "children": "0"
                        },
                        "taxFreeGuestCounts": {
                            "adults": "0",
                            "children": "0"
                        },
                        "roomType": "KNGN",
                        "ratePlanCode": "IKPCM",
                        "marketCode": "K",
                        "sourceCode": "GD",
                        "numberOfUnits": "1",
                        "pseudoRoom": "false",
                        "roomTypeCharged": "KNGN",
                        "fixedRate": "true",
                        "discountAllowed": "false",
                        "eventStartDate": "2024-12-05",
                        "startDate": "2024-12-05",
                        "start": "2024-12-05",
                        "end": "2024-12-05",
                        "endDate": "2024-12-05",
                        "eventEndDate": "2024-12-05"
                    },
                    {
                        "rates": {
                            "rate": {
                                "base": {
                                    "amountBeforeTax": "158",
                                    "currencyCode": "USD"
                                },
                                "discount": "",
                                "eventStartDate": "2024-12-06",
                                "startDate": "2024-12-06",
                                "start": "2024-12-06",
                                "end": "2024-12-06",
                                "endDate": "2024-12-06",
                                "eventEndDate": "2024-12-06"
                            }
                        },
                        "stayProfiles": [
                            {
                                "profileIdList": {
                                    "type": "Profile",
                                    "idContext": "OPERA",
                                    "id": "36970"
                                },
                                "resProfileType": "Company",
                                "reservationProfileType": "Company"
                            },
                            {
                                "resProfileType": "Group",
                                "reservationProfileType": "Group"
                            },
                            {
                                "resProfileType": "TravelAgent",
                                "reservationProfileType": "TravelAgent"
                            },
                            {
                                "resProfileType": "ReservationContact",
                                "reservationProfileType": "ReservationContact"
                            },
                            {
                                "resProfileType": "BillingContact",
                                "reservationProfileType": "BillingContact"
                            },
                            {
                                "resProfileType": "Source",
                                "reservationProfileType": "Source"
                            }
                        ],
                        "guestCounts": {
                            "adults": "1",
                            "children": "0"
                        },
                        "taxFreeGuestCounts": {
                            "adults": "0",
                            "children": "0"
                        },
                        "roomType": "KNGN",
                        "ratePlanCode": "IKPCM",
                        "marketCode": "K",
                        "sourceCode": "GD",
                        "numberOfUnits": "1",
                        "pseudoRoom": "false",
                        "roomTypeCharged": "KNGN",
                        "fixedRate": "true",
                        "discountAllowed": "false",
                        "eventStartDate": "2024-12-06",
                        "startDate": "2024-12-06",
                        "start": "2024-12-06",
                        "end": "2024-12-06",
                        "endDate": "2024-12-06",
                        "eventEndDate": "2024-12-06"
                    },
                    {
                        "rates": {
                            "rate": {
                                "base": {
                                    "amountBeforeTax": "157",
                                    "currencyCode": "USD"
                                },
                                "discount": "",
                                "eventStartDate": "2024-12-07",
                                "startDate": "2024-12-07",
                                "start": "2024-12-07",
                                "end": "2024-12-07",
                                "endDate": "2024-12-07",
                                "eventEndDate": "2024-12-07"
                            }
                        },
                        "stayProfiles": [
                            {
                                "profileIdList": {
                                    "type": "Profile",
                                    "idContext": "OPERA",
                                    "id": "36970"
                                },
                                "resProfileType": "Company",
                                "reservationProfileType": "Company"
                            },
                            {
                                "resProfileType": "Group",
                                "reservationProfileType": "Group"
                            },
                            {
                                "resProfileType": "TravelAgent",
                                "reservationProfileType": "TravelAgent"
                            },
                            {
                                "resProfileType": "ReservationContact",
                                "reservationProfileType": "ReservationContact"
                            },
                            {
                                "resProfileType": "BillingContact",
                                "reservationProfileType": "BillingContact"
                            },
                            {
                                "resProfileType": "Source",
                                "reservationProfileType": "Source"
                            }
                        ],
                        "guestCounts": {
                            "adults": "1",
                            "children": "0"
                        },
                        "taxFreeGuestCounts": {
                            "adults": "0",
                            "children": "0"
                        },
                        "roomType": "KNGN",
                        "ratePlanCode": "IKPCM",
                        "marketCode": "K",
                        "sourceCode": "GD",
                        "numberOfUnits": "1",
                        "pseudoRoom": "false",
                        "roomTypeCharged": "KNGN",
                        "fixedRate": "true",
                        "discountAllowed": "false",
                        "eventStartDate": "2024-12-07",
                        "startDate": "2024-12-07",
                        "start": "2024-12-07",
                        "end": "2024-12-07",
                        "endDate": "2024-12-07",
                        "eventEndDate": "2024-12-07"
                    }
                ],
                "guestCounts": {
                    "adults": "1",
                    "children": "0"
                },
                "expectedTimes": {
                    "reservationExpectedArrivalTime": "2024-12-02",
                    "resExpectedArrivalTime": "2024-12-02",
                    "reservationExpectedDepartureTime": "2024-12-08",
                    "resExpectedDepartureTime": "2024-12-08"
                },
                "guarantee": {
                    "guaranteeCode": "INN"
                },
                "arrivalDate": "2024-12-02",
                "departureDate": "2024-12-08"
            },
            "reservationGuests": {
                "profileInfo": {
                    "profileIdList": {
                        "type": "Profile",
                        "idContext": "OPERA",
                        "id": "45532"
                    },
                    "profile": {
                        "customer": {
                            "personName": [
                                {
                                    "givenName": "Test",
                                    "surname": "Raja",
                                    "nameType": "Primary",
                                    "language": "E"
                                },
                                {
                                    "nameType": "Alternate"
                                }
                            ]
                        }
                    }
                }
            },
            "reservationProfiles": {
                "reservationProfile": [
                    {
                        "profileIdList": {
                            "type": "Profile",
                            "idContext": "OPERA",
                            "id": "36970"
                        },
                        "profile": {
                            "company": {
                                "companyName": "FEDEX CORPORATION SUPPLY CHAIN"
                            }
                        },
                        "reservationProfileType": "Company"
                    },
                    {
                        "reservationProfileType": "Group"
                    },
                    {
                        "reservationProfileType": "TravelAgent"
                    },
                    {
                        "reservationProfileType": "ReservationContact"
                    },
                    {
                        "reservationProfileType": "Source"
                    },
                    {
                        "reservationProfileType": "BillingContact"
                    },
                    {
                        "reservationProfileType": "Addressee"
                    }
                ],
                "commissionPayoutTo": "None"
            },
            "hotelId": "GRVXX",
            "reservationStatus": "Reserved",
            "customReference": "",
            "preRegistered": "false",
            "allowMobileCheckout": "false"
        },
        "_xmlns": "http://xmlns.oracle.com/cloud/adapter/REST/Receive/types"
    })
     .expect(200)
     .expect("Content-Type", /json/)
     .then(function (response) {
       // console.log(response)
      console.log("Update Reservation Done Successfully")
     });
});

it('GET Reservation OHIP after added company name', async function ({ supertest }) {
    await supertest
        .request(reservation.request)
        .get(reservation.Getendpath + reservationId)
        .set('Content-Type', reservation['Content-Type1'])
        .set('x-hotelid', reservation.hotelId)
        .set('x-app-key', reservation['x-app-key1'])
        .set('bypass-routing', reservation['bypass-routing'])
        .set('Authorization', 'Bearer ' + authToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(function (response) {
           // console.log(response.text);
            const responseBody = JSON.parse(response.text);
            const reservation = responseBody.reservations.reservation[0];
            const confirmationIdEntry = reservation.reservationIdList.find(idEntry => idEntry.type === 'Confirmation');
            confirmationId = confirmationIdEntry ? confirmationIdEntry.id : 'Not found';

            const externalReferenceIdEntry = reservation.externalReferences.find(ref => ref.idContext === 'CRS_HIEUAT');
            externalReferenceId = externalReferenceIdEntry ? externalReferenceIdEntry.id : 'Not found';

            
        
        
            // Check if roomRates and stayProfiles exist
            if (reservation.roomStay && reservation.roomStay.roomRates && reservation.roomStay.roomRates.length > 0) {
                const roomRate = reservation.roomStay.roomRates[0]; // Accessing the first roomRate
                if (roomRate.stayProfiles && roomRate.stayProfiles.length > 0) {
                    // Extracting CorporateId from stayProfiles
                    const corporateIdEntry = roomRate.stayProfiles[0].profileIdList
                        ? roomRate.stayProfiles[0].profileIdList.find(idEntry => idEntry.type === 'CorporateId')
                        : null;
                    const corporateId = corporateIdEntry ? corporateIdEntry.id : 'Not found';
        
                    // Extracting Company Name from stayProfiles
                    const companyName = roomRate.stayProfiles[0].profile && roomRate.stayProfiles[0].profile.company
                        ? roomRate.stayProfiles[0].profile.company.companyName
                        : 'Not found';
                    console.log("Status : Reservation created Successfully in OHIP");
                    console.log("Corporate ID:", corporateId);
                    console.log("Company Name:", companyName);
                    console.log("Reservation ID :", reservationId);
                    console.log('Confirmation ID:', confirmationId);
                     console.log('External Reference ID:', externalReferenceId);
                } else {
                    console.log("stayProfiles data is missing or empty in roomRates");
                }
            } else {
                console.log("roomRates data is missing or empty");
            }
            
        });
        
});

it('GET Reservation GRS after added company name', async function ({ supertest }) {
  await supertest
      .request(reservation.request2)
      .get(reservation.Getendpath1 + externalReferenceId)
      .query({
          lastName: reservation.surname4
      })
      .set('Content-Length', '0')
      .set('X-IHG-M2M', reservation['X-IHG-M2M'])
      .set('User-Agent', reservation['User-Agent'])
      .set('X-IHG-AUTO', reservation['X-IHG-AUTO'])
      .set('X-IHG-API-KEY', reservation['X-IHG-API-KEY'])
      .set('bypass-routing', reservation['bypass-routing'])
      .set('Authorization', 'Bearer ' + authToken1)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (response) {
      //  console.log(response.text)
          const responseBody = JSON.parse(response.text);
          const reservation = responseBody.hotelReservation;

          const ihgConfirmationNumberEntry = reservation.reservationIds.confirmationNumbers.find(entry => entry.ihgConfirmationNumber);
          ihgConfirmationNumber = ihgConfirmationNumberEntry ? ihgConfirmationNumberEntry.ihgConfirmationNumber : 'Not found';

          const externalConfirmationNumberEntry = reservation.reservationIds.confirmationNumbers.find(entry => entry.externalConfirmationNumber && entry.externalConfirmationNumber.number);
          externalConfirmationNumber = externalConfirmationNumberEntry ? externalConfirmationNumberEntry.externalConfirmationNumber.number : 'Not found';

          const pmsConfirmationNumberEntry = reservation.reservationIds.confirmationNumbers.find(entry => entry.pmsConfirmationNumber);
          pmsConfirmationNumber = pmsConfirmationNumberEntry ? pmsConfirmationNumberEntry.pmsConfirmationNumber : 'Not found';

          console.log("Status: Reservation created Successfully in GRS");
          console.log("IHG Confirmation Number:", ihgConfirmationNumber);
          console.log("External Confirmation Number:", externalConfirmationNumber);
          console.log("PMS Confirmation Number:", pmsConfirmationNumber);
      })
  });
     it('PUT Check Validation after added company name', async function ({ supertest }) {
        await supertest
          .request(reservation.request)
          .put(reservation.Putendpath)
          .set('Content-Type', reservation['Content-Type1'])
          .set('x-hotelid', reservation.hotelId)
          .set('x-app-key', reservation['x-app-key'])
          .set('bypass-routing', reservation['bypass-routing'])
          .set('Authorization', 'Bearer ' + authToken)
          .send(
            {
                "instructions": {
                    "instruction": [
                        "StayHeader",
                        "InventoryItems",
                        "Packages"
                    ]
                },
                "reservation": {
                    "reservationIdList": [
                        {
                            "type": "Reservation",
                            "idContext": "OPERA",
                            "id": reservationId
                        },
                        {
                            "type": "Confirmation",
                            "idContext": "OPERA",
                            "id": confirmationId
                        }
                    ],
                    "roomStay": {
                        "roomRates": [
                            {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "171",
                                            "currencyCode": "USD"
                                        },
                                        "discount": "",
                                        "eventStartDate": "2024-12-02",
                                        "startDate": "2024-12-02",
                                        "start": "2024-12-02",
                                        "end": "2024-12-02",
                                        "endDate": "2024-12-02",
                                        "eventEndDate": "2024-12-02"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "taxFreeGuestCounts": {
                                    "adults": "0",
                                    "children": "0"
                                },
                                "roomType": "KNGN",
                                "ratePlanCode": "IKPCM",
                                "marketCode": "K",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KNGN",
                                "fixedRate": "true",
                                "discountAllowed": "false",
                                "eventStartDate": "2024-12-02",
                                "startDate": "2024-12-02",
                                "start": "2024-12-02",
                                "end": "2024-12-02",
                                "endDate": "2024-12-02",
                                "eventEndDate": "2024-12-02"
                            },
                            {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "169",
                                            "currencyCode": "USD"
                                        },
                                        "discount": "",
                                        "eventStartDate": "2024-12-03",
                                        "startDate": "2024-12-03",
                                        "start": "2024-12-03",
                                        "end": "2024-12-03",
                                        "endDate": "2024-12-03",
                                        "eventEndDate": "2024-12-03"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "taxFreeGuestCounts": {
                                    "adults": "0",
                                    "children": "0"
                                },
                                "roomType": "KNGN",
                                "ratePlanCode": "IKPCM",
                                "marketCode": "K",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KNGN",
                                "fixedRate": "true",
                                "discountAllowed": "false",
                                "eventStartDate": "2024-12-03",
                                "startDate": "2024-12-03",
                                "start": "2024-12-03",
                                "end": "2024-12-03",
                                "endDate": "2024-12-03",
                                "eventEndDate": "2024-12-03"
                            },
                            {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "166",
                                            "currencyCode": "USD"
                                        },
                                        "discount": "",
                                        "eventStartDate": "2024-12-04",
                                        "startDate": "2024-12-04",
                                        "start": "2024-12-04",
                                        "end": "2024-12-04",
                                        "endDate": "2024-12-04",
                                        "eventEndDate": "2024-12-04"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "taxFreeGuestCounts": {
                                    "adults": "0",
                                    "children": "0"
                                },
                                "roomType": "KNGN",
                                "ratePlanCode": "IKPCM",
                                "marketCode": "K",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KNGN",
                                "fixedRate": "true",
                                "discountAllowed": "false",
                                "eventStartDate": "2024-12-04",
                                "startDate": "2024-12-04",
                                "start": "2024-12-04",
                                "end": "2024-12-04",
                                "endDate": "2024-12-04",
                                "eventEndDate": "2024-12-04"
                            },
                            {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "159",
                                            "currencyCode": "USD"
                                        },
                                        "discount": "",
                                        "eventStartDate": "2024-12-05",
                                        "startDate": "2024-12-05",
                                        "start": "2024-12-05",
                                        "end": "2024-12-05",
                                        "endDate": "2024-12-05",
                                        "eventEndDate": "2024-12-05"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "taxFreeGuestCounts": {
                                    "adults": "0",
                                    "children": "0"
                                },
                                "roomType": "KNGN",
                                "ratePlanCode": "IKPCM",
                                "marketCode": "K",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KNGN",
                                "fixedRate": "true",
                                "discountAllowed": "false",
                                "eventStartDate": "2024-12-05",
                                "startDate": "2024-12-05",
                                "start": "2024-12-05",
                                "end": "2024-12-05",
                                "endDate": "2024-12-05",
                                "eventEndDate": "2024-12-05"
                            },
                            {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "158",
                                            "currencyCode": "USD"
                                        },
                                        "discount": "",
                                        "eventStartDate": "2024-12-06",
                                        "startDate": "2024-12-06",
                                        "start": "2024-12-06",
                                        "end": "2024-12-06",
                                        "endDate": "2024-12-06",
                                        "eventEndDate": "2024-12-06"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "taxFreeGuestCounts": {
                                    "adults": "0",
                                    "children": "0"
                                },
                                "roomType": "KNGN",
                                "ratePlanCode": "IKPCM",
                                "marketCode": "K",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KNGN",
                                "fixedRate": "true",
                                "discountAllowed": "false",
                                "eventStartDate": "2024-12-06",
                                "startDate": "2024-12-06",
                                "start": "2024-12-06",
                                "end": "2024-12-06",
                                "endDate": "2024-12-06",
                                "eventEndDate": "2024-12-06"
                            },
                            {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "157",
                                            "currencyCode": "USD"
                                        },
                                        "discount": "",
                                        "eventStartDate": "2024-12-07",
                                        "startDate": "2024-12-07",
                                        "start": "2024-12-07",
                                        "end": "2024-12-07",
                                        "endDate": "2024-12-07",
                                        "eventEndDate": "2024-12-07"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "taxFreeGuestCounts": {
                                    "adults": "0",
                                    "children": "0"
                                },
                                "roomType": "KNGN",
                                "ratePlanCode": "IKPCM",
                                "marketCode": "K",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KNGN",
                                "fixedRate": "true",
                                "discountAllowed": "false",
                                "eventStartDate": "2024-12-07",
                                "startDate": "2024-12-07",
                                "start": "2024-12-07",
                                "end": "2024-12-07",
                                "endDate": "2024-12-07",
                                "eventEndDate": "2024-12-07"
                            },
                            {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "157",
                                            "currencyCode": "USD"
                                        },
                                        "discount": "",
                                        "eventStartDate": "2024-12-08",
                                        "startDate": "2024-12-08",
                                        "start": "2024-12-08",
                                        "end": "2024-12-08",
                                        "endDate": "2024-12-08",
                                        "eventEndDate": "2024-12-08"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "taxFreeGuestCounts": {
                                    "adults": "0",
                                    "children": "0"
                                },
                                "roomType": "KNGN",
                                "ratePlanCode": "IKPCM",
                                "marketCode": "K",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KNGN",
                                "fixedRate": "true",
                                "eventStartDate": "2024-12-08",
                                "startDate": "2024-12-08",
                                "start": "2024-12-08",
                                "end": "2024-12-08",
                                "endDate": "2024-12-08",
                                "eventEndDate": "2024-12-08"
                            },
                            {
                                "rates": {
                                    "rate": {
                                        "base": {
                                            "amountBeforeTax": "157",
                                            "currencyCode": "USD"
                                        },
                                        "discount": "",
                                        "eventStartDate": "2024-12-09",
                                        "startDate": "2024-12-09",
                                        "start": "2024-12-09",
                                        "end": "2024-12-09",
                                        "endDate": "2024-12-09",
                                        "eventEndDate": "2024-12-09"
                                    }
                                },
                                "stayProfiles": [
                                    {
                                        "reservationProfileType": "Company"
                                    },
                                    {
                                        "reservationProfileType": "Group"
                                    },
                                    {
                                        "reservationProfileType": "TravelAgent"
                                    },
                                    {
                                        "reservationProfileType": "ReservationContact"
                                    },
                                    {
                                        "reservationProfileType": "BillingContact"
                                    },
                                    {
                                        "reservationProfileType": "Source"
                                    }
                                ],
                                "guestCounts": {
                                    "adults": "1",
                                    "children": "0"
                                },
                                "taxFreeGuestCounts": {
                                    "adults": "0",
                                    "children": "0"
                                },
                                "roomType": "KNGN",
                                "ratePlanCode": "IKPCM",
                                "marketCode": "K",
                                "sourceCode": "GD",
                                "numberOfUnits": "1",
                                "pseudoRoom": "false",
                                "roomTypeCharged": "KNGN",
                                "fixedRate": "true",
                                "eventStartDate": "2024-12-09",
                                "startDate": "2024-12-09",
                                "start": "2024-12-09",
                                "end": "2024-12-09",
                                "endDate": "2024-12-09",
                                "eventEndDate": "2024-12-09"
                            }
                        ],
                        "guestCounts": {
                            "adults": "1",
                            "children": "0"
                        },
                        "expectedTimes": {
                            "reservationExpectedArrivalTime": "2024-12-04",
                            "resExpectedArrivalTime": "2024-12-04",
                            "reservationExpectedDepartureTime": "2024-12-10",
                            "resExpectedDepartureTime": "2024-12-10"
                        },
                        "guarantee": {
                            "guaranteeCode": "INN"
                        },
                        "arrivalDate": "2024-12-04",
                        "departureDate": "2024-12-10"
                    },
                    "reservationGuests": {
                        "profileInfo": {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "45532"
                            },
                            "profile": {
                                "customer": {
                                    "personName": [
                                        {
                                            "givenName": "Test",
                                            "surname": "Raja",
                                            "nameType": "Primary",
                                            "language": "E"
                                        },
                                        {
                                            "nameType": "Alternate"
                                        }
                                    ],
                                    "language": "E"
                                },
                                "addresses": {
                                    "addressInfo": {
                                        "address": {
                                            "isValidated": "false",
                                            "addressLine": [
                                                "",
                                                "",
                                                "",
                                                ""
                                            ],
                                            "country": ""
                                        }
                                    }
                                },
                                "telephones": {
                                    "telephoneInfo": {
                                        "telephone": {
                                            "phoneTechType": "PHONE",
                                            "phoneUseType": "HOME",
                                            "phoneNumber": "913-999-0066",
                                            "primaryInd": "true",
                                            "primary": "true"
                                        },
                                        "type": "Communication",
                                        "idContext": "OPERA",
                                        "id": "72549"
                                    }
                                }
                            }
                        },
                        "arrivalTransport": {
                            "transportationReqd": "false"
                        },
                        "departureTransport": {
                            "transportationReqd": "false"
                        }
                    },
                    "hotelId": "GRVXX",
                    "reservationStatus": "Reserved",
                    "walkIn": "false",
                    "customReference": "",
                    "displayColor": "",
                    "preRegistered": "false",
                    "allowMobileCheckout": "false",
                    "overrideOutOfServiceCheck": "true"
                },
                "timeSpan": {
                    "startDate": "2024-12-04",
                    "endDate": "2024-12-10"
                },
                "_xmlns": "http://xmlns.oracle.com/cloud/adapter/REST/Receive/types"
            }
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .then(function (response) {
            console.log("Validation done Successfully")
          })
      });

  it("PUT Update Reservation", async function ({ supertest }) {
    await supertest
   .request(reservation.request)
   .put(reservation.Getendpath + reservationId)
   .set("Content-Type", reservation['Content-Type1'])
   .set("x-hotelid", reservation.hotelId)
   .set("x-app-key", reservation['x-app-key1'])
   .set("bypass-routing", reservation['bypass-routing'])
   .set("Authorization", "Bearer " + authToken)
   .send({
    "reservations": {
        "responseInstructions": {
            "confirmationOnly": "true"
        },
        "changeInstrunctions": {
            "updatePackagePrice": "false",
            "changeAllShares": "false",
            "overrideInventory": "true"
        },
        "reservationIdList": {
            "type": "Reservation",
            "idContext": "OPERA",
            "id": reservationId
        },
        "roomStay": {
            "currentRoomInfo": {
                "roomType": "KNGN"
            },
            "roomRates": [
                {
                    "rates": {
                        "rate": {
                            "base": {
                                "amountBeforeTax": "171",
                                "currencyCode": "USD"
                            },
                            "discount": "",
                            "eventStartDate": "2024-12-02",
                            "startDate": "2024-12-02",
                            "start": "2024-12-02",
                            "end": "2024-12-02",
                            "endDate": "2024-12-02",
                            "eventEndDate": "2024-12-02"
                        }
                    },
                    "stayProfiles": [
                        {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "36970"
                            },
                            "resProfileType": "Company",
                            "reservationProfileType": "Company"
                        },
                        {
                            "resProfileType": "Group",
                            "reservationProfileType": "Group"
                        },
                        {
                            "resProfileType": "TravelAgent",
                            "reservationProfileType": "TravelAgent"
                        },
                        {
                            "resProfileType": "ReservationContact",
                            "reservationProfileType": "ReservationContact"
                        },
                        {
                            "resProfileType": "BillingContact",
                            "reservationProfileType": "BillingContact"
                        },
                        {
                            "resProfileType": "Source",
                            "reservationProfileType": "Source"
                        }
                    ],
                    "guestCounts": {
                        "adults": "1",
                        "children": "0"
                    },
                    "taxFreeGuestCounts": {
                        "adults": "0",
                        "children": "0"
                    },
                    "roomType": "KNGN",
                    "ratePlanCode": "IKPCM",
                    "marketCode": "K",
                    "sourceCode": "GD",
                    "numberOfUnits": "1",
                    "pseudoRoom": "false",
                    "roomTypeCharged": "KNGN",
                    "fixedRate": "true",
                    "discountAllowed": "false",
                    "eventStartDate": "2024-12-02",
                    "startDate": "2024-12-02",
                    "start": "2024-12-02",
                    "end": "2024-12-02",
                    "endDate": "2024-12-02",
                    "eventEndDate": "2024-12-02"
                },
                {
                    "rates": {
                        "rate": {
                            "base": {
                                "amountBeforeTax": "169",
                                "currencyCode": "USD"
                            },
                            "discount": "",
                            "eventStartDate": "2024-12-03",
                            "startDate": "2024-12-03",
                            "start": "2024-12-03",
                            "end": "2024-12-03",
                            "endDate": "2024-12-03",
                            "eventEndDate": "2024-12-03"
                        }
                    },
                    "stayProfiles": [
                        {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "36970"
                            },
                            "resProfileType": "Company",
                            "reservationProfileType": "Company"
                        },
                        {
                            "resProfileType": "Group",
                            "reservationProfileType": "Group"
                        },
                        {
                            "resProfileType": "TravelAgent",
                            "reservationProfileType": "TravelAgent"
                        },
                        {
                            "resProfileType": "ReservationContact",
                            "reservationProfileType": "ReservationContact"
                        },
                        {
                            "resProfileType": "BillingContact",
                            "reservationProfileType": "BillingContact"
                        },
                        {
                            "resProfileType": "Source",
                            "reservationProfileType": "Source"
                        }
                    ],
                    "guestCounts": {
                        "adults": "1",
                        "children": "0"
                    },
                    "taxFreeGuestCounts": {
                        "adults": "0",
                        "children": "0"
                    },
                    "roomType": "KNGN",
                    "ratePlanCode": "IKPCM",
                    "marketCode": "K",
                    "sourceCode": "GD",
                    "numberOfUnits": "1",
                    "pseudoRoom": "false",
                    "roomTypeCharged": "KNGN",
                    "fixedRate": "true",
                    "discountAllowed": "false",
                    "eventStartDate": "2024-12-03",
                    "startDate": "2024-12-03",
                    "start": "2024-12-03",
                    "end": "2024-12-03",
                    "endDate": "2024-12-03",
                    "eventEndDate": "2024-12-03"
                },
                {
                    "rates": {
                        "rate": {
                            "base": {
                                "amountBeforeTax": "166",
                                "currencyCode": "USD"
                            },
                            "discount": "",
                            "eventStartDate": "2024-12-04",
                            "startDate": "2024-12-04",
                            "start": "2024-12-04",
                            "end": "2024-12-04",
                            "endDate": "2024-12-04",
                            "eventEndDate": "2024-12-04"
                        }
                    },
                    "stayProfiles": [
                        {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "36970"
                            },
                            "resProfileType": "Company",
                            "reservationProfileType": "Company"
                        },
                        {
                            "resProfileType": "Group",
                            "reservationProfileType": "Group"
                        },
                        {
                            "resProfileType": "TravelAgent",
                            "reservationProfileType": "TravelAgent"
                        },
                        {
                            "resProfileType": "ReservationContact",
                            "reservationProfileType": "ReservationContact"
                        },
                        {
                            "resProfileType": "BillingContact",
                            "reservationProfileType": "BillingContact"
                        },
                        {
                            "resProfileType": "Source",
                            "reservationProfileType": "Source"
                        }
                    ],
                    "guestCounts": {
                        "adults": "1",
                        "children": "0"
                    },
                    "taxFreeGuestCounts": {
                        "adults": "0",
                        "children": "0"
                    },
                    "roomType": "KNGN",
                    "ratePlanCode": "IKPCM",
                    "marketCode": "K",
                    "sourceCode": "GD",
                    "numberOfUnits": "1",
                    "roomId": "",
                    "pseudoRoom": "false",
                    "roomTypeCharged": "KNGN",
                    "fixedRate": "true",
                    "discountAllowed": "false",
                    "eventStartDate": "2024-12-04",
                    "startDate": "2024-12-04",
                    "start": "2024-12-04",
                    "end": "2024-12-04",
                    "endDate": "2024-12-04",
                    "eventEndDate": "2024-12-04"
                },
                {
                    "rates": {
                        "rate": {
                            "base": {
                                "amountBeforeTax": "159",
                                "currencyCode": "USD"
                            },
                            "discount": "",
                            "eventStartDate": "2024-12-05",
                            "startDate": "2024-12-05",
                            "start": "2024-12-05",
                            "end": "2024-12-05",
                            "endDate": "2024-12-05",
                            "eventEndDate": "2024-12-05"
                        }
                    },
                    "stayProfiles": [
                        {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "36970"
                            },
                            "resProfileType": "Company",
                            "reservationProfileType": "Company"
                        },
                        {
                            "resProfileType": "Group",
                            "reservationProfileType": "Group"
                        },
                        {
                            "resProfileType": "TravelAgent",
                            "reservationProfileType": "TravelAgent"
                        },
                        {
                            "resProfileType": "ReservationContact",
                            "reservationProfileType": "ReservationContact"
                        },
                        {
                            "resProfileType": "BillingContact",
                            "reservationProfileType": "BillingContact"
                        },
                        {
                            "resProfileType": "Source",
                            "reservationProfileType": "Source"
                        }
                    ],
                    "guestCounts": {
                        "adults": "1",
                        "children": "0"
                    },
                    "taxFreeGuestCounts": {
                        "adults": "0",
                        "children": "0"
                    },
                    "roomType": "KNGN",
                    "ratePlanCode": "IKPCM",
                    "marketCode": "K",
                    "sourceCode": "GD",
                    "numberOfUnits": "1",
                    "roomId": "",
                    "pseudoRoom": "false",
                    "roomTypeCharged": "KNGN",
                    "fixedRate": "true",
                    "discountAllowed": "false",
                    "eventStartDate": "2024-12-05",
                    "startDate": "2024-12-05",
                    "start": "2024-12-05",
                    "end": "2024-12-05",
                    "endDate": "2024-12-05",
                    "eventEndDate": "2024-12-05"
                },
                {
                    "rates": {
                        "rate": {
                            "base": {
                                "amountBeforeTax": "158",
                                "currencyCode": "USD"
                            },
                            "discount": "",
                            "eventStartDate": "2024-12-06",
                            "startDate": "2024-12-06",
                            "start": "2024-12-06",
                            "end": "2024-12-06",
                            "endDate": "2024-12-06",
                            "eventEndDate": "2024-12-06"
                        }
                    },
                    "stayProfiles": [
                        {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "36970"
                            },
                            "resProfileType": "Company",
                            "reservationProfileType": "Company"
                        },
                        {
                            "resProfileType": "Group",
                            "reservationProfileType": "Group"
                        },
                        {
                            "resProfileType": "TravelAgent",
                            "reservationProfileType": "TravelAgent"
                        },
                        {
                            "resProfileType": "ReservationContact",
                            "reservationProfileType": "ReservationContact"
                        },
                        {
                            "resProfileType": "BillingContact",
                            "reservationProfileType": "BillingContact"
                        },
                        {
                            "resProfileType": "Source",
                            "reservationProfileType": "Source"
                        }
                    ],
                    "guestCounts": {
                        "adults": "1",
                        "children": "0"
                    },
                    "taxFreeGuestCounts": {
                        "adults": "0",
                        "children": "0"
                    },
                    "roomType": "KNGN",
                    "ratePlanCode": "IKPCM",
                    "marketCode": "K",
                    "sourceCode": "GD",
                    "numberOfUnits": "1",
                    "roomId": "",
                    "pseudoRoom": "false",
                    "roomTypeCharged": "KNGN",
                    "fixedRate": "true",
                    "discountAllowed": "false",
                    "eventStartDate": "2024-12-06",
                    "startDate": "2024-12-06",
                    "start": "2024-12-06",
                    "end": "2024-12-06",
                    "endDate": "2024-12-06",
                    "eventEndDate": "2024-12-06"
                },
                {
                    "rates": {
                        "rate": {
                            "base": {
                                "amountBeforeTax": "157",
                                "currencyCode": "USD"
                            },
                            "discount": "",
                            "eventStartDate": "2024-12-07",
                            "startDate": "2024-12-07",
                            "start": "2024-12-07",
                            "end": "2024-12-07",
                            "endDate": "2024-12-07",
                            "eventEndDate": "2024-12-07"
                        }
                    },
                    "stayProfiles": [
                        {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "36970"
                            },
                            "resProfileType": "Company",
                            "reservationProfileType": "Company"
                        },
                        {
                            "resProfileType": "Group",
                            "reservationProfileType": "Group"
                        },
                        {
                            "resProfileType": "TravelAgent",
                            "reservationProfileType": "TravelAgent"
                        },
                        {
                            "resProfileType": "ReservationContact",
                            "reservationProfileType": "ReservationContact"
                        },
                        {
                            "resProfileType": "BillingContact",
                            "reservationProfileType": "BillingContact"
                        },
                        {
                            "resProfileType": "Source",
                            "reservationProfileType": "Source"
                        }
                    ],
                    "guestCounts": {
                        "adults": "1",
                        "children": "0"
                    },
                    "taxFreeGuestCounts": {
                        "adults": "0",
                        "children": "0"
                    },
                    "roomType": "KNGN",
                    "ratePlanCode": "IKPCM",
                    "marketCode": "K",
                    "sourceCode": "GD",
                    "numberOfUnits": "1",
                    "roomId": "",
                    "pseudoRoom": "false",
                    "roomTypeCharged": "KNGN",
                    "fixedRate": "true",
                    "discountAllowed": "false",
                    "eventStartDate": "2024-12-07",
                    "startDate": "2024-12-07",
                    "start": "2024-12-07",
                    "end": "2024-12-07",
                    "endDate": "2024-12-07",
                    "eventEndDate": "2024-12-07"
                },
                {
                    "rates": {
                        "rate": {
                            "base": {
                                "amountBeforeTax": "157",
                                "currencyCode": "USD"
                            },
                            "discount": "",
                            "eventStartDate": "2024-12-08",
                            "startDate": "2024-12-08",
                            "start": "2024-12-08",
                            "end": "2024-12-08",
                            "endDate": "2024-12-08",
                            "eventEndDate": "2024-12-08"
                        }
                    },
                    "stayProfiles": [
                        {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "36970"
                            },
                            "resProfileType": "Company",
                            "reservationProfileType": "Company"
                        },
                        {
                            "resProfileType": "Group",
                            "reservationProfileType": "Group"
                        },
                        {
                            "resProfileType": "TravelAgent",
                            "reservationProfileType": "TravelAgent"
                        },
                        {
                            "resProfileType": "ReservationContact",
                            "reservationProfileType": "ReservationContact"
                        },
                        {
                            "resProfileType": "BillingContact",
                            "reservationProfileType": "BillingContact"
                        },
                        {
                            "resProfileType": "Source",
                            "reservationProfileType": "Source"
                        }
                    ],
                    "guestCounts": {
                        "adults": "1",
                        "children": "0"
                    },
                    "taxFreeGuestCounts": {
                        "adults": "0",
                        "children": "0"
                    },
                    "roomType": "KNGN",
                    "ratePlanCode": "IKPCM",
                    "marketCode": "K",
                    "sourceCode": "GD",
                    "numberOfUnits": "1",
                    "roomId": "",
                    "pseudoRoom": "false",
                    "roomTypeCharged": "KNGN",
                    "fixedRate": "true",
                    "discountAllowed": "false",
                    "eventStartDate": "2024-12-08",
                    "startDate": "2024-12-08",
                    "start": "2024-12-08",
                    "end": "2024-12-08",
                    "endDate": "2024-12-08",
                    "eventEndDate": "2024-12-08"
                },
                {
                    "rates": {
                        "rate": {
                            "base": {
                                "amountBeforeTax": "157",
                                "currencyCode": "USD"
                            },
                            "discount": "",
                            "eventStartDate": "2024-12-09",
                            "startDate": "2024-12-09",
                            "start": "2024-12-09",
                            "end": "2024-12-09",
                            "endDate": "2024-12-09",
                            "eventEndDate": "2024-12-09"
                        }
                    },
                    "stayProfiles": [
                        {
                            "profileIdList": {
                                "type": "Profile",
                                "idContext": "OPERA",
                                "id": "36970"
                            },
                            "resProfileType": "Company",
                            "reservationProfileType": "Company"
                        },
                        {
                            "resProfileType": "Group",
                            "reservationProfileType": "Group"
                        },
                        {
                            "resProfileType": "TravelAgent",
                            "reservationProfileType": "TravelAgent"
                        },
                        {
                            "resProfileType": "ReservationContact",
                            "reservationProfileType": "ReservationContact"
                        },
                        {
                            "resProfileType": "BillingContact",
                            "reservationProfileType": "BillingContact"
                        },
                        {
                            "resProfileType": "Source",
                            "reservationProfileType": "Source"
                        }
                    ],
                    "guestCounts": {
                        "adults": "1",
                        "children": "0"
                    },
                    "taxFreeGuestCounts": {
                        "adults": "0",
                        "children": "0"
                    },
                    "roomType": "KNGN",
                    "ratePlanCode": "IKPCM",
                    "marketCode": "K",
                    "sourceCode": "GD",
                    "numberOfUnits": "1",
                    "roomId": "",
                    "pseudoRoom": "false",
                    "roomTypeCharged": "KNGN",
                    "fixedRate": "true",
                    "discountAllowed": "false",
                    "eventStartDate": "2024-12-09",
                    "startDate": "2024-12-09",
                    "start": "2024-12-09",
                    "end": "2024-12-09",
                    "endDate": "2024-12-09",
                    "eventEndDate": "2024-12-09"
                }
            ],
            "guestCounts": {
                "adults": "1",
                "children": "0"
            },
            "expectedTimes": {
                "reservationExpectedArrivalTime": "2024-12-04",
                "resExpectedArrivalTime": "2024-12-04",
                "reservationExpectedDepartureTime": "2024-12-10",
                "resExpectedDepartureTime": "2024-12-10"
            },
            "guarantee": {
                "guaranteeCode": "INN"
            },
            "promotion": "",
            "arrivalDate": "2024-12-04",
            "departureDate": "2024-12-10"
        },
        "reservationGuests": {
            "profileInfo": {
                "profileIdList": {
                    "type": "Profile",
                    "idContext": "OPERA",
                    "id": "45532"
                },
                "profile": {
                    "customer": {
                        "personName": [
                            {
                                "givenName": "Test",
                                "surname": "Raja",
                                "nameType": "Primary",
                                "language": "E"
                            },
                            {
                                "nameType": "Alternate"
                            }
                        ]
                    }
                }
            },
            "arrivalTransport": {
                "transportationReqd": "false"
            },
            "departureTransport": {
                "transportationReqd": "false"
            }
        },
        "additionalGuestInfo": "",
        "reservationProfiles": {
            "reservationProfile": [
                {
                    "profileIdList": {
                        "type": "Profile",
                        "idContext": "OPERA",
                        "id": "36970"
                    },
                    "profile": {
                        "company": {
                            "companyName": "FEDEX CORPORATION SUPPLY CHAIN"
                        }
                    },
                    "reservationProfileType": "Company"
                },
                {
                    "reservationProfileType": "Group"
                },
                {
                    "reservationProfileType": "TravelAgent"
                },
                {
                    "reservationProfileType": "ReservationContact"
                },
                {
                    "reservationProfileType": "Source"
                },
                {
                    "reservationProfileType": "BillingContact"
                },
                {
                    "reservationProfileType": "Addressee"
                }
            ],
            "commissionPayoutTo": "None"
        },
        "reservationCommunication": {
            "telephones": {
                "telephoneInfo": [
                    {
                        "telephone": {
                            "orderSequence": "1"
                        }
                    },
                    {
                        "telephone": {
                            "orderSequence": "2"
                        }
                    }
                ]
            },
            "emails": {
                "emailInfo": [
                    {
                        "email": {
                            "orderSequence": "1"
                        }
                    },
                    {
                        "email": {
                            "orderSequence": "2"
                        }
                    }
                ]
            }
        },
        "cashiering": {
            "taxType": {
                "code": "0",
                "collectingAgentTax": "false",
                "printAutoAdjust": "false"
            },
            "reverseCheckInAllowed": "false",
            "reverseAdvanceCheckInAllowed": "false"
        },
        "overrideInstructions": {
            "date": "2024-10-02",
            "type": "AVAILABILITY"
        },
        "hotelId": "GRVXX",
        "reservationStatus": "Reserved",
        "printRate": "true",
        "customReference": "",
        "displayColor": "",
        "markAsRecentlyAccessed": "true",
        "preRegistered": "false",
        "allowMobileCheckout": "false",
        "optedForCommunication": "false",
        "overrideOutOfServiceCheck": "true"
    },
    "_xmlns": "http://xmlns.oracle.com/cloud/adapter/REST/Receive/types"
})
   .expect(200)
   .expect("Content-Type", /json/)
   .then(function (response) {
    //console.log(response)
    console.log("Update Reservation Done Successfully")
   });
});
});