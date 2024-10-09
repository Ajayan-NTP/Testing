const fs = require("fs");
const XLSX = require("xlsx");
const supertest = require("supertest");
const path = require("path");

// Load the JSON data from the file
const FilePath = "./Config.json";
const Data = JSON.parse(fs.readFileSync(FilePath, "utf8"));
const filepath = Data.filepath;

// Load the JSON data from the file
const jsonFilePath = filepath.jsoninputpath2;
const testData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
//console.log(testData);

let excelData = [];
//let authToken1;
let BlockId;
let reservationId;
let externalReferenceId;
let pmsConfirmationNumber;
let externalConfirmationNumber;
let ihgConfirmationNumber;
describe("api Authu Token", function () {
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
              reservation.authToken1 = response.body.access_token;
              // Update the testData object with the new authToken
              testData.reservation = reservation;
              // Write the updated testData back to the JSON file
              fs.writeFileSync(jsonFilePath, JSON.stringify(testData, null, 2), 'utf8');
                //console.log('Auth Token:', authToken1); // Logging the token
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
      reservation.authToken = response.body.access_token;
      // Update the testData object with the new authToken
      testData.reservation = reservation;
      // Write the updated testData back to the JSON file
      fs.writeFileSync(jsonFilePath, JSON.stringify(testData, null, 2), 'utf8');
    })
        })
  //create the group block
  it("post api test to create the group block", async function ({ supertest }) {
    await supertest
      .request(reservation.request)
      .post(reservation.Postendpath3)
      .set("Content-Type", reservation["Content-Type1"])
      .set("x-hotelid", reservation.hotelId)
      .set("x-app-key", reservation["x-app-key"])
      .set("bypass-routing", reservation["bypass-routing"])
      .set("Authorization", "Bearer " + reservation.authToken1)
      .send({
        blocks: {
          blockInfo: {
            block: {
              blockDetails: {
                blockCode: reservation.blockcode,
                blockName: "Valid",
                timeSpan: {
                  startDate: reservation.arrivalDate,
                  endDate: reservation.departureDate,
                },
                shoulderDates: "",
                blockStatus: {
                  bookingStatus: {
                    status: {
                      code: "TEN",
                    },
                  },
                },
                reservationType: {
                  reservationType: "GT",
                },
                marketCode: {
                  marketCode: "Z",
                },
                sourceOfSale: {
                  sourceCode: {
                    sourceCode: "GD",
                  },
                },
                reservationMethod: "",
                bookingType: "",
                blockOrigin: "PMS",
                rateProtectionDetails: {
                  criteria: "None",
                },
                nonCompeteDetails: {
                  criteria: "None",
                },
                blockClassification: "RegularBooking",
                cateringOnlyBlock: "false",
                allowRateOverride: "false",
                manualCutOff: "false",
                wholesaleBlock: "false",
                controlBlockLocally: "false",
              },
              blockOwners: {
                owner: [
                  {
                    ownership: "Block",
                    ownerCode: "ALL",
                    primary: "true",
                  },
                  {
                    ownership: "Catering",
                    ownerCode: "ALL",
                    primary: "true",
                  },
                  {
                    ownership: "Rooms",
                    ownerCode: "ALL",
                    primary: "true",
                  },
                ],
                lockBlockOwners: "false",
                lockRoomsOwners: "false",
                lockCateringOwners: "false",
              },
              reservationDetails: {
                traceCode: "",
                breakfast: {
                  breakfastIncluded: "false",
                  price: "",
                },
                porterage: {
                  porterageIncluded: "false",
                  price: "",
                },
                elastic: "2",
                printRate: "true",
                housing: "true",
                controlBlockLocally: "false",
              },
              catering: {
                cateringStatus: {
                  bookingStatus: {
                    status: "",
                  },
                },
                eventAttendees: "",
                overrideEventsProcessingWarnings: "true",
              },
              blockProfiles: {
                fullOverlay: "false",
              },
              externalAttributes: {
                eventType: "Convention",
                rollEndDate: "false",
              },
              hotelId: reservation.hotelId,
              markAsRecentlyAccessed: "true",
            },
          },
        },
        _xmlns:
          "http://xmlns.oracle.com/cloud/adapter/REST/CreateGroupBlock/types",
      })

      .expect(201)
      .expect("Content-Type", /json/)
      .then(function (response) {
        // console.log(response)
        const locationHeader = response.headers.location;
        //console.log("Location Header: ", locationHeader);

        const urlParts = locationHeader.split("/");
        BlockId = urlParts[urlParts.length - 1];
        console.log("Block_ID: ", BlockId);
      });
  });

  it("PUT API Test to Update Block Inventory", async function ({ supertest }) {
    await supertest
      .request(reservation.request)
      .put(`/blk/v1/hotels/GRVEU/blocks/${BlockId}/allocation`)
      .set("Content-Type", reservation["Content-Type1"])
      .set("x-hotelid", reservation.hotelId)
      .set("x-app-key", reservation["x-app-key"])
      .set("bypass-routing", reservation["bypass-routing"])
      .set("Authorization", "Bearer " + reservation.authToken1)
      .send({
        criteria: {
          hotelId: reservation.hotelId,
          blockId: {
            type: "Block",
            idContext: "OPERA",
            id: BlockId,
          },
          allocationRoomTypes: {
            allocationGridDates: [
              {
                roomAllocationInfo: {
                  inventory: {
                    forceOverbook: "false",
                  },
                  rate: {
                    onePerson: "199",
                  },
                  start: reservation.arrivalDate,
                  end: reservation.arrivalDate,
                },
                allocation: "RATES",
              },
              {
                roomAllocationInfo: {
                  inventory: {
                    forceOverbook: "false",
                    onePerson: "3",
                  },
                  rate: "",
                  start: reservation.arrivalDate,
                  end: reservation.arrivalDate,
                },
                allocation: "INITIAL",
              },
            ],
            sellLimitGridDates: {
              sellLimit: "3",
              start: reservation.arrivalDate,
              end: reservation.arrivalDate,
            },
            roomType: reservation.roomType,
          },
          genericRoomType: "false",
        },
        _xmlns:
          "http://xmlns.oracle.com/cloud/adapter/REST/Create_Group_Block_Inventory/types",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(function (response) {
        //console.log(response)
      });
  });

  it("put api test Cancel the group block", async function ({ supertest }) {
    await supertest
      .request(reservation.request)
      .put(`/blk/v1/hotels/GRVEU/blocks/${BlockId}/status`)
      .set("Content-Type", reservation["Content-Type1"])
      .set("x-hotelid", reservation.hotelId)
      .set("x-app-key", reservation["x-app-key"])
      .set("bypass-routing", reservation["bypass-routing"])
      .set("Authorization", "Bearer " + reservation.authToken1)
      .send({
        verificationOnly: "false",
        changeBlockStatus: {
          hotelId: reservation.hotelId,
          blockId: {
            type: "Block",
            idContext: "OPERA",
            id: BlockId,
          },
          currentBlockStatus: "TEN",
          newBlockStatus: "DEF",
          reservationType: "GC",
          overbookAll: "false",
          cancelAllPMReservations: "false",
          applyChangesToCateringSatus: "false",
          overrideEventsProcessingWarnings: "false",
        },
        _xmlns: "http://xmlns.oracle.com/cloud/adapter/REST/Receive/types",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(function (response) {
        //console.log(response)
      });
  });

  it(`Post API Test for check block availability`, async function ({
    supertest,
  }) {
    await supertest
      .request(reservation.request)
      .get(`/blk/v1/hotels/GRVEU/blocks/${BlockId}/availability`)
      .query({
        rooms: 1,
        roomTypeCount: -1,
        children: 0,
        nights: 1,
        adults: 1,
        fetchAllocatedRoomType: "Allocated",
        overrideRateCode: false,
        arrivalDate: reservation.arrivalDate,
      })

      //.set('Content-Type', reservation['Content-Type'])
      .set("x-hotelid", reservation.hotelId)
      .set("x-app-key", reservation["x-app-key"])
      .set("bypass-routing", reservation["bypass-routing"])
      .set("Authorization", "Bearer " + reservation.authToken1)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(function (response) {
        // console.log(response)
      });
  });
  it("post api test to create the block rooming list", async function ({
    supertest,
  }) {
    await supertest
      .request(reservation.request)
      .post(`/blk/v1/blocks/${BlockId}/roomingList`)
      .set("Content-Type", reservation["Content-Type1"])
      .set("x-hotelid", reservation.hotelId)
      .set("x-app-key", reservation["x-app-key"])
      .set("bypass-routing", reservation["bypass-routing"])
      .set("Authorization", "Bearer " + reservation.authToken1)
      .send({
        blockInfo: {
          hotelId: "GRVEU",
          blockIdList: [
            {
              type: "Block",
              idContext: "OPERA",
              id: BlockId,
            },
            {
              type: "BlockCode",
              idContext: "OPERA",
              id: reservation.blockcode,
            },
          ],
        },
        reservations: {
          reservation: {
            roomingListSequence: "1",
            hotelReservation: {
              reservationIdList: {
                type: "Reservation",
                idContext: "OPERA",
                id: "-1",
              },
              roomStay: {
                roomRates: {
                  reservationBlock: {
                    blockIdList: [
                      {
                        type: "Block",
                        idContext: "OPERA",
                        id: BlockId,
                      },
                      {
                        type: "BlockCode",
                        idContext: "OPERA",
                        id: reservation.blockcode,
                      },
                    ],
                    hotelId: reservation.hotelId,
                  },
                  roomType: reservation.roomType,
                  numberOfUnits: "1",
                  start: reservation.arrivalDate,
                  end: reservation.departureDate,
                },
                guestCounts: {
                  adults: "1",
                  children: "0",
                },
                expectedTimes: {
                  reservationExpectedArrivalTime: reservation.arrivalDate,
                  reservationExpectedDepartureTime: reservation.departureDate,
                },
                guarantee: {
                  guaranteeCode: "GC",
                },
                arrivalDate: reservation.arrivalDate,
                departureDate: reservation.departureDate,
              },
              reservationGuests: {
                profileInfo: {
                  profile: {
                    customer: {
                      personName: [
                        {
                          givenName: reservation.givenName,
                          surname: reservation.lastName,
                          nameType: "Primary",
                        },
                        {
                          nameType: "Alternate",
                        },
                      ],
                    },
                    addresses: {
                      addressInfo: {
                        address: {
                          addressLine: ["", "", "", ""],
                          country: "",
                        },
                      },
                    },
                  },
                },
              },
              reservationProfiles: {
                reservationProfile: [
                  {
                    resProfileType: "Company",
                    reservationProfileType: "Company",
                  },
                  {
                    resProfileType: "Group",
                    reservationProfileType: "Group",
                  },
                  {
                    resProfileType: "TravelAgent",
                    reservationProfileType: "TravelAgent",
                  },
                  {
                    resProfileType: "ReservationContact",
                    reservationProfileType: "ReservationContact",
                  },
                  {
                    resProfileType: "Source",
                    reservationProfileType: "Source",
                  },
                  {
                    resProfileType: "BillingContact",
                    reservationProfileType: "BillingContact",
                  },
                  {
                    resProfileType: "Addressee",
                    reservationProfileType: "Addressee",
                  },
                ],
                commissionPayoutTo: "None",
              },
              reservationPaymentMethods: [
                {
                  paymentCard: {
                    cardType: "Ax",
                    cardNumber: "7800499385160690005",
                    cardNumberMasked: "XXXXXXXXXXXX0005",
                    expirationDate: "2028-12-31",
                    storeToCreditCardWallet: "true",
                  },
                  emailFolioInfo: {
                    emailFolio: "false",
                  },
                  paymentMethod: "AX",
                  folioView: "1",
                },
                {
                  emailFolioInfo: {
                    emailFolio: "false",
                  },
                  folioView: "2",
                },
                {
                  emailFolioInfo: {
                    emailFolio: "false",
                  },
                  folioView: "3",
                },
                {
                  emailFolioInfo: {
                    emailFolio: "false",
                  },
                  folioView: "4",
                },
                {
                  emailFolioInfo: {
                    emailFolio: "false",
                  },
                  folioView: "5",
                },
                {
                  emailFolioInfo: {
                    emailFolio: "false",
                  },
                  folioView: "6",
                },
                {
                  emailFolioInfo: {
                    emailFolio: "false",
                  },
                  folioView: "7",
                },
                {
                  emailFolioInfo: {
                    emailFolio: "false",
                  },
                  folioView: "8",
                },
              ],
              cashiering: {
                taxType: {
                  code: "0",
                  collectingAgentTax: "false",
                  printAutoAdjust: "false",
                },
                reverseCheckInAllowed: "false",
                reverseAdvanceCheckInAllowed: "false",
              },
              extSystemSync: "false",
              userDefinedFields: {
                characterUDFs: {
                  name: "UDFC23",
                },
              },
              hotelId: "GRVEU",
              reservationStatus: "Reserved",
              preRegistered: "false",
              allowMobileCheckout: "false",
            },
          },
        },
        _xmlns:
          "http://xmlns.oracle.com/cloud/adapter/REST/CreateRoomingList_Opera/types",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(function (response) {
        //  console.log(response.text);
        const responseBody = JSON.parse(response.text); // Parse the response

        // Access reservationIdList safely using optional chaining
        const reservationIdList =
          responseBody?.reservations?.reservation?.[0]?.hotelReservation?.reservationIdList;

        const confirmationIdEntry = reservationIdList?.find((idEntry) => idEntry.type === "Confirmation");
        confirmationId = confirmationIdEntry? confirmationIdEntry.id: "Not found";
        const reservationIdEntry = reservationIdList?.find((entry) => entry.type === "Reservation");
        reservationId = reservationIdEntry? reservationIdEntry.id: "Not found";

        // Log the results
        console.log("Reservation ID:", reservationId);
        console.log("Confirmation ID:", confirmationId);
      });
  });

  //         it("PUT Update Reservation", async function ({ supertest }) {
  //           await supertest
  //          .request(reservation.request)
  //          .put(reservation.Getendpath + reservationId)
  //          .set("Content-Type", reservation['Content-Type1'])
  //          .set("x-hotelid", reservation.hotelId)
  //          .set("x-app-key", reservation['x-app-key'])
  //          .set("bypass-routing", reservation['bypass-routing'])
  //          .set("Authorization", "Bearer " + reservation.authToken1)
  //          .send({
  //              reservations: {
  //                  responseInstructions: {
  //                      confirmationOnly: true,
  //                  },
  //                  changeInstrunctions: {
  //                      updatePackagePrice: false,
  //                      changeAllShares: false,
  //                      overrideInventory: false,
  //                  },
  //                  reservationIdList: {
  //                      type: "Reservation",
  //                      idContext: "OPERA",
  //                      id: reservationId,
  //                  },
  //                  roomStay: {
  //                      currentRoomInfo: {
  //                          roomType: reservation.roomType1,
  //                      },
  //                      roomRates: {
  //                          rates: {
  //                              rate: {
  //                                  base: {
  //                                      amountBeforeTax: 299,
  //                                      currencyCode: "USD",
  //                                  },
  //                                  discount: "",
  //                                  eventStartDate: reservation.startDate,
  //                                  startDate: reservation.startDate,
  //                                  start: reservation.startDate,
  //                                  end: reservation.endDate,
  //                                  endDate: reservation.endDate,
  //                                  eventEndDate: reservation.endDate,
  //                              },
  //                          },
  //                          stayProfiles: [
  //                              {
  //                                  resProfileType: "Company",
  //                                  reservationProfileType: "Company",
  //                              },
  //                              {
  //                                  resProfileType: "Group",
  //                                  reservationProfileType: "Group",
  //                              },
  //                              {
  //                                  resProfileType: "TravelAgent",
  //                                  reservationProfileType: "TravelAgent",
  //                              },
  //                              {
  //                                  resProfileType: "ReservationContact",
  //                                  reservationProfileType: "ReservationContact",
  //                              },
  //                              {
  //                                  resProfileType: "BillingContact",
  //                                  reservationProfileType: "BillingContact",
  //                              },
  //                              {
  //                                  resProfileType: "Source",
  //                                  reservationProfileType: "Source",
  //                              },
  //                          ],
  //                          guestCounts: {
  //                              adults: reservation.adults,
  //                              children: reservation.children,
  //                          },
  //                          taxFreeGuestCounts: {
  //                              adults: 0,
  //                              children: 0,
  //                          },
  //                          roomType: reservation.roomType1,
  //                          ratePlanCode: reservation.ratePlanCode,
  //                          marketCode: reservation.marketCode,
  //                          sourceCode: reservation.sourceCode,
  //                          numberOfUnits: reservation.numberOfUnits,
  //                          roomId: "",
  //                          pseudoRoom: false,
  //                          roomTypeCharged: reservation.roomTypeCharged1,
  //                          fixedRate: true,
  //                          discountAllowed: true,
  //                          eventStartDate: reservation.startDate,
  //                          startDate: reservation.startDate,
  //                          start: reservation.startDate,
  //                          end: reservation.endDate,
  //                          endDate: reservation.endDate,
  //                          eventEndDate: reservation.endDate,
  //                      },
  //                      guestCounts: {
  //                          adults: reservation.adults,
  //                          children: reservation.children,
  //                      },
  //                      expectedTimes: {
  //                          reservationExpectedArrivalTime: reservation.arrivalDate,
  //                          resExpectedArrivalTime: reservation.arrivalDate,
  //                          reservationExpectedDepartureTime: reservation.departureDate,
  //                          resExpectedDepartureTime: reservation.departureDate,
  //                      },
  //                      guarantee: {
  //                          guaranteeCode: reservation.guaranteeCode,
  //                      },
  //                      promotion: "",
  //                      arrivalDate: reservation.arrivalDate,
  //                      departureDate: reservation.departureDate,
  //                  },
  //                  reservationGuests: {
  //                      profileInfo: {
  //                          profileIdList: {
  //                              type: "Profile",
  //                              idContext: "OPERA",
  //                              id: reservation.profileId
  //                          },
  //                          profile: {
  //                              customer: {
  //                                  personName: [
  //                                      {
  //                                          givenName: reservation.givenName,
  //                                          surname: reservation.lastName,
  //                                          nameType: "Primary",
  //                                      },
  //                                      {
  //                                          nameType: "Alternate",
  //                                      },
  //                                  ],
  //                              },
  //                          },
  //                      },
  //                      arrivalTransport: {
  //                          transportationReqd: false,
  //                      },
  //                      departureTransport: {
  //                          transportationReqd: false,
  //                      },
  //                  },
  //                  additionalGuestInfo: "",
  //                  reservationProfiles: {
  //                      reservationProfile: [
  //                          {
  //                              reservationProfileType: "Company",
  //                          },
  //                          {
  //                              reservationProfileType: "Group",
  //                          },
  //                          {
  //                              reservationProfileType: "TravelAgent",
  //                          },
  //                          {
  //                              reservationProfileType: "ReservationContact",
  //                          },
  //                          {
  //                              reservationProfileType: "Source",
  //                          },
  //                          {
  //                              reservationProfileType: "BillingContact",
  //                          },
  //                          {
  //                              reservationProfileType: "Addressee",
  //                          },
  //                      ],
  //                      commissionPayoutTo: "None",
  //                  },
  //                  reservationCommunication: {
  //                      telephones: {
  //                          telephoneInfo: [
  //                              {
  //                                  telephone: {
  //                                      orderSequence: 1,
  //                                  },
  //                              },
  //                              {
  //                                  telephone: {
  //                                      orderSequence: 2,
  //                                  },
  //                              },
  //                          ],
  //                      },
  //                      emails: {
  //                          emailInfo: [
  //                              {
  //                                  email: {
  //                                      orderSequence: 1,
  //                                  },
  //                              },
  //                              {
  //                                  email: {
  //                                      orderSequence: 2,
  //                                  },
  //                              },
  //                          ],
  //                      },
  //                  },
  //                  cashiering: {
  //                      taxType: {
  //                          code: 0,
  //                          collectingAgentTax: false,
  //                          printAutoAdjust: false,
  //                      },
  //                      reverseCheckInAllowed: false,
  //                      reverseAdvanceCheckInAllowed: false,
  //                  },
  //                  userDefinedFields: {
  //                      characterUDFs: {
  //                          name: "UDFC01",
  //                          value: "T",
  //                      },
  //                  },
  //                  hotelId: reservation.hotelId,
  //                  reservationStatus: "Reserved",
  //                  printRate: true,
  //                  customReference: "",
  //                  displayColor: "",
  //                  markAsRecentlyAccessed: true,
  //                  preRegistered: false,
  //                  allowMobileCheckout: false,
  //                  optedForCommunication: false,
  //                  overrideOutOfServiceCheck: true,
  //              },
  //          })
  //          .expect(200)
  //          .expect("Content-Type", /json/)
  //          .then(function (response) {
  //            //  console.log(response)
  //          });
  //   });

  // // GET request
  it("GET Reservation  OHIP", async function ({ supertest }) {
    await supertest
      .request(reservation.request)
      .get(reservation.Getendpath + reservationId)
      .set("Content-Type", reservation["Content-Type1"])
      .set("x-hotelid", reservation.hotelId)
      .set("x-app-key", reservation["x-app-key"])
      .set("bypass-routing", reservation["bypass-routing"])
      .set("Authorization", "Bearer " + reservation.authToken1)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(function (response) {
        const responseBody = JSON.parse(response.text);
        const reservation = responseBody.reservations.reservation[0];

        const confirmationIdEntry = reservation.reservationIdList.find((idEntry) => idEntry.type === "Confirmation");
        confirmationId = confirmationIdEntry? confirmationIdEntry.id: "Not found";

        const externalReferenceIdEntry = reservation.externalReferences.find((ref) => ref.idContext === "CRS_IHGGEU");
        externalReferenceId = externalReferenceIdEntry? externalReferenceIdEntry.id: "Not found";

        console.log("Status : Reservation created Successfully in OHIP");
        console.log("Reservation ID :", reservationId);
        console.log("Confirmation ID:", confirmationId);
        console.log("External Reference ID:", externalReferenceId);
      });
  });
  it("GET Reservation  GRS", async function ({ supertest }) {
    await supertest
      .request(reservation.request2)
      .get(reservation.Getendpath1 + externalReferenceId)
      .query({
        lastName: reservation.lastName,
      })
      .set("Content-Length", "0")
      .set("X-IHG-M2M", reservation["X-IHG-M2M"])
      .set("User-Agent", reservation["User-Agent"])
      .set("X-IHG-AUTO", reservation["X-IHG-AUTO"])
      .set("X-IHG-API-KEY", reservation["X-IHG-API-KEY"])
      .set("bypass-routing", reservation["bypass-routing"])
      .set("Authorization", "Bearer " + reservation.authToken)
      .expect(200)
      .expect("Content-Type", /json/)
      .then(function (response) {
       // console.log(response.text);
        const responseBody = JSON.parse(response.text);
        const reservation = responseBody.hotelReservation;

        const ihgConfirmationNumberEntry =reservation.reservationIds.confirmationNumbers.find((entry) => entry.ihgConfirmationNumber);
        ihgConfirmationNumber = ihgConfirmationNumberEntry? ihgConfirmationNumberEntry.ihgConfirmationNumber: "Not found";

        const externalConfirmationNumberEntry =reservation.reservationIds.confirmationNumbers.find((entry) =>entry.externalConfirmationNumber &&entry.externalConfirmationNumber.number);
        externalConfirmationNumber = externalConfirmationNumberEntry? externalConfirmationNumberEntry.externalConfirmationNumber.number: "Not found";

        const pmsConfirmationNumberEntry =
          reservation.reservationIds.confirmationNumbers.find((entry) => entry.pmsConfirmationNumber);
        pmsConfirmationNumber = pmsConfirmationNumberEntry? pmsConfirmationNumberEntry.pmsConfirmationNumber: "Not found";

        // console.log(response)
        console.log("Status: Reservation created Successfully in GRS");
        console.log("IHG Confirmation Number:", ihgConfirmationNumber);
        console.log("External Confirmation Number:",externalConfirmationNumber);
        console.log("PMS Confirmation Number:", pmsConfirmationNumber);
        excelData.push([
          BlockId,
          reservationId,
          confirmationId,
          externalReferenceId,
          ihgConfirmationNumber,
          externalConfirmationNumber,
          pmsConfirmationNumber,
        ]);
      });
  });

  after(function () {
    const excelFilePath = path.join(filepath.exceloutputpath2);

    // Ensure the directory exists
    const dir = path.dirname(excelFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let wb;
    let ws;

    // Define a unique sheet name for each program
    const sheetName = "BlockRoominglistEU2"; // Change this for each program (e.g., 'Program1', 'Program2', etc.)

    // Use an object to map sheet names to their corresponding headers
    const headersMap = {
      'BlockRoominglistEU2': ['BlockID', 'Reservation ID', 'Confirmation ID', 'External Reference ID', 'IHG Confirmation Number', 'External Confirmation Number', 'PMS Confirmation Number'],
      
  };

    // Get the appropriate headers for the current program from the map
    const headers = headersMap[sheetName];

    // Check if the Excel file exists
    if (fs.existsSync(excelFilePath)) {
      // If the file exists, read the workbook
      wb = XLSX.readFile(excelFilePath);

      // Check if the specific sheet for the program exists
      if (wb.SheetNames.includes(sheetName)) {
        // Load the existing sheet
        ws = wb.Sheets[sheetName];

        // Convert the existing sheet to JSON format for easy manipulation
        let existingData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Append new data to the existing sheet
        existingData.push(...excelData);

        // Log the data being appended for debugging
        // console.log("Data being appended:", existingData);

        // Convert the updated data back to a sheet
        ws = XLSX.utils.aoa_to_sheet(existingData);

        // Remove the old sheet
        wb.SheetNames = wb.SheetNames.filter((sheet) => sheet !== sheetName);
      } else {
        // If the sheet doesn't exist, create it and prepend headers
        let existingData = [];
        existingData.push(headers); // Add headers for the new sheet
        existingData.push(...excelData);

        // Create a new sheet from the data
        ws = XLSX.utils.aoa_to_sheet(existingData);
      }
    } else {
      // If the file doesn't exist, create a new workbook and sheet
      wb = XLSX.utils.book_new();

      let existingData = [];
      existingData.push(headers); // Add headers for the new sheet
      existingData.push(...excelData);

      // Create a new sheet from the data
      ws = XLSX.utils.aoa_to_sheet(existingData);
    }

    // Append the updated or newly created sheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Save the updated workbook to the Excel file
    XLSX.writeFile(wb, excelFilePath);
    // console.log(`Data successfully saved to ${excelFilePath} under sheet: ${sheetName}`);
  });
});
