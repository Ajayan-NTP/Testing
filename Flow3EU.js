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
let reservation1
let reservation2
//let excelData = [];

const FilePath = './Config.json';
const Data = JSON.parse(fs.readFileSync(FilePath, 'utf8'));
const filepath = Data.filepath;
 
// Load the JSON data from the file
const jsonFilePath = filepath.jsoninputpath2;
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
                username: reservation.username,
                password: reservation.password,
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
                username: reservation.username1,
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
          .set('x-app-key', reservation['x-app-key'])
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
            .set('x-app-key', reservation['x-app-key'])
            .set('bypass-routing', reservation['bypass-routing'])
            .set('Authorization', 'Bearer ' + authToken)
            .send( {
              "reservations": {
                "reservation": {
                  "roomStay": {
                    "roomRates": {
                      "rates": {
                        "rate": {
                          "base": {
                            "amountBeforeTax": "161",
                            "baseAmount": "161"
                          },
                          "start": "2024-11-28",
                          "end": "2024-11-28"
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
                      "roomType": reservation.roomType,
                      "ratePlanCode": "IGCOR",
                      "marketCode": "G",
                      "sourceCode": "GD",
                      "numberOfUnits": "1",
                      "pseudoRoom": "false",
                      "roomTypeCharged": reservation.roomType,
                      "start": "2024-11-28",
                      "end": "2024-11-28"
                    },
                    "guestCounts": {
                      "adults": "1",
                      "children": "0"
                    },
                    "expectedTimes": {
                      "reservationExpectedArrivalTime": "2024-11-28",
                      "reservationExpectedDepartureTime": "2024-11-29"
                    },
                    "guarantee": {
                      "guaranteeCode": "CC",
                      "onHold": "false"
                    },
                    "arrivalDate": "2024-11-28",
                    "departureDate": "2024-11-29"
                  },
                  "reservationGuests": {
                    "profileInfo": {
                      "profileIdList": {
                        "type": "Profile",
                        "id": reservation.profileId
                      },
                      "profile": {
                        "customer": {
                          "personName": [
                            {
                              "givenName": reservation.givenName,
                              "surname": reservation.lastName,
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
                              "country": {
                                "code": "US"
                              },
                              "type": "HOME"
                            },
                            "type": "Address",
                            "id": reservation.addressId
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
                      "paymentCard": {
                        "cardType": "Ax",
                        "cardNumber": "378282246310005",
                        "cardNumberMasked": "XXXXXXXXXXXX0005",
                        "expirationDate": "2028-05-30",
                        "cardHolderName": "KP Mahavignesh",
                        "cardOrToken": "Token"
                      },
                      "emailFolioInfo": {
                        "emailFolio": "false"
                      },
                      "paymentMethod": "AX",
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
                  "hotelId": "GRVEU",
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
               // console.log(response)
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
          .set('x-app-key', reservation['x-app-key'])
          .set('bypass-routing', reservation['bypass-routing'])
          .set('Authorization', 'Bearer ' + authToken)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(function (response) {
              const responseBody = JSON.parse(response.text);
              const reservation = responseBody.reservations.reservation[0];

              const confirmationIdEntry = reservation.reservationIdList.find(idEntry => idEntry.type === 'Confirmation');
              confirmationId = confirmationIdEntry ? confirmationIdEntry.id : 'Not found';

              const externalReferenceIdEntry = reservation.externalReferences.find(ref => ref.idContext === 'CRS_IHGGEU');
              externalReferenceId = externalReferenceIdEntry ? externalReferenceIdEntry.id : 'Not found';
              const paymentMethod = reservation.reservationPaymentMethods[0];
              const cardId1 = paymentMethod.paymentCard.cardId.id;
              cardId=cardId1
                   console.log('Card ID:', cardId);

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
            lastName: reservation.lastName
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
    it('POST Create share Reservation', async function ({ supertest }) {
      await supertest
          .request(reservation.request)
          .post(`/rsv/v1/hotels/GRVEU/reservations/${reservationId}/shares`)
          .set('Content-Type', reservation['Content-Type1'])
          .set('x-hotelid', reservation.hotelId)
          .set('x-app-key', reservation['x-app-key'])
          .set('bypass-routing', reservation['bypass-routing'])
          .set('Authorization', 'Bearer ' + authToken)
          .send( {
        "criteria": {
          "combineShareInstruction": {
            "distributionType": "Full",
            "overrideInventoryCheck": "true",
            "roomMoveCheckedinResv": "true",
            "overrideMaxOccupancyCheck": "true"
          },
          "hotelId": "GRVEU",
          "shareToReservation": {
            "reservationIdList": {
              "type": "Reservation",
              "idContext": "OPERA",
              "id": reservationId
            }
          },
          "newReservations": {
            "newSharerId": {
              "type": "Profile",
              "idContext": "OPERA",
              "id": reservation.profileId
            },
            "guestCounts": {
              "adults": "1",
              "children": "0"
            },
            "reservationPaymentMethods": {
              "copyCreditCards": "false",
              "copyOthers": "false",
              "reservationPaymentMethod": {
                "paymentCard": {
                  "cardId": {
                    "type": "CreditCard",
                    "id": cardId
                  },
                  "cardType": "Ax",
                                      "cardNumber": "378282246310005",
                                      "cardNumberMasked": "XXXXXXXXXXXX0005",
                                      "expirationDate": "2028-05-30",
                                      "cardHolderName": "KP Mahavignesh",
                                      "cardOrToken": "Token"
                },
                "emailFolioInfo": {
                  "emailFolio": "false"
                },
                "paymentMethod": "AX",
                "folioView": "1"
              }
            },
            "guarantee": "",
            "timeSpan": {
              "startDate": reservation.arrivalDate,
              "endDate": reservation.departureDate
            },
            "blockDates": {
              "startDate": reservation.arrivalDate,
              "endDate": reservation.departureDate
            }
          }
        },
        "_xmlns": "http://xmlns.oracle.com/cloud/adapter/REST/CreateShare/types"
      })
          .expect(201)
          .expect('Content-Type', /json/)
          .then(function (response) {
           //  console.log(response)
              
          });
  });
  it('GET Reservation OHIP after share', async function ({ supertest }) {
      await supertest
          .request(reservation.request)
          .get(reservation.Getendpath + reservationId)
          .set('Content-Type', reservation['Content-Type1'])
          .set('x-hotelid', reservation.hotelId)
          .set('x-app-key', reservation['x-app-key'])
          .set('bypass-routing', reservation['bypass-routing'])
          .set('Authorization', 'Bearer ' + authToken)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(function (response) {
            //  console.log(response.text);
              const responseBody = JSON.parse(response.text);
              const reservation = responseBody.reservations.reservation[0];
               const externalReferenceIdEntry = reservation.externalReferences.find(ref => ref.idContext === 'CRS_IHGGEU');
               externalReferenceId = externalReferenceIdEntry ? externalReferenceIdEntry.id : 'Not found';
              // Extracting the specific id for IHGSSHAREID
              const ihgShareIdEntry = reservation.externalReferences.find(ref => ref.idContext === 'IHGSSHAREID');
              const ihgShareId = ihgShareIdEntry ? ihgShareIdEntry.id : 'Not found';
   
            //  console.log("Status : Reservation created Successfully in OHIP");
              // console.log("Reservation ID :", reservationId);
              // console.log('Confirmation ID:', confirmationId);
              console.log('External Reference ID:', externalReferenceId);
              console.log("IHG Share ID:", ihgShareId);
          
              // Extracting reservation IDs from the main reservation
              const mainReservationId = reservation.reservationIdList.find(idEntry => idEntry.type === 'Reservation').id;
              const mainConfirmationId = reservation.reservationIdList.find(idEntry => idEntry.type === 'Confirmation').id;
          
              // Extracting IDs from the linked reservations
              let linkedReservationId = 'Not found';
              let linkedConfirmationId = 'Not found';
              
              if (reservation.linkedReservation && reservation.linkedReservation.reservationInfo) {
                  const linkedRes = reservation.linkedReservation.reservationInfo[0];  // Assuming you want the first linked reservation
                  linkedReservationId = linkedRes.reservationIdList.find(idEntry => idEntry.type === 'Reservation').id;
                  linkedConfirmationId = linkedRes.reservationIdList.find(idEntry => idEntry.type === 'Confirmation').id;
              }
          
              // Setting variables
              const id1 = mainReservationId;
              reservation1=id1
              const id2 = linkedReservationId;
              reservation2=id2
          
              // Logging results
              console.log("Status: Reservation created Successfully in OHIP");
              console.log("Main Reservation ID:", mainReservationId);
              console.log("Main Confirmation ID:", mainConfirmationId);
              console.log("Linked Reservation ID:", linkedReservationId);
              console.log("Linked Confirmation ID:", linkedConfirmationId);
              
              console.log("ID 1 (Main Reservation):", id1);
              console.log("ID 2 (Linked Reservation):", id2);
          });
          
  });
    it("PUT Update Reservation  expired date in CC", async function ({ supertest }) {
      await supertest
     .request(reservation.request)
     .put(reservation.Getendpath + reservationId)
     .set("Content-Type", reservation['Content-Type1'])
     .set("x-hotelid", reservation.hotelId)
     .set("x-app-key", reservation['x-app-key'])
     .set("bypass-routing", reservation['bypass-routing1'])
     .set("Authorization", "Bearer " + authToken)
     .send({
      "reservations": [
          {
              "changeInstrunctions": {
                  "changeAllShares": false,
                  "overrideInventory": false
              },
              "reservationIdList": [
                  {
                      "type": "Reservation",
                      "id": reservationId
                  }
              ],
              "roomStay": {
                  "guarantee": {
                      "guaranteeCode": "CC"
                  }
              },
              "reservationPaymentMethods": [
                  {
                      "paymentCard": {
                          "cardType": "Ax",
                          "cardNumber": "378282246310005",
                          "cardNumberMasked": "XXXXXXXXXXXX0005",
                          "expirationDate": "2024-05-30",
                          "cardHolderName": "KP Mahavignesh",
                          "cardOrToken": "Token"
                      },
                      "paymentMethod": "AX",
                      "folioView": "1"
                  }
              ],
              "cashiering": {
                  "billingPrivileges": {
                      "postingRestriction": true,
                      "preStayCharging": false,
                      "postStayCharging": false,
                      "videoCheckout": true,
                      "autoSettlement": false
                  },
                  "reverseCheckInAllowed": false,
                  "reverseAdvanceCheckInAllowed": false
              },
              "overrideInstructions": [],
              "hotelId": "GRVEU",
              "customReference": "",
              "preRegistered": false,
              "allowAutoCheckin": false,
              "allowMobileCheckout": false
          }
      ]
  })
     .expect(200)
     .expect("Content-Type", /json/)
     .then(function (response) {
      console.log("Update Reservation Done Successfully")
     });
});


it("PUT Update Reservation in room counts", async function ({ supertest }) {
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
    "responseInstructions": {
      "confirmationOnly": true
    },
    "changeInstrunctions": {
      "updatePackagePrice": false,
      "changeAllShares": false,
      "overrideInventory": true
    },
    "reservationIdList": {
      "type": "Reservation",
      "idContext": "OPERA",
      "id": reservationId
    },
    "roomStay": {
      "currentRoomInfo": {
        "roomType": reservation.roomType
      },
      "roomRates": {
        "rates": {
          "rate": {
            "base": {
              "amountBeforeTax": 161,
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
        "numberOfUnits": reservation.numberOfUnits1,
        "roomId": "",
        "pseudoRoom": false,
        "roomTypeCharged": reservation.roomTypeCharged,
        "fixedRate": true,
        "discountAllowed": false,
        "eventStartDate": reservation.startDate,
        "startDate": reservation.startDate,
        "start": reservation.startDate,
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
        "guaranteeCode": "CC"
      },
      "promotion": "",
      "arrivalDate": reservation.arrivalDate,
      "departureDate": reservation.departureDate
    },
    "reservationGuests": {
      "profileInfo": {
        "profileIdList": {
          "type": "Profile",
          "idContext": "OPERA",
          "id": reservation.profileId3
        },
        "profile": {
          "customer": {
            "personName": [
              {
                "givenName": reservation.givenName3,
                "surname": reservation.lastName3,
                "nameType": "Primary"
              },
              {
                "nameType": "Alternate"
              }
            ]
          }
        }
      },
      "arrivalTransport": {
        "transportationReqd": false
      },
      "departureTransport": {
        "transportationReqd": false
      }
    },
    "additionalGuestInfo": "",
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
              "orderSequence": 1
            }
          },
          {
            "telephone": {
              "orderSequence": 2
            }
          }
        ]
      },
      "emails": {
        "emailInfo": [
          {
            "email": {
              "orderSequence": 1
            }
          },
          {
            "email": {
              "orderSequence": 2
            }
          }
        ]
      }
    },
    "cashiering": {
      "taxType": {
        "code": 0,
        "collectingAgentTax": false,
        "printAutoAdjust": false
      },
      "reverseCheckInAllowed": false,
      "reverseAdvanceCheckInAllowed": false
    },
    "overrideInstructions": {
      "date": "2024-09-25",
      "type": "AVAILABILITY"
    },
    "hotelId": reservation.hotelId,
    "reservationStatus": "Reserved",
    "printRate": true,
    "customReference": "",
    "displayColor": "",
    "markAsRecentlyAccessed": true,
    "preRegistered": false,
    "allowMobileCheckout": false,
    "optedForCommunication": false,
    "overrideOutOfServiceCheck": true
     },
 })
 .expect(400)
 .expect("Content-Type", /json/)
 .then(function (response) {
 // console.log(response.text)
  const data = JSON.parse(response.text);
  const message = data.detail;
   console.log("Message: ", message);
  console.log("Update Reservation Done Successfully")
 });
});


});