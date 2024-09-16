const fs = require('fs');
const supertest = require('supertest');
const path = require('path');




// Load the JSON data from the file
const jsonFilePath = 'C:/Users/Ajayan/NightWatch/nightwatch/Block_Flows/BLOCK_za/GRVZA.json';
const testData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
//console.log(testData);
let externalReferenceId;
let pmsConfirmationNumber;
let externalConfirmationNumber;
let ihgConfirmationNumber;

let reservationId;
let authToken1;
let BlockID; 
let authToken;
 // Variable to store the campaign id from the first program's response 
 const reservation = testData.reservation;
 describe('api Authu Token', function () {
    const reservation = testData.reservation;
    before(async function () {
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
                authToken1 = response.body.access_token;
                //console.log('Auth Token:', authToken1); // Logging the token
            });
        })


  it('post api test to create the group block', async function({supertest}) {
    await supertest
    .request(reservation.request)
    .post(reservation.Postendpath3)
    .set('Content-Type', reservation['Content-Type1'])
    .set('x-hotelid', reservation.hotelId)
    .set('x-app-key', reservation['x-app-key'])
    .set('bypass-routing', reservation['bypass-routing'])
    .set('Authorization', 'Bearer ' + authToken1)
    .send(
        {
            "blocks": {
                "blockInfo": {
                    "block": {
                        "blockDetails": {
                            "blockCode": reservation.blockcode,
                            "blockName": "allocation",
                            "timeSpan": {
                                "startDate": reservation.arrivalDate,
                                "endDate": reservation.departureDate
                            },
                            "shoulderDates": "",
                            "blockStatus": {
                                "bookingStatus": {
                                    "status": {
                                        "code": reservation.currentBlockStatus
                                    }
                                }
                            },
                            "reservationType": {
                                "reservationType": "GT"
                            },
                            "marketCode": {
                            "marketCode": "G"
                            },
                            "sourceOfSale": {
                                "sourceCode": {
                                    "sourceCode": "GD"
                                }
                            },
                            "reservationMethod": "",
                            "bookingType": "",
                            "blockOrigin": "PMS",
                            "rateProtectionDetails": {
                                "criteria": "None"
                            },
                            "nonCompeteDetails": {
                                "criteria": "None"
                            },
                            "blockClassification": "RegularBooking",
                            "cateringOnlyBlock": "false",
                            "allowRateOverride": "false",
                            "manualCutOff": "false",
                            "wholesaleBlock": "false",
                            "controlBlockLocally": "false"
                        },
                        "blockOwners": {
                            "owner": [
                                {
                                    "ownership": "Block",
                                    "ownerCode": "ALL",
                                    "primary": "true"
                                },
                                {
                                    "ownership": "Catering",
                                    "ownerCode": "ALL",
                                    "primary": "true"
                                },
                                {
                                    "ownership": "Rooms",
                                    "ownerCode": "ALL",
                                    "primary": "true"
                                }
                            ],
                            "lockBlockOwners": "false",
                            "lockRoomsOwners": "false",
                            "lockCateringOwners": "false"
                        },
                        "reservationDetails": {
                            "traceCode": "",
                            "breakfast": {
                                "breakfastIncluded": "false",
                                "price": ""
                            },
                            "porterage": {
                                "porterageIncluded": "false",
                                "price": ""
                            },
                            "elastic": "2",
                            "printRate": "true",
                            "housing": "true",
                            "controlBlockLocally": "false"
                        },
                        "catering": {
                            "cateringStatus": {
                                "bookingStatus": {
                                    "status": "PRO"
                                }
                            },
                            "eventAttendees": "",
                            "overrideEventsProcessingWarnings": "true"
                        },
                        "blockProfiles": {
                            "fullOverlay": "false"
                        },
                        "externalAttributes": {
                            "eventType": "Convention",
                            "rollEndDate": "false"
                        },
                        "hotelId": reservation.hotelId,
                        "markAsRecentlyAccessed": "true"
                    }
                }
            }
        }
    )
    
    
      .expect(201)
      .expect('Content-Type', /json/)
      .then(function(response){
        //console.log(response)
        const locationHeader = response.headers.location;
       // console.log("Location Header: ", locationHeader);

        const urlParts = locationHeader.split('/');
        BlockID = urlParts[urlParts.length - 1];
        console.log("BLOCK ID: ", BlockID);
    
    });



});
it('post api test copy block', async function({supertest}) {
await supertest
.request(reservation.request)
.post(`/blk/v1/hotels/GRVZA/block/${BlockID}/copy`)
.set('Content-Type', reservation['Content-Type1'])
.set('x-hotelid',  reservation.hotelId)
.set('x-app-key', reservation['x-app-key'])
.set('bypass-routing', reservation['bypass-routing'])
.set('Authorization', 'Bearer ' + authToken1)
.send({
    "criteria": {
        "sourceBlockId": {
            "type": "Block",
            "idContext": "OPERA",
            "id": BlockID
        },
        "newBlock": {
            "hotelId": reservation.hotelId,
            "blockCode": reservation.blockcode,
            "blockStatus": "TEN",
            "blockOrigin": "PMS",
            "cateringStatus": "PRO",
            "blockDatesRange": {
                "start": reservation.arrivalDate,
                "end": reservation.departureDate
            },
            "sourceDateRangeToCopy": "",
            "gridType": "ORIGINAL"
        },
        "copyInstructions": {
            "rooms": "false",
            "rateCode": "true",
            "blockComments": "false",
            "blockCode": "false",
            "catering": "false",
            "events": "false",
            "eventComments": "false",
            "resources": "false",
            "resourceComments": "false",
            "resourcePrices": "false",
            "attendeesCount": "true",
            "contractBilling": "false",
            "groupProfile": "false",
            "alternateDates": "false",
            "ratesOfAlternateDates": "false",
            "potentialProfile": "false",
            "adjustDecisionAndFollowupDate": "true",
            "createAsSubBlock": "false",
            "createAsTourBlock": "false",
            "overbook": "false",
            "contractGrid": "false",
            "changeNotes": "false",
            "otherResources": "false",
            "eventForecastFigures": "false"
        },
        "hotelId": reservation.hotelId
    }}
)
.expect(201)
      .expect('Content-Type', /json/)
      .then(function(response){
        console.log(response);
      })
});
 });