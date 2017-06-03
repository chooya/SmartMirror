(function() {

    function busService($http) {
        var service = {};
        service.busInfo = null;

        service.init = function() {
          return $http.get('/getplaylist', {
                transformResponse: function(cnv) {
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(cnv);
                    return aftCnv;
                }
            }).success(function(response) {
                //  console.log(response);
                return service.busInfo = response;
            });
        }; // init function close

        service.getBusList = function() {
            var arr1, arr2, msg1, msg2;
            busEvents = [];

            if (service.busInfo === null) {
                return null;
            }

            for (var i = 0; i < service.busInfo.ServiceResult.msgBody.itemList.length; i++) {
              msg1 = service.busInfo.ServiceResult.msgBody.itemList[i].arrmsg1;
              msg2 = service.busInfo.ServiceResult.msgBody.itemList[i].arrmsg2;

              if ((msg1.indexOf("]")) > 0) {
                  arr1 = msg1.replace(/]/g, "").split('[');
                  service.busInfo.ServiceResult.msgBody.itemList[i].arrmsg1 = arr1[0];
                  service.busInfo.ServiceResult.msgBody.itemList[i].arrmsgSec1 = arr1[1];
              }
              if ((msg2.indexOf("]")) > 0) {
                  arr2 = msg2.replace(/]/g, "").split('[');
                  service.busInfo.ServiceResult.msgBody.itemList[i].arrmsg2 = arr2[0];
                  service.busInfo.ServiceResult.msgBody.itemList[i].arrmsgSec2 = arr2[1];
              }
              if (service.busInfo.ServiceResult.msgBody.itemList[i].vehId1 == "0") {
                service.busInfo.ServiceResult.msgBody.itemList[i].arrmsg1 = "운행종료";
                service.busInfo.ServiceResult.msgBody.itemList[i].arrmsg2 = "운행종료";
                service.busInfo.ServiceResult.msgBody.itemList[i].arrmsgSec1 = "운행종료";
                service.busInfo.ServiceResult.msgBody.itemList[i].arrmsgSec2 = "운행종료";
              }

                switch (service.busInfo.ServiceResult.msgBody.itemList[i].rtNm) {
                    case "420":
                        busEvents.push(service.busInfo.ServiceResult.msgBody.itemList[i]);
                        break;
                    case "144":
                        busEvents.push(service.busInfo.ServiceResult.msgBody.itemList[i]);
                        break;
                    default:
                }
            }
            // console.log(busEvents);
            return busEvents;


        };

        service.arriveBuslist = function() {
            var arrivelist = [];
            if (service.busInfo === null) {
                return null;
            }
            for (var i = 0; i < service.busInfo.ServiceResult.msgBody.itemList.length; i++) {
                if (service.busInfo.ServiceResult.msgBody.itemList[i].arrmsg1 == "곧 도착") {
                    arrivelist.push(service.busInfo.ServiceResult.msgBody.itemList[i].rtNm);
                }
            }
           // console.log(arrivelist);
            return arrivelist;
        };

       service.stationName = function() {
         var station="";
         var arsId="";
         if (service.busInfo === null) {
             return null;
         }
         station = service.busInfo.ServiceResult.msgBody.itemList["0"].stNm;
         arsId = service.busInfo.ServiceResult.msgBody.itemList["0"].arsId
         station = station + "(" + arsId + ")";
         return station;
       };

        return service;

    } // busService close

    angular.module('SmartMirror')
        .factory('busService', busService);

}());
