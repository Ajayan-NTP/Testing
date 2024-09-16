const fs = require('fs');
const XLSX = require('xlsx');
const supertest = require('supertest');
const path = require('path');




// Load the JSON data from the file
const jsonFilePath = 'C:/Users/Ajayan/NightWatch/nightwatch/Block_Flows/BLOCK_za/GRVZA.json';
const testData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
//console.log(testData);
let excelData = [];
let authToken1;
let BlockID; 
let cancellationId;
let StartDate;
let EndDate;


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
                                    "status": ""
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
it('Get api test after the block create', async function ({ supertest }) {
  await supertest
    .request(reservation.request)
    .get(`/blk/v1/hotels/GRVZA/blocks/${BlockID}`)
   .set('Content-Type', reservation['Content-Type1'])
  .set('x-hotelid', reservation.hotelId)
  .set('x-app-key', reservation['x-app-key1'])
  .set('bypass-routing', reservation['bypass-routing'])
  .set('Authorization', 'Bearer ' + authToken1)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(function (response) {
     // console.log(response.text); // Output the raw response for debugging
      
      // Parse the response text into a JSON object
      const jsonResponse = JSON.parse(response.text);
      
      // Now access the fields safely
      const blockInfo = jsonResponse.blocks.blockInfo[0].block.blockDetails;
      const startDate = blockInfo.timeSpan.startDate;
       StartDate = startDate;
      const endDate = blockInfo.timeSpan.endDate;
       EndDate = endDate;
      
      // Print the extracted data
      console.log('Start Date:',StartDate);
      console.log('End Date:', EndDate);
      
      
    });
     
    });
  

it('put api test update the date of block', async function({supertest}) {
    await supertest
     .request(reservation.request)
     .put(`/blk/v1/hotels/GRVZA/blocks/${BlockID}`)
      .set('Content-Type', reservation['Content-Type1'])
     .set('x-hotelid', reservation.hotelId)
     .set('x-app-key', reservation['x-app-key1'])
     .set('bypass-routing', reservation['bypass-routing'])
     .set('Authorization', 'Bearer ' + authToken1)
    .send({
        "blocks": {
          "responseInstructions": {
            "confirmationOnly": true
          },
          "blockIdList": {
            "type": "Block",
            "idContext": "OPERA",
            "id": BlockID
          },
          "blockDetails": {
            "blockCode": reservation.blockcode,
            "blockName": reservation.blockName,
            "timeSpan": {
              "startDate": reservation.changestartdate,
              "endDate": reservation.changeenddate
            },
            "blockDates": {
              "startDate":  reservation.changestartdate,
              "endDate":  reservation.changeenddate
            },
            "shoulderDates": "",
            "blockStatus": {
              "bookingStatus": {
                "status": {
                  "code": "TEN"
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
            "status": "I",
            "paymentMethod": "",
            "currencyCode": "",
            "blockClassification": "RegularBooking",
            "synchronized": false,
            "cateringOnlyBlock": false,
            "flexibleDates": false,
            "autoloadContractGrid": true,
            "allowRateOverride": false,
            "manualCutOff": false,
            "wholesaleBlock": false,
            "controlBlockLocally": true
          },
          "blockOwners": {
            "owner": [
              {
                "ownership": "Block",
                "hotel": {
                  "code": reservation.hotelId
                },
                "ownerCode": "ALL",
                "profileId": {
                  "type": "Profile",
                  "idContext": "OPERA",
                  "id": reservation.profileId
                },
                "name": {
                  "givenName": reservation.givenName,
                  "surname": reservation.lastName
                },
                "email": {
                  "email": ""
                },
                "primary": true
              },
              {
                "ownership": "Rooms",
                "hotel": {
                  "code": reservation.hotelId
                },
                "ownerCode": "ALL",
                "profileId": {
                  "type": "Profile",
                  "idContext": "OPERA",
                  "id": reservation.profileId
                },
                "name": {
                  "givenName": reservation.givenName,
                  "surname":  reservation.lastName
                },
                "email": {
                  "email": ""
                },
                "primary": true
              },
              {
                "ownership": "Catering",
                "hotel": {
                  "code": reservation.hotelId
                },
                "ownerCode": "ALL",
                "profileId": {
                  "type": "Profile",
                  "idContext": "OPERA",
                  "id": reservation.profileId
                },
                "name": {
                  "givenName": reservation.givenName,
                  "surname": reservation.lastName
                },
                "email": {
                  "email": ""
                },
                "primary": true
              }
            ],
            "lockBlockOwners": false,
            "lockRoomsOwners": false,
            "lockCateringOwners": false
          },
          "reservationDetails": {
            "breakfast": {
              "breakfastIncluded": false,
              "price": ""
            },
            "porterage": {
              "porterageIncluded": false,
              "price": ""
            },
            "cutOffDays": 0,
            "updateGridOnCutoffChange": false,
            "elastic": 2,
            "suppressRate": false,
            "printRate": true,
            "rateGuarantee": false,
            "housing": true,
            "guaranteeRequired": false,
            "controlBlockLocally": true
          },
          "catering": {
            "cateringStatus": {
              "bookingStatus": {
                "status": ""
              }
            },
            "eventAttendees": {
              "attendeesGuaranteed": false
            },
            "trackChanges": false,
            "eventOrder": {
              "distributed": false
            },
            "pkgsTmplt": false,
            "overrideEventsProcessingWarnings": false
          },
          "blockSecurity": {
            "securedFromDIDisplayYn": false,
            "securedFromDIDisplay": false,
            "securedFromDIdisplayYn": false,
            "allDescriptionDDSecured": false,
            "allDescriptionDDSecuredYn": false,
            "ratesSecuredfromGNRYn": false,
            "ratesSecuredfromGNR": false,
            "ratesSecuredfromAllDisplays": false,
            "ratesSecuredfromAllDisplaysYn": false,
            "housingInformationSecured": false,
            "housingInformationSecuredYn": false,
            "returnOneDayAtTimeYn": false,
            "commissionableYn": false
          },
          "externalAttributes": {
            "eventType": "Convention",
            "rollEndDate": false
          },
          "hotelId": reservation.hotelId,
          "markAsRecentlyAccessed": true
        }
      })
    .expect(200)
    .expect('Content-Type', /json/)
    .then(function(response){
     // console.log(response)
      
  });
});
it('put api test Cancel the group block', async function({supertest}) {
    await supertest
     .request(reservation.request)
     .put(`/blk/v1/hotels/GRVZA/blocks/${BlockID}/status`)
      .set('Content-Type', reservation['Content-Type1'])
     .set('x-hotelid', reservation.hotelId)
     .set('x-app-key', reservation['x-app-key1'])
     .set('bypass-routing', reservation['bypass-routing'])
     .set('Authorization', 'Bearer ' + authToken1)
    .send(
        {
            "verificationOnly": "false",
            "changeBlockStatus": {
                "hotelId": reservation.hotelId,
                "blockId": {
                    "type": "Block",
                    "idContext": "OPERA",
                    "id": BlockID
                },
                "currentBlockStatus": "TEN",
                "newBlockStatus": "CXL",
                "reservationType": "GT",
                "cancellationDetails": {
                    "cancellationCode": {
                        "code": "CRS"
                    },
                    "cancellationInfo": "Cancelled by CRS"
                },
                "pMReservationsCancellationDetails": {
                    "cancellationCode": {
                        "code": "CRS"
                    }
                },
                "overbookAll": "false",
                "cancelAllPMReservations": "true",
                "applyChangesToCateringSatus": "false",
                "overrideEventsProcessingWarnings": "false"
            },
            "_xmlns": "http://xmlns.oracle.com/cloud/adapter/REST/Receive/types"
        }
    
    ,)
    .expect(200)
      .expect('Content-Type', /json/)
      .then(function(response) {
        //console.log(response)
        // Extract block ID
        const BlockId = response.body.block.blockIdList[0].id || 'Not found';
      
        // Extract cancellation ID
        const cancellationDetails = response.body.cancellationDetails || {};
        cancellationId = cancellationDetails.cancellationNumber?.id || 'Not found';
        
      
        // Console output to show extracted values
        console.log(`Status: Block cancellation retrieved successfully`);
        
          console.log('Cancellation ID:', cancellationId);

      });
    });
      
      it('Get api test uses get block data', async function ({ supertest }) {
        await supertest
          .request(reservation.request)
          .get(`/blk/v1/hotels/GRVZA/blocks/${BlockID}`)
         .set('Content-Type', reservation['Content-Type1'])
        .set('x-hotelid', reservation.hotelId)
        .set('x-app-key', reservation['x-app-key1'])
        .set('bypass-routing', reservation['bypass-routing'])
        .set('Authorization', 'Bearer ' + authToken1)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(function (response) {
           // console.log(response.text); // Output the raw response for debugging
            
            // Parse the response text into a JSON object
            const jsonResponse = JSON.parse(response.text);
            
            // Now access the fields safely
            const blockInfo = jsonResponse.blocks.blockInfo[0].block.blockDetails;
            const startDate = blockInfo.timeSpan.startDate;
            let newstartdate = startDate;
            const endDate = blockInfo.timeSpan.endDate;
            let newenddate = endDate;
            const blockCode = blockInfo.blockCode;
            let Blockcode =  blockCode;
           
          const cancellationId = blockInfo.cancellationDetails.cancellationNumber.id;
          let Cancellationid= cancellationId;
            // Print the extracted data
            console.log('Start Date:',newstartdate );
            console.log('End Date:',newenddate );
            console.log('Block Code:',Blockcode );
            console.log('Cancellation ID:',Cancellationid);
            excelData.push([BlockID, StartDate, EndDate, Cancellationid, newstartdate, newenddate, Blockcode]); 
          });
           
          });
        
    
    after(function () {
      const excelFilePath = path.join('C:/Users/Ajayan/NightWatch/nightwatch/Block_Flows/BLOCK_za/file/BLOCKFLOW6.xlsx');
      
      // Ensure the directory exists
      const dir = path.dirname(excelFilePath);
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
      }
    
      let existingData = [];
    
      // Check if the file exists and read existing data
      if (fs.existsSync(excelFilePath)) {
          const wb = XLSX.readFile(excelFilePath);
          const ws = wb.Sheets[wb.SheetNames[0]];
          existingData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      }
    
      // Append new data to existing data
      existingData.push(...excelData);
    
      // Prepend headers if the file was empty or newly created
      if (existingData.length === excelData.length) {
          const headers = ['BlockID', 'StartDate', 'EndDate', 'Cancellation ID', 'New Startdate', 'New enddate', 'Blockcode'];
          existingData.unshift(headers);
      }
    
      // Log the data being written for debugging
     // console.log("Data to be written:", existingData);
    
      // Create a new workbook and a sheet from the data
      const ws = XLSX.utils.aoa_to_sheet(existingData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Block Data");
    
      // Save to Excel file
      XLSX.writeFile(wb, excelFilePath);
      console.log(`Data successfully written to ${excelFilePath}`);
    });
      
  });  
